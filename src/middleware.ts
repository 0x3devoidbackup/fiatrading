import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/signin", "/signup", "/reset-password"];
const AUTH_ROUTES = ["/signin", "/signup", "/reset-password"]; // Routes that logged-in users shouldn't access

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessToken");

  if (token && AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    const homeUrl = new URL("/home", request.url);
    return NextResponse.redirect(homeUrl);
  }

  // ✅ Allow access to public routes (for non-authenticated users)
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // ✅ Protected routes - require authentication
  if (!token) {
    const signinUrl = new URL("/signin", request.url);
    return NextResponse.redirect(signinUrl);
  }

  return NextResponse.next();
}

// Apply middleware to all routes except static files
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
