import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

import bcrypt from "bcryptjs";

export async function POST(request: Request){
    try {
        // Authentication check
        const cookie = await cookies();
        const session = cookie.get('session')?.value;

        if (!session) {
            return NextResponse.json({message: "Unauthorized"}, {status: 401});
        }

        // Verify the token
        try {
            await verifyToken(session);
            
        } catch (error) {
            return NextResponse.json({message: "Invalid or expired token"}, {status: 401});
        }

        // Data extraction
        const body = await request.json();
        const {username, email, password, role} = body;
        
        // Field validation
        if (!username || !email || !password || !role){
            return NextResponse.json({ success: false, message: " All field must not left blank"}, {status: 400});
        }

        const existingAdmin = await prisma.admin.findUnique({
            where: { username: username}
        })

        if (existingAdmin){
            return NextResponse.json({ success: false, message: "Admin already exist"}, {status: 409});
        }

        // Hashing
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        // Save Admin
        const newAdmin = await prisma.admin.create({
            data: {
                username: username,
                password: hashedPass, 
                email: email,
                role: role
            }
        });

        return NextResponse.json({ success: true, message: "Admini successfully added"}, {status: 201});

    } catch (error) {
        console.error("Error registering admin: ", error);
        return NextResponse.json({ success: false, message: "Internal Server Error"}, {status: 500});
    }
}