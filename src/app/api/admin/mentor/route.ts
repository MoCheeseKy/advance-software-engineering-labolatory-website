import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const mentors = await prisma.mentor.findMany({
            orderBy: { nama: 'asc' }
        });

        return NextResponse.json({
            success: true,
            data: mentors
        }, { status: 200 });
    } catch (error) {
        console.error("Error GET Mentors: ", error);
        return NextResponse.json({ success: false, message: "Failed to fetch mentors" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { nama, link_profile } = body;

        if (!nama) {
            return NextResponse.json({ success: false, message: "Nama mentor harus diisi" }, { status: 400 });
        }

        const newMentor = await prisma.mentor.create({
            data: {
                nama,
                link_profile: link_profile || null
            }
        });

        return NextResponse.json({
            success: true,
            data: newMentor
        }, { status: 201 });
    } catch (error) {
        console.error("Error POST Mentor: ", error);
        return NextResponse.json({ success: false, message: "Failed to create mentor" }, { status: 500 });
    }
}
