import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();

        // Verification
        const user = await prisma.admin.findUnique({
            where: { username },
        });

        if (!user){
            return NextResponse.json({ message: "Invalid username or password" }, { status: 401 }); 
        }
        if (user.password !== password) {
            return NextResponse.json({ message: "Invalid username or password" }, { status: 401 }); 
        }

        // Session
        const sessionData = {
            id: user.id_admin,
            username: user.username,
            email: user.email,
            role: user.role,
        }

        const cookie = await cookies();

        cookie.set({
            name: "session",
            value: JSON.stringify(sessionData),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24,
            path: "/",
        });
        
        // Redirect to admin dashboard
        const targetUrl = "/admin/dashboard";
        
        return NextResponse.json({ redirectUrl: targetUrl, message: "Login successful" }, { status: 200 });

    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}