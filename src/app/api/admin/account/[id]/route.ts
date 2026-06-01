import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        // Authentication check
        const cookie = await cookies();
        const session = cookie.get('session')?.value;

        if (!session) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        // Data extraction and retrieval
        const { id } = await params;
        const id_admin = Number(id);

        if (isNaN(id_admin)) {
            return NextResponse.json({ success: false, message: "Invalid Admin ID" }, { status: 400 });
        }

        const adminData = await prisma.admin.findUnique({
            where: { id_admin },
            select: {
                id_admin: true,
                username: true,
                email: true,
                role: true,
            }
        });
        
        if (!adminData) {
            return NextResponse.json({ success: false, message: "Admin not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: adminData }, { status: 200 });

    } catch (error) {
        console.error("Error fetching admin data:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {   
        // Authentication check 
        const cookie = await cookies();
        const session = cookie.get('session')?.value;

        if (!session) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        // Data extraction and update
        const { id } = await params;
        const id_admin = Number(id);

        if (isNaN(id_admin)) {
            return NextResponse.json({ success: false, message: "Invalid Admin ID" }, { status: 400 });
        }

        const body = await request.json();
        const { username, email, password, role } = body;

        const updateData: any = {};

        if (username) updateData.username = username;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPass = await bcrypt.hash(password, salt);
            updateData.password = hashedPass;
        }

        if (email) updateData.email = email;
        if (role) updateData.role = role;

        const updatedAdmin = await prisma.admin.update({
            where: { id_admin: id_admin },
            data: updateData
        });

        return NextResponse.json({ success: true, message: "Admin account updated successfully", data: updatedAdmin }, { status: 200 });

    } catch (error) {
        console.error("Error updating admin account:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        // Authentication check
        const cookie = await cookies();
        const session = cookie.get('session')?.value;
        
        if (!session) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        // Data extraction and deletion
        const { id } = await params;
        const id_admin = Number(id);

        if (isNaN(id_admin)) {
            return NextResponse.json({ success: false, message: "Invalid Admin ID" }, { status: 400 });
        }

        await prisma.admin.delete({
            where: { id_admin }
        });

        return NextResponse.json({ success: true, message: "Admin account deleted successfully" }, { status: 200 });

    } catch (error) {
        console.error("Error deleting admin account:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}
