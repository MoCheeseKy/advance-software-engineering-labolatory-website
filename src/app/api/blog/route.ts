import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET function to fetch all blog posts
export async function GET() {
    try {
        // Fetch blogs from the database, ordered by creation date
        const blogs = await prisma.blog.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                admin: {
                    select: {username: true}
                }
            }
        });

        return NextResponse.json({message: "Blogs fetched successfully", data: blogs}, {status: 200});

    } catch (error) {
        console.error("Error fetching blogs:", error);
        return NextResponse.json({message: "Error fetching blogs"}, {status: 500});
    }
}
