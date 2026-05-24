import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const [fakultas, divisi, prodi] = await Promise.all([
            prisma.fakultas.findMany(
                {orderBy: { id_fakultas: "asc" }}
            ),
            prisma.divisi.findMany(
                {orderBy: { id_divisi: "asc" }}
            ),
            prisma.prodi.findMany({
                orderBy: { id_prodi: "asc" }}
            ),
        ]);

        return NextResponse.json({ success: true, data: { fakultas, divisi, prodi } }, { status: 200 });
    
    } catch (error) {
        console.error("Error GET Fakultas, Divisi, Prodi: ", error);
        return NextResponse.json({ success: false, message: "Failed to fetch fakultas, divisi, and prodi data" }, { status: 500 });
    }
}
