import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Get function for details
export async function GET( request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const id_blog = Number(id);

        const blogDetail = await prisma.blog.findUnique({
            where: { id_blog },
            include: { admin: { select: { username: true } } } 
        });

        if (!blogDetail) {
            return NextResponse.json({ message: "Artikel tidak ditemukan" }, { status: 404 });
        }

        return NextResponse.json({ message: "Berhasil mengambil detail artikel", data: blogDetail }, { status: 200 });
    } catch (error) {
        console.error("GET Detail Blog error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

