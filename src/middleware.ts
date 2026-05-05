// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("bloom_admin_token")?.value;
  const isLoginPage = request.nextUrl.pathname === "/";

  if (!token && !isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon).*)"],
};
