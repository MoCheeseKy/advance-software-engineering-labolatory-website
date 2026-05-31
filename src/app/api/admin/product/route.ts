import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

// POST function to create a new product
export async function POST(request: Request) {
    try {
        // Authentication check
        const cookie = await cookies();
        const session = cookie.get('session')?.value;
        
        if (!session) {
            return NextResponse.json({message: "Unauthorized"}, {status: 401});
        }

        // Extract admin id from session data
        const sessionData = JSON.parse(session);
        const id_admin = sessionData.id;

        // Data extraction and validation
        const body = await request.json();
        const { name, developers, texts, images } = body;

        if (!name) {
            return NextResponse.json({message: "Missing required fields"}, {status: 400});
        }

        // Create a new product in the database
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