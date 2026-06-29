import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function GET() {
    try {
        // Authentication check
        const cookie = await cookies();
        const session = cookie.get('session')?.value;

        if (!session) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        // Verify the token
        try {
            await verifyToken(session);
        } catch (error) {
            return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 });
        }

        // Fetch all admin accounts
        const admins = await prisma.admin.findMany({
            select: {
                id_admin: true,
                username: true,
                email: true,
                role: true,
            },
            orderBy: { id_admin: "asc" },
        });

        return NextResponse.json({ success: true, data: admins }, { status: 200 });

    } catch (error) {
        console.error("Error fetching admin list:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        // Authentication check
        const cookie = await cookies();
        const session = cookie.get('session')?.value;

        if (!session) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        // Verify the token
        try {
            await verifyToken(session);
        } catch (error) {
            return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 });
        }

        // Data extraction and creation
        const body = await request.json();
        const { username, email, password, role } = body;

        if (!username || !email || !password || !role) {
            return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = await prisma.admin.create({
            data: {
                username,
                email,
                password: hashedPassword,
                role,
            },
            select: {
                id_admin: true,
                username: true,
                email: true,
                role: true,
            },
        });

        return NextResponse.json({ success: true, message: "Admin account created successfully", data: newAdmin }, { status: 201 });

    } catch (error) {
        console.error("Error creating admin account:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}