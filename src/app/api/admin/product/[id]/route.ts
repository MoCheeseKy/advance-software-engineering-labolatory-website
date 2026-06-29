import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

// GET function to fetch a single product by id
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        // Authentication check
        const cookie = await cookies();
        const session = cookie.get('session')?.value;

        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Verify the token
        try {
            await verifyToken(session);
        } catch (error) {
            return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
        }

        // Data extraction
        const { id } = await params;
        const id_product = Number(id);

        const product = await prisma.product.findUnique({
            where: { id_product },
            select: {
                id_product: true,
                name:       true,
                developers: true,
                texts:      true,
                images:     true,
                createdAt:  true,
                updatedAt:  true,
                id_admin:   true,
            }
        });

        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: product }, { status: 200 });

    } catch (error) {
        console.error("Error fetching product:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}


// PUT function to update a product based on id
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        // Authentication check
        const cookie = await cookies();
        const session = cookie.get('session')?.value;

        if (!session) {
            return NextResponse.json({message: "Unauthorized"}, {status: 401});
        }

        // Verify the token
        try {
            await verifyToken(session);

        } catch (error) {
            return NextResponse.json({message: "Invalid or expired token"}, {status: 401});
        }

        // Data extraction and update
        const { id } = await params;
        const id_product = Number(id);
        const body = await request.json();
        const { name, developers, texts, images } = body;

        const updatedProduct = await prisma.product.update({
            where: { id_product },
            data: {
                ...(name && { name }),
                ...(developers && { developers }),
                ...(texts && { texts }),
                ...(images && { images }),
            }
        });

        return NextResponse.json({message: "Product updated successfully", data: updatedProduct}, {status: 200});

    } catch (error) {
        console.error("Error updating product:", error);
        return NextResponse.json({message: "Internal server error"}, {status: 500});
    }
}

// DELETE function to delete a product based on id
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        // Authentication check
        const cookie = await cookies();
        const session = cookie.get('session')?.value;

        if (!session) {
            return NextResponse.json({message: "Unauthorized"}, {status: 401});
        }

        // Verify the token
        try {
            await verifyToken(session);
            
        } catch (error) {
            return NextResponse.json({message: "Invalid or expired token"}, {status: 401});
        }

        // Data extraction and deletion
        const { id } = await params;
        const id_product = Number(id);

        await prisma.product.delete({
            where: { id_product }
        });

        return NextResponse.json({message: "Product deleted successfully"}, {status: 200});
        
    } catch (error) {
        console.error("Error deleting product:", error);
        return NextResponse.json({message: "Internal server error"}, {status: 500});
    }
}