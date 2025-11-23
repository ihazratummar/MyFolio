import { generateAuthUrl } from "@/lib/google";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const url = await generateAuthUrl();
        return NextResponse.json({ url });
    } catch (error) {
        return NextResponse.json({ error: "Failed to generate auth url" }, { status: 500 });
    }
}
