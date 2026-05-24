import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { nim: string } }) {
    try {
        const nim = params.nim;

        const registrant = await prisma.registrasi.findFirst({
            where: { nim: nim },
            select: {
                nim: true,
                nama: true,
                status: true,
            }
        });

        if (!registrant) {
            return NextResponse.json({ success: false, message: "Registrant not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Registrant found",
            data: {
                nim: registrant.nim,
                nama: registrant.nama,
                status: registrant.status,
            }
        }, { status: 200 });
    }

    catch (error) {
        console.error("Error GET Registrant: ", error);
        return NextResponse.json({ success: false, message: "Failed to fetch registrant data" }, { status: 500 });
    }
}