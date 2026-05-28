import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    try {

        const cookie = await cookies();
        const session = cookie.get('session')?.value;

        if (!session) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }   

        const body = await request.json();
        const id = parseInt(params.id);
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

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const cookie = await cookies();
        const session = cookie.get('session')?.value;

        if (!session) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        prisma.dataDivisi.deleteMany({
            where: { id_register: parseInt(params.id) }
        });

        prisma.registrasi.delete({
            where: { id_registrasi: parseInt(params.id) }
        });

        return NextResponse.json({ success: true, message: "Registrasi deleted successfully" }, { status: 200 });
    }

    catch (error) {
        console.error("Error deleting registrasi: ", error);
        return NextResponse.json({ success: false, message: "Failed to delete registrasi" }, { status: 500 });
    }
}