import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const settings = await prisma.systemSetting.findMany({
            orderBy: { id: 'asc' }
        });

        return NextResponse.json({
            success: true,
            data: settings
        }, { status: 200 });
    } catch (error) {
        console.error("Error GET Settings: ", error);
        return NextResponse.json({ success: false, message: "Failed to fetch settings data" }, { status: 500 });
    }
}
