import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function GET() {
    try {
        const cookie = await cookies();
        const session = cookie.get("session")?.value;

        if (!session) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }
        
        const sessionData = await verifyToken(session);

        return NextResponse.json({
            success: true,
            data: {
                username: sessionData.username,
                role: sessionData.role,
            }
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching user session:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}