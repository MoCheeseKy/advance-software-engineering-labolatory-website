import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
    // Bypass authentication & JWT checks untuk saat ini, karena fokus pada pembuatan UI dummy
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/admin/:path*", 
        "/api-docs/:path*",
        "/login"
    ],
};
