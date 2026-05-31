import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
    try {
        const cookie = await cookies();

        cookie.delete('session');

        return NextResponse.json({ success: true, message: "Logout Success"}, {status: 200});

    } catch (error) {
        console.error("Logout Error: ", error);
        return NextResponse.json({ success: false, message: "Internal Server Error"}, {status: 500});
    }
}