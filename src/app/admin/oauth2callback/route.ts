import { verifyGoogleToken } from "@/lib/google";
import { createToken } from "@/lib/session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");

    if (!code) {
        return NextResponse.json({ error: "No code provided" }, { status: 400 });
    }

    try {
        const payload = await verifyGoogleToken(code);

        if (payload?.email === "hazratummar9@gmail.com") {
            const token = await createToken(payload.email);

            cookies().set('admin_session', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24, // 24 hours
                path: '/',
            });

            return NextResponse.redirect(new URL("/admin", request.url));
        } else {
            return NextResponse.json({ error: "Access Denied: Unauthorized email" }, { status: 403 });
        }
    } catch (error) {
        console.error("OAuth Error:", error);
        return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
    }
}
