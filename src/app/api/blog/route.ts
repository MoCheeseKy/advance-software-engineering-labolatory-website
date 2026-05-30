import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

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

// POST function to create a new blog post
export async function POST(request: Request) {
    try {
        // Authentication check
        const cookie = await cookies();
        const session = cookie.get("session")?.value;

        if (!session) {
            return NextResponse.json({message: "Unauthorized"}, {status: 401});
        }
        
        // Extract admin from session
        const sessionData = JSON.parse(session);
        const id_admin = sessionData.id;

        // Data extraction and validation
        const body = await request.json();
        const { title, authors, url, texts, images } = body;

        if (!title || !url) {
            return NextResponse.json({message: "Missing required fields"}, {status: 400});
        }

        const fixedBlog = await prisma.blog.create({
            data: {
                id_admin: Number(id_admin),
                title,
                authors: authors || [],
                url,
                texts: texts || [],
                images: images || [],
            }
        });

        return NextResponse.json({message: "Blog created successfully", data: fixedBlog}, {status: 201});

    } catch (error) {
        console.error("Error creating blog:", error);
        return NextResponse.json({message: "Error creating blog"}, {status: 500});
    }
}