import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import ExcelJS from 'exceljs';

export async function GET(request: Request) {
    try {
         // Authentication check
        const cookie = await cookies();
        const session = cookie.get('session')?.value;
        
        if (!session) {
            return NextResponse.json({message: "Unauthorized"}, {status: 401});
        }
        
        // Verify the token
        try {
            await verifyToken(session);
                    
        } catch (error) {
            return NextResponse.json({message: "Invalid or expired token"}, {status: 401});
        }

        // Get All Data Regis
        const registration = await prisma.registrasi.findMany({
            include: {
                prodi: {
                    include: {
                        fakultas: true,
                    },
                },
                dataDivisi: {
                    include: {
                        divisi: true,
                    },
                },
            },
            orderBy: {
                id_registrasi: 'asc',
            },
        });

        // Format Data to Excel
        const formattedData = registration.map((reg) => {
            const divisi1 = reg.dataDivisi.find((divisi) => divisi.pilihan === 1)?.divisi.nama || '-';
            const divisi2 = reg.dataDivisi.find((divisi) => divisi.pilihan === 2)?.divisi.nama || '-';

            return {
                id: reg.id_registrasi,
                nim: reg.nim,
                nama: reg.nama,
                angkatan: reg.angkatan,
                fakultas: reg.prodi?.fakultas?.nama,
                prodi: reg.prodi?.nama,
                divisi1,
                divisi2,
                status: reg.status ? 'Accepted' : 'Not Accepted',
                cv: reg.cv || '-',
                motivationLetter: reg.motivationLetter || '-',
                portofolio: reg.portofolio || '-',
            };
        });

        // Make Workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Data Registrasi');

        worksheet.columns = [
            { header: 'ID', key: 'id', width: 8 },
            { header: 'NIM', key: 'nim', width: 20 },
            { header: 'Nama Lengkap', key: 'nama', width: 35 },
            { header: 'Angkatan', key: 'angkatan', width: 12 },
            { header: 'Fakultas', key: 'fakultas', width: 30 },
            { header: 'Program Studi', key: 'prodi', width: 30 },
            { header: 'Divisi Pilihan 1', key: 'divisi1', width: 25 },
            { header: 'Divisi Pilihan 2', key: 'divisi2', width: 25 },
            { header: 'Status', key: 'status', width: 15 },
            { header: 'Link CV', key: 'cv', width: 60 },
            { header: 'Link Motivation Letter', key: 'motivationLetter', width: 60 },
            { header: 'Link Portofolio', key: 'portofolio', width: 60 },
        ];

        // Header
        const header = worksheet.getRow(1);
        header.font = {
            bold: true,
            color: {
                argb: 'FFFFFFFF'
            }
        };

        header.alignment = {
            vertical: 'middle',
            horizontal: 'center'
        };

        header.eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: 'FFEA5428'
                },
            };

            cell.border = {
                top: {style: 'thin'},
                left: {style: 'thin'},
                bottom: {style: 'thin'},
                right: {style: 'thin'}
            };
        });

        // Insert Formatted Data
        formattedData.forEach((data) => {
            const row = worksheet.addRow(data);
            row.alignment = {
                vertical: 'top',
                horizontal: 'left',
                wrapText: true
            };
        });

        const buffer = await workbook.xlsx.writeBuffer();

        // Send File to Frontend
        return new NextResponse(buffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename="Registrasi_Intern_ASE.xlsx"`,
            },
        });

    } catch (error: any) {
        console.error('Error export data: ', error);

        return NextResponse.json(
            {message: 'Failed Export Data', error: error.messsage},
            {status: 500}
        );

    } finally {
        await prisma.$disconnect();
    }
}