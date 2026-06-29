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
    let binary = "";
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const adminCookie = request.cookies.get("ecs_admin")?.value;
  const parentCookie = request.cookies.get("ecs_parent_student")?.value;

  // Protect admin/dashboard routes – redirect to standalone admin login
  if (
    (pathname.startsWith("/admin") || pathname.startsWith("/dashboard")) &&
    pathname !== "/admin-login" &&
    !pathname.startsWith("/api/")
  ) {
    if (!adminCookie) {
      return NextResponse.redirect(new URL("/admin-login", request.url));
    }
    const expected = await adminTokenEdge();
    if (adminCookie !== expected) {
      const res = NextResponse.redirect(new URL("/admin-login", request.url));
      res.cookies.delete("ecs_admin");
      return res;
    }
  }

  // Protect parent routes
  if (pathname.startsWith("/parent") && !pathname.startsWith("/api/")) {
    if (!parentCookie) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    const payload = await verifyTokenEdge(parentCookie);
    if (!payload || typeof payload.studentId !== "string") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/dashboard", "/dashboard/:path*", "/parent/:path*"],
};
