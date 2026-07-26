import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const id_mentor = parseInt((await params).id);
        const body = await request.json();
        const { nama, link_profile } = body;

        if (!nama) {
            return NextResponse.json({ success: false, message: "Nama mentor harus diisi" }, { status: 400 });
        }

        const updatedMentor = await prisma.mentor.update({
            where: { id_mentor },
            data: {
                nama,
                link_profile: link_profile || null
            }
        });

        return NextResponse.json({
            success: true,
            data: updatedMentor
        }, { status: 200 });
    } catch (error) {
        console.error("Error PUT Mentor: ", error);
        return NextResponse.json({ success: false, message: "Failed to update mentor" }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const id_mentor = parseInt((await params).id);

        await prisma.mentor.delete({
            where: { id_mentor }
        });

        return NextResponse.json({
            success: true,
            message: "Mentor deleted successfully"
        }, { status: 200 });
    } catch (error) {
        console.error("Error DELETE Mentor: ", error);
        return NextResponse.json({ success: false, message: "Failed to delete mentor" }, { status: 500 });
    }
}
