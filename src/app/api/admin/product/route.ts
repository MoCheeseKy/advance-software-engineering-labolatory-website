import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { saveProductFileToLocal } from '@/lib/backend-file-upload'; 

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
                id_product:  true,
                name:        true,
                developers:  true,
                texts:       true, 
                images:      true, 
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

        const id_admin = sessionData.id;
        const formData = await request.formData();
        
        const name = formData.get('name') as string;
        const developersString = formData.get('developers') as string;
        const textsString = formData.get('texts') as string;
        
        const developers = developersString ? JSON.parse(developersString) : [];
        const texts = textsString ? JSON.parse(textsString) : [];

        const imageFiles = formData.getAll('images') as File[];
        let imagesArray: string[] = [];

        for (const file of imageFiles) {
            if (file && file.size > 0) {
                const imageUrl = await saveProductFileToLocal(file);
                imagesArray.push(imageUrl);
            }
        }

        if (!name) {
            return NextResponse.json({message: "Missing required fields"}, {status: 400});
        }

        const newProduct = await prisma.product.create({
            data: {
                id_admin: Number(id_admin),
                name,
                developers,
                texts,
                images: imagesArray 
            }
        });

        return NextResponse.json({message: "Product created successfully", data: newProduct}, {status: 201});

    } catch (error) {
        console.error("Error creating product:", error);
        return NextResponse.json({message: "Internal server error"}, {status: 500});
    }
}