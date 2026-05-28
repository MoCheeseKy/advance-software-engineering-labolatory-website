import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function PPUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const cookie = await cookies();
        const session = cookie.get('session')?.value;

        if (!session) {
            return NextResponse.json({message: "Unauthorized"}, {status: 401});
        }

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

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const cookie = await cookies();
        const session = cookie.get('session')?.value;

        if (!session) {
            return NextResponse.json({message: "Unauthorized"}, {status: 401});
        }

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