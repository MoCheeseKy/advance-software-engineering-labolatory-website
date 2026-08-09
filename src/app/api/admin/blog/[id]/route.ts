import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { saveFileToLocal } from '@/lib/backend-file-upload'; 
import { unlink } from 'fs/promises'; 
import path from 'path';

// Delete Local File if the Blog Deleted Function
async function deleteLocalFile(fileUrl: string) {
    try {
        if (!fileUrl || !fileUrl.startsWith('/uploads/')) return;
        
        const filePath = path.join(process.cwd(), 'public', fileUrl);
        await unlink(filePath);
        console.log(`Deleted File: ${filePath}`);

    } catch (error) {
        console.error(`Failed Delete Fiule ${fileUrl} :`, error);
    }
}

// PUT function to update a blog post based on id
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

        const { id } = await params;
        const id_blog = Number(id);

        const existingBlog = await prisma.blog.findUnique({
            where: { id_blog },
            select: { images: true }
        });

        if (!existingBlog) {
            return NextResponse.json({message: "Blog Not Found"}, {status: 404});
        }

        const formData = await request.formData();
        
        const title = formData.get('title') as string;
        const url = formData.get('url') as string;
        const authorsString = formData.get('authors') as string;
        const textsString = formData.get('texts') as string;
        const keepOldImage = formData.get('keepOldImage') === 'true'; 
        
        const authors = authorsString ? JSON.parse(authorsString) : undefined;
        const texts = textsString ? JSON.parse(textsString) : undefined;

        const updateData: any = {};
        if (title) updateData.title = title;
        if (url) updateData.url = url;
        if (authors) updateData.authors = authors;
        if (texts) updateData.texts = texts;

        if (!keepOldImage) {
            const imageFile = formData.get('images') as File | null;

            if (imageFile) {
                const imageUrl = await saveFileToLocal(imageFile);
                updateData.images = [imageUrl]; 

                if (existingBlog.images && Array.isArray(existingBlog.images)) {
                    for (const oldImgUrl of existingBlog.images) {
                        await deleteLocalFile(oldImgUrl);
                    }

                } else if (typeof existingBlog.images === 'string') {
                    await deleteLocalFile(existingBlog.images);
                }
            }
        }

        const updatedBlog = await prisma.blog.update({
            where: { id_blog },
            data: updateData
        });

        return NextResponse.json({message: "Blog updated successfully", data: updatedBlog}, {status: 200});

    } catch (error) {
        console.error("Error updating blog:", error);
        return NextResponse.json({message: "Error updating blog"}, {status: 500});
    }
} 

// DELETE function to delete a blog post based on id
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
        
        const { id } = await params;
        const id_blog = Number(id);

        const existingBlog = await prisma.blog.findUnique({
            where: { id_blog },
            select: { images: true }
        });

        if (!existingBlog) {
            return NextResponse.json({message: "Blog Not Found"}, {status: 404});
        }

        const deletedBlog = await prisma.blog.delete({
            where: { id_blog }
        });

        if (existingBlog.images && Array.isArray(existingBlog.images)) {

            for (const imgUrl of existingBlog.images) {
                await deleteLocalFile(imgUrl);
            }
            
        } else if (typeof existingBlog.images === 'string') {
            await deleteLocalFile(existingBlog.images);
        }

        return NextResponse.json({message: "Blog deleted successfully", data: deletedBlog}, {status: 200});

    } catch (error) {
        console.error("Error deleting blog:", error);
        return NextResponse.json({message: "Error deleting blog"}, {status: 500});
    }
}