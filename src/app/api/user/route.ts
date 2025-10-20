import { auth } from "@/lib/auth"
import { NextResponse } from "next/server";

export async function GET() {
    const session = await auth()

    console.log("session: ", session?.user?.id);
    
    return NextResponse.json({
        name: session
    })
}