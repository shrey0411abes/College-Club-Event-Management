import { NextResponse } from "next/server";
import { verifyAdminToken, COOKIE_NAME } from "@/lib/auth";

// Next.js 16+: "middleware" has been renamed to "proxy".
// The exported function must also be named "proxy" (or be a default export).
export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // 1. Allow login and logout endpoints through
  if (
    pathname === "/admin/login" ||
    pathname === "/api/admin/login" ||
    pathname === "/api/admin/logout"
  ) {
    return NextResponse.next();
  }

  // 2. Check if the current request is an admin route or protected action
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  const requiresAuth = isAdminPage || isAdminApi;

  if (!requiresAuth) {
    return NextResponse.next();
  }

  // Extract token from cookie or Authorization header
  const token =
    request.cookies.get(COOKIE_NAME)?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");

  let isAuthenticated = false;
  try {
    const payload = await verifyAdminToken(token);
    isAuthenticated = Boolean(payload && payload.role === "admin");
  } catch (err) {
    // JWT_SECRET misconfiguration — deny access, log the error
    console.error("Auth error in proxy:", err.message);
  }

  if (!isAuthenticated) {
    // For API requests, return 401 JSON
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: Admin authentication required",
        },
        { status: 401 }
      );
    }

    // For page requests, redirect to /admin/login
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*"
  ],
};
