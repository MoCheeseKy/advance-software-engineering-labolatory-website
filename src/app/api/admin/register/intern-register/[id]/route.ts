import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function GET(request: Request, { params }: { params: { id: string } | Promise<{ id: string }> }) {
    try {
        // Authentication Check
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
                },
                member: {
                    include: { mentor: true }
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
             return NextResponse.json({ success: false, message: "ID Pendaftar tidak valid" }, { status: 400 });
        }

        try {
            await verifyToken(session);
        } catch (error) {
            return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 });
        }

        const body = await request.json();
        const { status, id_divisi_diterima, id_mentor } = body;

        const validStatuses = ['PENDING', 'ACCEPTED', 'REJECTED'];
        if (status && !validStatuses.includes(status)) {
            return NextResponse.json(
                { success: false, message: "Status Invalid" },
                { status: 400 }
            );
        }

        const updatedRegistrasi = await prisma.$transaction(async (tx) => {
            const reg = await tx.registrasi.update({
                where: { id_registrasi: id },
                data: {
                    status: status,
                    id_divisi_diterima: status === 'ACCEPTED' ? id_divisi_diterima : null
                },
                include: { prodi: true } 
            });

            if (status === 'ACCEPTED') {
                if (!id_divisi_diterima) throw new Error("Divisi diterima harus diisi");
                
                await tx.member.upsert({
                    where: { id_registrasi: id },
                    update: {
                        id_divisi: id_divisi_diterima,
                        id_mentor: id_mentor || null,
                    },
                    create: {
                        id_registrasi: id,
                        nim: reg.nim,
                        nama: reg.nama,
                        angkatan: reg.angkatan,
                        id_prodi: reg.id_prodi,
                        id_divisi: id_divisi_diterima,
                        id_mentor: id_mentor || null,
                        tipe_member: 'INTERN',
                    }
                });
            } else {
                await tx.member.deleteMany({
                    where: { id_registrasi: id }
                });
            }

            return reg;
        });

        return NextResponse.json({ success: true, message: "Registrasi updated successfully", data: updatedRegistrasi }, { status: 200 });
    }
    catch (error: any) {
        console.error("Error updating registrasi: ", error);
        return NextResponse.json({ success: false, message: error.message || "Failed to update registrasi" }, { status: 500 });
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