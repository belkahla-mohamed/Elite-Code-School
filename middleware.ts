import { NextResponse, type NextRequest } from "next/server";

async function verifyTokenEdge(token: string): Promise<Record<string, unknown> | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [header, body, sig] = parts;
    const secret = process.env.AUTH_COOKIE_SECRET ?? "elite-code-school-dev-secret";
    const encoder = new TextEncoder();
    const data = encoder.encode(`${header}.${body}.${secret}`);
    const hash = await crypto.subtle.digest("SHA-256", data);
    const bytes = new Uint8Array(hash);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    const expected = btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
    if (sig !== expected) return null;
    const payload = JSON.parse(atob(body));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

async function adminTokenEdge(): Promise<string | null> {
  try {
    const secret = process.env.AUTH_COOKIE_SECRET ?? "elite-code-school-dev-secret";
    const encoder = new TextEncoder();
    const hash = await crypto.subtle.digest("SHA-256", encoder.encode(`admin:${secret}`));
    const bytes = new Uint8Array(hash);
    return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const adminCookie = request.cookies.get("ecs_admin")?.value;
  const parentCookie = request.cookies.get("ecs_parent_student")?.value;

  // Protect admin/dashboard routes – only admins may enter
  if (
    (pathname.startsWith("/admin") || pathname.startsWith("/dashboard")) &&
    pathname !== "/admin-login" &&
    !pathname.startsWith("/api/")
  ) {
    if (!adminCookie) {
      // Parent/student already signed in -> send them to their own space
      if (parentCookie && (await verifyTokenEdge(parentCookie))?.studentId) {
        return NextResponse.redirect(new URL("/parent", request.url));
      }
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Check if it's the old static token (legacy fallback)
    const expectedStatic = await adminTokenEdge();
    if (adminCookie === expectedStatic) {
      // Legacy token is ok
    } else {
      // Verify JWT
      const payload = await verifyTokenEdge(adminCookie);
      if (!payload || (payload.role !== "admin" && payload.role !== "super_admin")) {
        const res = NextResponse.redirect(new URL("/login", request.url));
        res.cookies.delete("ecs_admin");
        return res;
      }

      // Check specific route permissions for normal admins
      if (payload.role === "admin") {
        const permissions = (payload.permissions as string[]) || [];
        const permissionMap: Record<string, string> = {
          "/admin/enrollments": "inscriptions",
          "/admin/students": "students",
          "/dashboard/parents": "students",
          "/admin/curricula": "programs",
          "/dashboard/categories": "categories",
          "/dashboard/cms": "cms",
          "/dashboard/projects": "cms",
          "/dashboard/gallery": "cms",
          "/dashboard/announcements": "cms",
          "/dashboard/certifications": "certificates",
          "/dashboard/admin-users": "admins",
        };

        for (const [route, requiredPerm] of Object.entries(permissionMap)) {
          if (pathname.startsWith(route) && !permissions.includes(requiredPerm)) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
          }
        }
      }
    }
  }

  // Protect parent routes – admins get bounced to the dashboard
  if (pathname.startsWith("/parent") && !pathname.startsWith("/api/")) {
    const parentPayload = parentCookie ? await verifyTokenEdge(parentCookie) : null;
    if (!parentPayload || typeof parentPayload.studentId !== "string") {
      if (adminCookie) {
        const expectedStatic = await adminTokenEdge();
        const adminPayload = adminCookie === expectedStatic ? { role: "super_admin" } : await verifyTokenEdge(adminCookie);
        if (adminPayload && (adminPayload.role === "admin" || adminPayload.role === "super_admin")) {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
      }
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/dashboard", "/dashboard/:path*", "/parent/:path*"],
};
