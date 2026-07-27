import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function GET(request: Request) {
    try {
        // Authentication check
        const cookie = await cookies();
        const session = cookie.get('session')?.value;

        if (!session){
            return NextResponse.json({ success: false, message: "Unauthorized"}, {status: 401});
        }

        // Verify the token
        try {
            await verifyToken(session);
            
        } catch (error) {
            return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 });
        }

        // Get all data
        const allRegistrant = await prisma.registrasi.findMany({
            orderBy: {
                id_registrasi: 'desc'
            }
        });

        return NextResponse.json({
            success: true,
            message: "Success get all registrant data",
            data: allRegistrant
        },{status: 200});

    } catch (error) {
        console.error("Error fetching data: ", error);
        return NextResponse.json({ success: false, message: "Internal Server Error"}, {status: 500});
    }
}

export async function POST(request: Request) {
    try {
        const cookie = await cookies();
        const session = cookie.get('session')?.value;

        if (!session){
            return NextResponse.json({ success: false, message: "Unauthorized"}, {status: 401});
        }

        try {
            await verifyToken(session);
        } catch (error) {
            return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 });
        }

        const body = await request.json();
        const { nim, nama, angkatan, id_prodi, divisi1, divisi2 } = body;

        if (!nim || !nama || !angkatan || !id_prodi || !divisi1 || !divisi2) {
            return NextResponse.json({ success: false, message: "Semua field (nim, nama, angkatan, prodi, divisi1, divisi2) harus diisi" }, { status: 400 });
        }

        const newRegistration = await prisma.registrasi.create({
            data: {
                nim,
                nama,
                angkatan: Number(angkatan),
                id_prodi: Number(id_prodi),
                cv: "",
                motivationLetter: "",
                portofolio: "",
                status: "PENDING",
                dataDivisi: {
                    create: [
                        { id_divisi: Number(divisi1), pilihan: 1 },
                        { id_divisi: Number(divisi2), pilihan: 2 }
                    ]
                }
            }
        });

        return NextResponse.json({
            success: true,
            message: "Berhasil menambahkan pendaftar secara manual",
            data: newRegistration
        }, { status: 201 });

    } catch (error: any) {
        console.error("Error creating data: ", error);
        return NextResponse.json({ success: false, message: error.message || "Internal Server Error"}, {status: 500});
    }
}