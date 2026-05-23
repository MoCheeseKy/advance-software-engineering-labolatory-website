import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Seeding database...');

    // Clear existing data
    await prisma.prodi.deleteMany();
    await prisma.fakultas.deleteMany();
    await prisma.divisi.deleteMany();
    
    // Seed Fakultas
    const fakultasData = [
        { id_fakultas: 1,nama: 'Fakultas Informatika' },
        { id_fakultas: 2,nama: 'Fakultas Rekayasa Industri' },
        { id_fakultas: 3,nama: 'Fakultas Teknik Elektro' },
        { id_fakultas: 4,nama: 'Fakultas Ekonomi dan Bisnis' },
        { id_fakultas: 5,nama: 'Fakultas Komunikasi Sosial' },
        { id_fakultas: 6,nama: 'Fakultas Industri Kreatif' },
        { id_fakultas: 7,nama: 'Fakultas Ilmu Terapan' },
        { id_fakultas: 8,nama: 'Fakultas Kedokteran' },
    ];

    const finishedFakultas = await prisma.fakultas.createMany({
        data: fakultasData,
        skipDuplicates: true,
    });

    console.log(`Seeded ${finishedFakultas.count} fakultas.`);

    // Seed Divisi
    const divisiData = [
        { id_divisi: 1, nama: 'System Analyst' },
        { id_divisi: 2, nama: 'Quality Assurance' },
        { id_divisi: 3, nama: 'Backend Development' },
        { id_divisi: 4, nama: 'Frontend Development' },
        { id_divisi: 5, nama: 'Mobile Development' },
        { id_divisi: 6, nama: 'Game Programming' },
        { id_divisi: 7, nama: 'Game Design' },
        { id_divisi: 8, nama: 'Game Artist' },
        { id_divisi: 9, nama: 'UI/UX Design' },
        { id_divisi: 10, nama: 'Audio Composer' },
    ];

    const finishedDivision = await prisma.divisi.createMany({
        data: divisiData,
        skipDuplicates: true,
    })

    console.log(`Seeded ${finishedDivision.count} divisi.`);

    // Seed Prodi
    const prodiData = [
        // Fakultas Informatika
        { id_prodi: 1, nama: 'S1 Informatika', id_fakultas: 1 },
        { id_prodi: 2, nama: 'S1 Teknologi Informasi', id_fakultas: 1 },
        { id_prodi: 3, nama: 'S1 Rekayasa Perangkat Lunak', id_fakultas: 1 },
        { id_prodi: 4, nama: 'S1 Informatika PJJ', id_fakultas: 1 },
        { id_prodi: 5, nama: 'S1 Sains Data', id_fakultas: 1 },
        { id_prodi: 6, nama: 'S2 Informatika', id_fakultas: 1 },
        { id_prodi: 7, nama: 'S2 Ilmu Forensik', id_fakultas: 1 },
        { id_prodi: 8, nama: 'S3 Informatika', id_fakultas: 1 },

        // Fakultas Rekayasa Industri
        { id_prodi: 9, nama: 'S1 Teknik Industri', id_fakultas: 2 },
        { id_prodi: 10, nama: 'S1 Sistem Informasi', id_fakultas: 2 },
        { id_prodi: 11, nama: 'S1 Teknik Logistik', id_fakultas: 2 },
        { id_prodi: 12, nama: 'S1 Manajemen Rekayasa', id_fakultas: 2 },
        { id_prodi: 13, nama: 'S2 Teknik Industri', id_fakultas: 2 },
        { id_prodi: 14, nama: 'S2 Sistem Informasi', id_fakultas: 2 },

        // Fakultas Teknik Elektro
        { id_prodi: 15, nama: 'S1 Teknik Elektro', id_fakultas: 3 },
        { id_prodi: 16, nama: 'S1 Teknik Telekomunikasi', id_fakultas: 3 },
        { id_prodi: 17, nama: 'S1 Teknik Fisika', id_fakultas: 3 },
        { id_prodi: 18, nama: 'S1 Teknik Komputer', id_fakultas: 3 },
        { id_prodi: 19, nama: 'S1 Teknik Biomedis', id_fakultas: 3 },
        { id_prodi: 20, nama: 'S1 Teknik Sistem Energi', id_fakultas: 3 },
        { id_prodi: 21, nama: 'S2 Teknik Elektro', id_fakultas: 3 },
        { id_prodi: 22, nama: 'S3 Teknik Elektro', id_fakultas: 3 },

        // Fakultas Ekonomi dan Bisnis
        { id_prodi: 23, nama: 'S1 Manajemen Bisnis Telekomunikasi dan Informmatika (MBTI)', id_fakultas: 4 },
        { id_prodi: 24, nama: 'S1 Akuntansi', id_fakultas: 4 },
        { id_prodi: 25, nama: 'S1 Bisnis Rekreasi', id_fakultas: 4 },
        { id_prodi: 26, nama: 'S1 Leisure Management', id_fakultas: 4 },
        { id_prodi: 27, nama: 'S1 Administrasi Bisnis', id_fakultas: 4 },
        { id_prodi: 28, nama: 'S1 Bisnis Digital', id_fakultas: 4 },
        { id_prodi: 29, nama: 'S2 Akutansi', id_fakultas: 4 },
        { id_prodi: 30, nama: 'S2 Manajemen', id_fakultas: 4 },
        { id_prodi: 31, nama: 'S2 Manajemen PJJ', id_fakultas: 4 },
        { id_prodi: 32, nama: 'S2 Administrasi Bisnis', id_fakultas: 4 },
        { id_prodi: 33, nama: 'S3 Manajemen', id_fakultas: 4 },

        // Fakultas Komunikasi Sosial
        { id_prodi: 34, nama: 'S1 Ilmu Komunikasi', id_fakultas: 5 },
        { id_prodi: 35, nama: 'S1 Ilmu Hubungan Masyarakat', id_fakultas: 5 },
        { id_prodi: 36, nama: 'S1 Digital Content Broadcasting', id_fakultas: 5 },
        { id_prodi: 37, nama: 'S1 Psikologi', id_fakultas: 5 },
        { id_prodi: 38, nama: 'S2 Ilmu Komunikasi', id_fakultas: 5 },

        // Fakultas Industri Kreatif
        { id_prodi: 39, nama: 'S1 Desain Komunikasi Visual', id_fakultas: 6 },
        { id_prodi: 40, nama: 'S1 Desain Produk', id_fakultas: 6 },
        { id_prodi: 41, nama: 'S1 Desain Interior', id_fakultas: 6 },
        { id_prodi: 42, nama: 'S1 Seni Rupa', id_fakultas: 6 },
        { id_prodi: 43, nama: 'S1 Kriya', id_fakultas: 6 },
        { id_prodi: 44, nama: 'S1 Film dan Animasi', id_fakultas: 6 },
        { id_prodi: 45, nama: 'S2 Desain', id_fakultas: 6 },
        
        // Fakultas Ilmu Terapan
        { id_prodi: 46, nama: 'D3 Teknik Telekomunikasi', id_fakultas: 7 },
        { id_prodi: 47, nama: 'D3 Rekayasa Perangkat Lunak Aplikasi', id_fakultas: 7 },
        { id_prodi: 48, nama: 'D3 Sistem Informasi', id_fakultas: 7 },
        { id_prodi: 49, nama: 'D3 Sistem Informasi Akuntansi', id_fakultas: 7 },
        { id_prodi: 50, nama: 'D3 Teknologi Komputer', id_fakultas: 7 },
        { id_prodi: 51, nama: 'D3 Digital Marketing', id_fakultas: 7 },
        { id_prodi: 52, nama: 'D3 Hospitality And Culinary Art', id_fakultas: 7 },
        { id_prodi: 53, nama: 'D3 Manajemen Pemasaran', id_fakultas: 7 },
        { id_prodi: 54, nama: 'S1 Terapan Digital Creative Multimedia', id_fakultas: 7 },
        { id_prodi: 55, nama: 'S1 Terapan Sistem Informasi Kota Cerdas', id_fakultas: 7 },
        { id_prodi: 56, nama: 'S1 Rekayasa Multimedia', id_fakultas: 7 },
    ];

    const finishedProdi = await prisma.prodi.createMany({
        data: prodiData,
        skipDuplicates: true,
    });


    console.log(`Seeded ${finishedProdi.count} prodi.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })

    .finally(async () => {
        await prisma.$disconnect();
    });