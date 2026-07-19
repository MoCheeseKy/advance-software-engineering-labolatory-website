import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function GET(request: Request, { params }: { params: { id: string } | Promise<{ id: string }> }) {
    try {
        // Authentication check
        const cookie = await cookies();
        const session = cookie.get('session')?.value;
 
        if (!session) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }
 
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id);
 
        if (isNaN(id)) {
            return NextResponse.json({ success: false, message: "ID Pendaftar tidak valid" }, { status: 400 });
        }
 
        // Verify the token
        try {
            await verifyToken(session);
        } catch (error) {
            return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 });
        }
 
        const registrasi = await prisma.registrasi.findUnique({
            where: { id_registrasi: id },
            include: {
                prodi: {
                    include: { fakultas: true }
                },
                dataDivisi: {
                    include: { divisi: true }
                }
            }
        });
 
        if (!registrasi) {
            return NextResponse.json({ success: false, message: "Data registrasi tidak ditemukan" }, { status: 404 });
        }
 
        return NextResponse.json({ success: true, data: registrasi }, { status: 200 });
    }
 
    catch (error) {
        console.error("Error fetching registrasi: ", error);
        return NextResponse.json({ success: false, message: "Failed to fetch registrasi" }, { status: 500 });
    }
}

// Put function to update registrasi data based on id
export async function PUT(request: Request, { params }: { params: { id: string } | Promise<{ id: string }> }) {
    try {
        // Authentication check
        const cookie = await cookies();
        const session = cookie.get('session')?.value;

        if (!session) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }   
        
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id);

        if (isNaN(id)) {
             return NextResponse.json({ success: false, message: "ID Pendaftar tidak valid" }, { status: 400 });
        }

        // Verify the token
        try {
            await verifyToken(session);

        } catch (error) {
            return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 });
        }

        const body = await request.json();

        const validStatuses = ['PENDING', 'ACCEPTED', 'REJECTED'];
        if ('status' in body && !validStatuses.includes(body.status)) {
            return NextResponse.json(
                { success: false, message: "Status Invalid" },
                { status: 400 }
            );
        }

        const updatedRegistrasi = await prisma.registrasi.update({
            where: { id_registrasi: id },
            data: body,
        });

        return NextResponse.json({ success: true, message: "Registrasi updated successfully", data: updatedRegistrasi }, { status: 200 });
    }

    catch (error) {
        console.error("Error updating registrasi: ", error);
        return NextResponse.json({ success: false, message: "Failed to update registrasi" }, { status: 500 });
    }
}

// DELETE function to delete registrasi data based on id
export async function DELETE(request: Request, { params }: { params: { id: string } | Promise<{ id: string }> }) {
    try {
        // Authentication check
        const cookie = await cookies();
        const session = cookie.get('session')?.value;

        if (!session) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id);

        if (isNaN(id)) {
            return NextResponse.json({ success: false, message: "ID Pendaftar tidak valid" }, { status: 400 });
       }

        // Verify the token
        try {
            await verifyToken(session); 
            
        } catch (error) {   
            return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 });
        }

        await prisma.dataDivisi.deleteMany({
            where: { id_register: id }
        });

        await prisma.registrasi.delete({
            where: { id_registrasi: id }
        });

        return NextResponse.json({ success: true, message: "Registrasi deleted successfully" }, { status: 200 });
    }

    catch (error) {
        console.error("Error deleting registrasi: ", error);
        return NextResponse.json({ success: false, message: "Failed to delete registrasi" }, { status: 500 });
    }
}