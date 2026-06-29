import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

// GET function to fetch all products
export async function GET(request: Request) {
    try {
        // Authentication check
        const cookie = await cookies();
        const session = cookie.get('session')?.value;
        
        if (!session) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }
        
        // Verify the token
        try {
            await verifyToken(session);
        } catch (error) {
            return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 });
        }
        
        // Get All Product Data
        const allProducts = await prisma.product.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id_product: true,
                name:        true,
                developers:  true,
                createdAt:   true,
                updatedAt:   true,
                id_admin:    true,
            }
        });
 
        return NextResponse.json({
            success: true,
            message: "Success get all product data",
            data: allProducts
        }, { status: 200 });
 
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}

// POST function to create a new product
export async function POST(request: Request) {
    try {
        // Authentication check
        const cookie = await cookies();
        const session = cookie.get('session')?.value;
        
        if (!session) {
            return NextResponse.json({message: "Unauthorized"}, {status: 401});
        }

        // Verify the token
        let sessionData;
        try { 
            sessionData = await verifyToken(session);

            if (!sessionData) {
                return NextResponse.json({message: "Invalid token"}, {status: 401});
            }

        } catch (error) {
            return NextResponse.json({message: "Invalid or expired token"}, {status: 401});
        }

        // Extract admin id from session data
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