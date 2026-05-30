import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Function to validate if a string is a valid URL
const isUrlValid = (url: string) => {
    try {
        new URL(url);
        return true;
    }

    catch (error) {
        return false;
    }
}

// Function to validate input data for registrasi
const isValidInput = (input: any) => {
    const { nim, nama, nama_prodi, angkatan, cv, motivationLetter } = input;

    if (!nim || !nama || !nama_prodi || !angkatan || !cv || !motivationLetter) {
        return { isValid: false, message: "Missing required fields" };
    }

    if (!isUrlValid(cv) || !isUrlValid(motivationLetter)) {
        return { isValid: false, message: "Invalid URL in CV or Motivation Letter" };
    }

    return { isValid: true };
}

// Helper function to get prodi ID based on nama_prodi
const getProdi = async (nama_prodi: string) => {
    const prodi = await prisma.prodi.findFirst({
        where: {
            nama: {
                equals: nama_prodi,
                mode: "insensitive",
            }
        }
    }); 
    
    return prodi ? prodi.id_prodi : null;
}

// GET function to fetch all registrasi data
export async function GET() {
    try {
        // Fetch registrasi data from the database, including related prodi and divisi information
        const data = await prisma.registrasi.findMany({
            include: {
                prodi: {
                    include: {fakultas: true}
                },

                dataDivisi: {
                    include: {divisi: true}
                }
            },

            orderBy: { id_registrasi: "desc" }
        });     
        
         return NextResponse.json({ success : true, data }, { status: 200 });
    } 
    
    catch (error) {        
        console.error("Error GET Registrasi: ", error);
        return NextResponse.json({ success : false, message: "Failed to fetch registrasi data" }, { status: 500 });
    }    
}

// POST function to create a new registrasi entry
export async function POST(request: Request) {
    try {
        // Data extraction and validation
        const body = await request.json();
        const validation = isValidInput(body);

        if (!validation.isValid) {
            return NextResponse.json({ success : false, message: validation.message }, { status: 400 });
        }

        const idProdi = await getProdi(body.nama_prodi);
        if (!idProdi) {
            return NextResponse.json({ success : false, message: "Prodi not found" }, { status: 404 });
        }

        // Create a new registrasi entry in the database, along with related dataDivisi entries if provided
        const newRegistrasi = await prisma.$transaction(async (tx) => {
            const registrasi = await tx.registrasi.create({
                data: {
                    nim: body.nim,
                    nama: body.nama,
                    id_prodi: idProdi,
                    angkatan: parseInt(body.angkatan),
                    cv: body.cv,
                    motivationLetter: body.motivationLetter,
                    portofolio: body.portofolio,
                    status: false,
                },
            });

            // Create related dataDivisi entries if id_divisi_1 and/or id_divisi_2 are provided
            if (body.id_divisi_1) {
                await tx.dataDivisi.create({
                    data: {
                        id_register: registrasi.id_registrasi,
                        id_divisi: parseInt(body.id_divisi_1),
                        pilihan: 1,
                    },
                });
            }
            
            if (body.id_divisi_2) {
                await tx.dataDivisi.create({
                    data: {
                        id_register: registrasi.id_registrasi,
                        id_divisi: parseInt(body.id_divisi_2),
                        pilihan: 2,
                    },
                });
            }

            return registrasi;
        });

        return NextResponse.json({ success : true, message: "Registrasi Berhasil", data: newRegistrasi }, { status: 201 });
    }

    catch (error) {
        console.error("Error Registrasi: ", error);
        return NextResponse.json({ success : false, message: "Registrasi Gagal" }, { status: 500 });
    }
}