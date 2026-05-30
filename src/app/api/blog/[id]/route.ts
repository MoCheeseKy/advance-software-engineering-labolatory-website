import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';


// Get function for details
export async function GET( request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const id_blog = Number(id);

        const blogDetail = await prisma.blog.findUnique({
            where: { id_blog },
            include: { admin: { select: { username: true } } } 
        });

        if (!blogDetail) {
            return NextResponse.json({ message: "Artikel tidak ditemukan" }, { status: 404 });
        }

        return NextResponse.json({ message: "Berhasil mengambil detail artikel", data: blogDetail }, { status: 200 });
    } catch (error) {
        console.error("GET Detail Blog error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
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

        // Data extraction and update
        const { id } = await params;
        const id_blog = Number(id);
        const body = await request.json();

        const { title, authors, url, texts, images } = body;

        const updatedBlog = await prisma.blog.update({
            where: { id_blog },
            data: {
                ...(title && { title }),
                ...(authors && { authors }),
                ...(url && { url }),
                ...(texts && { texts }),
                ...(images && { images }),
            }
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
        
        // Data extraction and deletion
        const { id } = await params;
        const id_blog = Number(id);

        const deletedBlog = await prisma.blog.delete({
            where: { id_blog }
        });

        return NextResponse.json({message: "Blog deleted successfully", data: deletedBlog}, {status: 200});

    } catch (error) {
        console.error("Error deleting blog:", error);
        return NextResponse.json({message: "Error deleting blog"}, {status: 500});
    }
} 