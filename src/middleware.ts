import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;

  // Default route logic
  if (request.nextUrl.pathname === "/") {
    if (token) {
      // Authenticated: redirect to homepage
      return NextResponse.redirect(new URL("/home", request.url));
    } else {
      // Not authenticated: redirect to landing
      return NextResponse.redirect(new URL("/landing", request.url));
    }
  }

  // Protected routes logic
  const protectedRoutes = [
    "/dashboard",
    "/profile",
    "/home",
    "/assessment",
    "/preassessment",
  ];
  if (
    protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))
  ) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
};
