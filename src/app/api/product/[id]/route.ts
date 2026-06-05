import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET function to detail
export async function GET( request: Request,{ params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const id_product = Number(id);

        const productDetail = await prisma.product.findUnique({
            where: { id_product },
            include: { admin: { select: { username: true } } }
        });

        if (!productDetail) {
            return NextResponse.json({ message: "Produk tidak ditemukan" }, { status: 404 });
        }

        return NextResponse.json({ message: "Berhasil mengambil detail produk", data: productDetail }, { status: 200 });
    } catch (error) {
        console.error("GET Detail Product error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

