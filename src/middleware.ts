import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const session      = request.cookies.get("session")?.value;

    const isAdminRoute = pathname.startsWith("/admin");
    const isLoginPage  = pathname === "/login";

    if (isAdminRoute && !session) {
        const loginUrl = new URL("/login", request.url);
       
        loginUrl.searchParams.set("from", pathname);
        return NextResponse.redirect(loginUrl);
    }

    if (isLoginPage && session) {
        return NextResponse.redirect(new URL("/admin", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/admin/:path*",
        "/api-docs/:path*",
        "/login",
    ],
};