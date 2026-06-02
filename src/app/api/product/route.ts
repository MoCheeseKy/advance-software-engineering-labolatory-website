import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET function to fetch all products
export async function GET(){
    try {
        // Fetch products from the database, ordered by creation date in descending order
        const products = await prisma.product.findMany({
            orderBy: {createdAt: 'desc'}
        });

        return NextResponse.json({message: "Products retrieved successfully", data: products}, {status: 200});

    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json({message: "Internal server error"}, {status: 500});
    }
}


