import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminCookie = request.cookies.get("ecs_admin")?.value;
  const parentCookie = request.cookies.get("ecs_parent_student")?.value;
  const teacherCookie = request.cookies.get("ecs_teacher")?.value;

  // Protect admin routes (except /admin login page itself)
  if (pathname.startsWith("/admin") && pathname !== "/admin" && !pathname.startsWith("/api/")) {
    if (!adminCookie) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  // Protect parent routes
  if (pathname.startsWith("/parent") && !pathname.startsWith("/api/")) {
    if (!parentCookie) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Protect teacher routes
  if (pathname.startsWith("/teacher") && !pathname.startsWith("/api/")) {
    if (!teacherCookie) {
      return NextResponse.redirect(new URL("/teacher", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/parent/:path*", "/teacher/:path*"],
};
