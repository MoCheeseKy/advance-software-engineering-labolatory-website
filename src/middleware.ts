import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not defined");
}

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request: NextRequest) {
    const session = request.cookies.get("session")?.value;
    const { pathname } = request.nextUrl;

    if (pathname === "/login" && session) {
       try {
            await jwtVerify(session, SECRET_KEY);
            return NextResponse.redirect(new URL("/admin", request.url));

       } catch (error) {
            console.error("Token verification failed in middleware:", error);
            const response = NextResponse.next();
            response.cookies.delete("session");
            return response;
       }
    }

    if (pathname.startsWith("/admin") && !session) {
        const loginUrl = new URL("/login", request.url);
        return NextResponse.redirect(loginUrl);
    }

    if (pathname.startsWith("/admin") && session) {
        try {
            await jwtVerify(session, SECRET_KEY);
            return NextResponse.next(); 

        } catch (error) {
            console.error("Token verification failed in middleware:", error);
            const response = NextResponse.redirect(new URL("/login", request.url))  ;
            response.cookies.delete("session");
            return response;
        }
    }

    if (pathname === "/api-docs" && !session) {
        const loginUrl = new URL("/login", request.url);
        return NextResponse.redirect(loginUrl);
    }

    if (pathname.startsWith("/api-docs") && session) {
        try {
            await jwtVerify(session, SECRET_KEY);
            return NextResponse.next();

        } catch (error) {
            console.error("Token verification failed in middleware:", error);
            const response = NextResponse.redirect(new URL("/login", request.url))  ;
            response.cookies.delete("session");
            return response;
        }
    }
}

export const config = {
    matcher: [
        "/admin/:path*", 
        "/api-docs/:path*",
        "/login"
    ],
};