import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function GET() {
    try {
        // Authentication check
        const cookie  = await cookies();
        const session = cookie.get('session')?.value;

        if (!session) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        // Verify + decode token
        let sessionData: { id: number; username: string; email: string; role: string };
        try {
            sessionData = await verifyToken(session) as typeof sessionData;
        } catch {
            return NextResponse.json({ success: false, message: 'Invalid or expired token' }, { status: 401 });
        }

        const id_admin = Number(sessionData.id);

        // Fetch admin from DB
        const adminData = await prisma.admin.findUnique({
            where: { id_admin },
            select: {
                id_admin: true,
                username: true,
                email:    true,
                role:     true,
            },
        });

        if (!adminData) {
            return NextResponse.json({ success: false, message: 'Admin not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: adminData }, { status: 200 });

    } catch (error) {
        console.error('Error fetching admin profile:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}