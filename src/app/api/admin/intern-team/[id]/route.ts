import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookie = await cookies();
    const session = cookie.get('session')?.value;
    if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    await verifyToken(session);
    
    const { id } = await params;
    const body = await request.json();

    const team = await prisma.internTeam.update({
      where: { id_team: Number(id) },
      data: { nama: body.nama, kategori: body.kategori }
    });

    return NextResponse.json({ success: true, data: team }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookie = await cookies();
    const session = cookie.get('session')?.value;
    if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    await verifyToken(session);
    
    const { id } = await params;
    
    await prisma.internTeam.delete({
      where: { id_team: Number(id) }
    });

    return NextResponse.json({ success: true, message: 'Deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
