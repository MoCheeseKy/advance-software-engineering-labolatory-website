import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: Promise<{ type: string }> }) {
    try {
        const type = (await params).type.toUpperCase();
        const body = await request.json();
        
        const { isActive, startDate, endDate } = body;

        const updatedSetting = await prisma.systemSetting.upsert({
            where: { type },
            update: {
                isActive,
                startDate: startDate ? new Date(startDate) : null,
                endDate: endDate ? new Date(endDate) : null,
            },
            create: {
                type,
                isActive,
                startDate: startDate ? new Date(startDate) : null,
                endDate: endDate ? new Date(endDate) : null,
            }
        });

        return NextResponse.json({
            success: true,
            data: updatedSetting
        }, { status: 200 });
    } catch (error) {
        console.error("Error PUT Setting: ", error);
        return NextResponse.json({ success: false, message: "Failed to update setting" }, { status: 500 });
    }
}
