import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET(){
    try {
        const products = await prisma.product.findMany({
            orderBy: {createdAt: 'desc'}
        });

        return NextResponse.json({message: "Products retrieved successfully", data: products}, {status: 200});

    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json({message: "Internal server error"}, {status: 500});
    }
}

export async function POST(request: Request) {
    try {
        const cookie = await cookies();
        const session = cookie.get('session')?.value;
        
        if (!session) {
            return NextResponse.json({message: "Unauthorized"}, {status: 401});
        }

        const sessionData = JSON.parse(session);
        const id_admin = sessionData.id_admin;
        const body = await request.json();
        const { name, developers, texts, images } = body;

        if (!name) {
            return NextResponse.json({message: "Missing required fields"}, {status: 400});
        }

        const newProduct = await prisma.product.create({
            data: {
                id_admin: Number(id_admin),
                name,
                developers: developers || [],
                texts: texts || [],
                images: images || []
            }
        });

        return NextResponse.json({message: "Product created successfully", data: newProduct}, {status: 201});

    } catch (error) {
        console.error("Error creating product:", error);
        return NextResponse.json({message: "Internal server error"}, {status: 500});
    }
}
