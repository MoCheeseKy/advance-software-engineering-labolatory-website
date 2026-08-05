import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

// GET function to fetch all blog posts
export async function GET(request: Request) {
    try {
        // Authentication check
        const cookie = await cookies();
        const session = cookie.get("session")?.value;
 
        if (!session) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }
        
        // Verify the token
        try {
            await verifyToken(session);
        } catch (error) {
            return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 });
        }
        
        const allBlogs = await prisma.blog.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id_blog:   true,
                title:     true,
                authors:   true,
                url:       true,
                texts:     true,
                images:    true, 
                createdAt: true,
                updatedAt: true,
                id_admin:  true,
            }
        });
 
        return NextResponse.json({
            success: true,
            message: "Success get all blog data",
            data: allBlogs
        }, { status: 200 });
 
    } catch (error) {
        console.error("Error fetching blogs:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
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
        
        const title = formData.get('title') as string;
        const url = formData.get('url') as string;
        
        const authorsString = formData.get('authors') as string;
        const textsString = formData.get('texts') as string;
        
        const authors = authorsString ? JSON.parse(authorsString) : [];
        const texts = textsString ? JSON.parse(textsString) : [];

        const imageFile = formData.get('images') as File | null;
        let imagesArray: string[] = [];

        if (imageFile) {
            const arrayBuffer = await imageFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const base64Image = `data:${imageFile.type};base64,${buffer.toString('base64')}`;
            imagesArray.push(base64Image);
        }

        if (!title || !url) {
            return NextResponse.json({message: "Missing required fields"}, {status: 400});
        }

        const fixedBlog = await prisma.blog.create({
            data: {
                id_admin: Number(id_admin),
                title,
                authors,
                url,
                texts,
                images: imagesArray, 
            }
        });

        return NextResponse.json({message: "Blog created successfully", data: fixedBlog}, {status: 201});

    } catch (error) {
        console.error("Error creating blog:", error);
        return NextResponse.json({message: "Error creating blog"}, {status: 500});
    }
}