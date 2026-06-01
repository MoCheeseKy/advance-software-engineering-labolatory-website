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