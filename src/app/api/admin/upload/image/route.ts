import { NextResponse } from 'next/server';
import { saveFileToLocal } from '@/lib/backend-file-upload'; 
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        // Cek Autentikasi
        const cookie = await cookies();
        const session = cookie.get('session')?.value;
        
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        
        try {
            await verifyToken(session);

        } catch (error) {
            return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('image') as File | null;

        if (!file) {
            return NextResponse.json({ message: "No Image Uploaded" }, { status: 400 });
        }

        const imageUrl = await saveFileToLocal(file);

        return NextResponse.json({ imageUrl }, { status: 200 });

    } catch (error) {
        console.error("Failed Upload Image:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}