import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ type: string }> }) {
    try {
        const type = (await params).type.toUpperCase();

        const setting = await prisma.systemSetting.findUnique({
            where: { type }
        });

        if (!setting) {
            // Default to closed if not found
            return NextResponse.json({ success: true, isOpen: false, data: null }, { status: 200 });
        }

        const now = new Date();
        let isOpen = setting.isActive;

        if (isOpen) {
            if (setting.startDate && setting.startDate > now) {
                isOpen = false;
            }
            if (setting.endDate && setting.endDate < now) {
                isOpen = false;
            }
        }

        return NextResponse.json({
            success: true,
            isOpen,
            data: {
                type: setting.type,
                isActive: setting.isActive,
                startDate: setting.startDate,
                endDate: setting.endDate
            }
        }, { status: 200 });
    } catch (error) {
        console.error("Error GET Setting: ", error);
        return NextResponse.json({ success: false, message: "Failed to fetch setting data" }, { status: 500 });
    }
}
