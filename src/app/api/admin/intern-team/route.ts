import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function GET() {
  try {
    const cookie = await cookies();
    const session = cookie.get('session')?.value;
    if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    await verifyToken(session);

    const teams = await prisma.internTeam.findMany({
      orderBy: { id_team: 'asc' }
    });

    return NextResponse.json({ success: true, data: teams }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookie = await cookies();
    const session = cookie.get('session')?.value;
    if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    await verifyToken(session);

    const body = await request.json();
    if (!body.nama || !body.kategori) {
      return NextResponse.json({ success: false, message: 'Nama dan kategori team diperlukan' }, { status: 400 });
    }

    const team = await prisma.internTeam.create({
      data: { nama: body.nama, kategori: body.kategori }
    });

    return NextResponse.json({ success: true, data: team }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
