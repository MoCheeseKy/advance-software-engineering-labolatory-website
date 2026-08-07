import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET function to fetch blog posts with pagination untuk halaman publik
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '6', 10);
        
        const skip = (page - 1) * limit;

        const totalBlogs = await prisma.blog.count();
        const totalPages = Math.ceil(totalBlogs / limit);

        const blogs = await prisma.blog.findMany({
            skip: skip,
            take: limit,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                admin: {
                    select: { username: true }
                }
            }
        });

        return NextResponse.json({
            message: "Blogs fetched successfully", 
            data: blogs,
            meta: {
                totalItems: totalBlogs,
                totalPages: totalPages,
                currentPage: page,
                itemsPerPage: limit
            }
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching blogs:", error);
        return NextResponse.json({ message: "Error fetching blogs" }, { status: 500 });
    }
}