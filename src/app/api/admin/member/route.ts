import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function GET(request: Request) {
    try {
        // Cek Autentikasi
        const cookie = await cookies();
        const session = cookie.get('session')?.value;

        if (!session) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        try {
            await verifyToken(session);
        } catch (error) {
            return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const typeParam = searchParams.get('type'); 

        let whereCondition = {};
        
        if (typeParam === 'INTERN' || typeParam === 'MEMBER') {
            whereCondition = {
                tipe_member: typeParam
            };
        }

        const members = await prisma.member.findMany({
            where: whereCondition,
            include: {
                prodi: {
                    include: { fakultas: true }
                },
                divisi: true,
                registrasi: true,
                mentor: true
            },
        });

        return NextResponse.json({ success: true, data: members }, { status: 200 });
    }
    catch (error: any) {
        console.error("Error fetching members: ", error);
        return NextResponse.json({ success: false, message: "Failed to fetch members" }, { status: 500 });
    }
}