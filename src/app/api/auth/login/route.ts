import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const { password } = await request.json();

        // Check against environment variable
        // Default to 'admin' if not set (for development only, user should set this)
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';

        if (password === ADMIN_PASSWORD) {
            // Set cookie
            cookies().set('admin_session', 'true', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24, // 1 day
                path: '/',
            });

            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ success: false, message: 'Invalid password' }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ success: false, message: 'An error occurred' }, { status: 500 });
    }
}
