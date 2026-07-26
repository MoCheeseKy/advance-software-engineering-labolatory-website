import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET function to fetch registrant data based on nim
export async function GET(
  request: Request,
  { params }: { params: Promise<{ nim: string }> },
) {
  try {
    const nim = (await params).nim;

    const registrant = await prisma.registrasi.findFirst({
      where: { nim: nim },
      select: {
        nim: true,
        nama: true,
        status: true,
        divisiDiterima: {
          select: {
            nama: true,
          },
        },
        member: {
          select: {
            mentor: {
              select: {
                nama: true,
                link_profile: true
              }
            }
          },
        },
      },
    });

    if (!registrant) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Terima kasih atas keinginan bergabung serta antusiasme anda, namun mohon maaf kamu belum keterima. Kamu bisa coba lagi tahun depan ya ^^',
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Registrant found',
        data: {
          nim: registrant.nim,
          nama: registrant.nama,
          status: registrant.status,
          divisi_diterima: registrant.divisiDiterima?.nama || null,
          mentor: registrant.member?.mentor || null,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error GET Registrant: ', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch registrant data' },
      { status: 500 },
    );
  }
}
