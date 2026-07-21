import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

// GET: Mengambil detail satu member berdasarkan ID
export async function GET(request: Request, { params }: { params: { id: string } | Promise<{ id: string }> }) {
    try {
        const cookie = await cookies();
        const session = cookie.get('session')?.value;
 
        if (!session) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }
 
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id);
 
        if (isNaN(id)) {
            return NextResponse.json({ success: false, message: "ID Member tidak valid" }, { status: 400 });
        }
 
        try {
            await verifyToken(session);
        } catch (error) {
            return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 });
        }
 
        const member = await prisma.member.findUnique({
            where: { id_member: id },
            include: {
                prodi: {
                    include: { fakultas: true }
                },
                divisi: true,
                registrasi: true 
            }
        });
 
        if (!member) {
            return NextResponse.json({ success: false, message: "Data member tidak ditemukan" }, { status: 404 });
        }
 
        return NextResponse.json({ success: true, data: member }, { status: 200 });
    }
    catch (error) {
        console.error("Error fetching member detail: ", error);
        return NextResponse.json({ success: false, message: "Failed to fetch member detail" }, { status: 500 });
    }
}

// PUT: Mengupdate data member (Divisi, Tim, Tipe Member, Status)
export async function PUT(request: Request, { params }: { params: { id: string } | Promise<{ id: string }> }) {
    try {
        const cookie = await cookies();
        const session = cookie.get('session')?.value;

        if (!session) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }   
        
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id);

        if (isNaN(id)) {
             return NextResponse.json({ success: false, message: "ID Member tidak valid" }, { status: 400 });
        }

        try {
            await verifyToken(session);
        } catch (error) {
            return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 });
        }

        const body = await request.json();
        
        // Ekstrak data yang boleh di-edit dari body request
        const { id_divisi, tim, tipe_member, status_aktif } = body;

        // Validasi input enum/opsi
        const validTipeMember = ['INTERN', 'MEMBER'];
        if (tipe_member && !validTipeMember.includes(tipe_member)) {
            return NextResponse.json({ success: false, message: "Tipe Member Invalid" }, { status: 400 });
        }

        const validStatusAktif = ['ACTIVE', 'INACTIVE', 'FAILED'];
        if (status_aktif && !validStatusAktif.includes(status_aktif)) {
            return NextResponse.json({ success: false, message: "Status Aktif Invalid" }, { status: 400 });
        }

        const updatedMember = await prisma.member.update({
            where: { id_member: id },
            data: {
                id_divisi: id_divisi !== undefined ? id_divisi : undefined,
                tim: tim !== undefined ? tim : undefined,
                tipe_member: tipe_member !== undefined ? tipe_member : undefined,
                status_aktif: status_aktif !== undefined ? status_aktif : undefined,
            },
            include: {
                divisi: true
            }
        });

        return NextResponse.json({ 
            success: true, 
            message: "Data member berhasil diperbarui", 
            data: updatedMember 
        }, { status: 200 });
    }
    catch (error: any) {
        console.error("Error updating member: ", error);
        return NextResponse.json({ success: false, message: error.message || "Failed to update member" }, { status: 500 });
    }
}

// DELETE: (Opsional) Menghapus data member jika ada kesalahan
export async function DELETE(request: Request, { params }: { params: { id: string } | Promise<{ id: string }> }) {
    try {
        const cookie = await cookies();
        const session = cookie.get('session')?.value;

        if (!session) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id);

        if (isNaN(id)) {
            return NextResponse.json({ success: false, message: "ID Member tidak valid" }, { status: 400 });
        }

        try {
            await verifyToken(session); 
        } catch (error) {   
            return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 });
        }

        await prisma.member.delete({
            where: { id_member: id }
        });

        return NextResponse.json({ success: true, message: "Member deleted successfully" }, { status: 200 });
    }
    catch (error) {
        console.error("Error deleting member: ", error);
        return NextResponse.json({ success: false, message: "Failed to delete member" }, { status: 500 });
    }
}