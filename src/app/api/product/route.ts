import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET function to fetch products for PUBLIC PAGE (Dengan Paginasi)
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '6', 10);
        const skip = (page - 1) * limit;

        const totalProducts = await prisma.product.count();
        const totalPages = Math.ceil(totalProducts / limit);

        const products = await prisma.product.findMany({
            skip: skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            select: {
                id_product: true,
                name:       true,
                texts:      true, 
                images:     true, 
                createdAt:  true,
            }
        });

        return NextResponse.json({
            success: true,
            message: "Products fetched successfully", 
            data: products,
            meta: {
                totalItems: totalProducts,
                totalPages: totalPages,
                currentPage: page,
                itemsPerPage: limit
            }
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json({ success: false, message: "Error fetching products" }, { status: 500 });
    }
}