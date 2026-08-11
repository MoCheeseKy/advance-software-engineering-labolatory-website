import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { saveProductFileToLocal } from '@/lib/backend-file-upload'; 
import { unlink } from 'fs/promises'; 
import path from 'path';

// Fungsi Helper untuk menghapus file fisik gambar project
async function deleteLocalFile(fileUrl: string) {
    try {
        if (!fileUrl || !fileUrl.startsWith('/uploads/')) return;
        const filePath = path.join(process.cwd(), 'public', fileUrl);
        await unlink(filePath);
        console.log(`Deleted File: ${filePath}`);

    } catch (error) {
        console.error(`Failed Delete File ${fileUrl}:`, error);
    }
}

// GET function (Untuk Halaman Detail/Edit)
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
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

// PUT function (Untuk Edit Product)
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        // Authentication check
        const cookie = await cookies();
        const session = cookie.get('session')?.value;
        if (!session) return NextResponse.json({message: "Unauthorized"}, {status: 401});

        try { await verifyToken(session); } 
        catch (error) { return NextResponse.json({message: "Invalid or expired token"}, {status: 401}); }

        const { id } = await params;
        const id_product = Number(id);

        const existingProduct = await prisma.product.findUnique({
            where: { id_product },
            select: { images: true }
        });

        if (!existingProduct) {
            return NextResponse.json({message: "Product tidak ditemukan"}, {status: 404});
        }

        const formData = await request.formData();
        
        const name = formData.get('name') as string;
        const developersString = formData.get('developers') as string;
        const textsString = formData.get('texts') as string;
        const existingImagesString = formData.get('existingImages') as string;
        
        const developers = developersString ? JSON.parse(developersString) : [];
        const texts = textsString ? JSON.parse(textsString) : [];
        const keptImages = existingImagesString ? JSON.parse(existingImagesString) : []; 

        if (existingProduct.images && Array.isArray(existingProduct.images)) {
            const imagesToDelete = existingProduct.images.filter((img: string) => !keptImages.includes(img));
            for (const imgUrl of imagesToDelete) {
                await deleteLocalFile(imgUrl);
            }
        }

        const imageFiles = formData.getAll('images') as File[];
        let newImagesArray: string[] = [];

        for (const file of imageFiles) {
            if (file && file.size > 0) {
                const imageUrl = await saveProductFileToLocal(file);
                newImagesArray.push(imageUrl);
            }
        }

        const finalImages = [...keptImages, ...newImagesArray];

        const updatedProduct = await prisma.product.update({
            where: { id_product },
            data: {
                name,
                developers,
                texts,
                images: finalImages
            }
        });

        return NextResponse.json({message: "Product updated successfully", data: updatedProduct}, {status: 200});

    } catch (error) {
        console.error("Error updating product:", error);
        return NextResponse.json({message: "Error updating product"}, {status: 500});
    }
} 

// DELETE function (Untuk Hapus Keseluruhan Project)
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        // Authentication check
        const cookie = await cookies();
        const session = cookie.get('session')?.value;
        if (!session) return NextResponse.json({message: "Unauthorized"}, {status: 401});

        try { await verifyToken(session); } 
        catch (error) { return NextResponse.json({message: "Invalid or expired token"}, {status: 401}); }
        
        const { id } = await params;
        const id_product = Number(id);

        const existingProduct = await prisma.product.findUnique({
            where: { id_product },
            select: { images: true }
        });

        if (!existingProduct) {
            return NextResponse.json({message: "Product tidak ditemukan"}, {status: 404});
        }

        const deletedProduct = await prisma.product.delete({
            where: { id_product }
        });

        if (existingProduct.images && Array.isArray(existingProduct.images)) {
            for (const imgUrl of existingProduct.images) {
                await deleteLocalFile(imgUrl);
            }
        }

        return NextResponse.json({message: "Product deleted successfully", data: deletedProduct}, {status: 200});

    } catch (error) {
        console.error("Error deleting product:", error);
        return NextResponse.json({message: "Error deleting product"}, {status: 500});
    }
}