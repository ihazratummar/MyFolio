import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/session';

export async function middleware(request: NextRequest) {
    // Only run on /admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // Allow access to login and callback without session
        if (
            request.nextUrl.pathname === '/admin/login' ||
            request.nextUrl.pathname === '/admin/oauth2callback'
        ) {
            return NextResponse.next();
        }

        // Verify session for all other /admin routes
        const token = request.cookies.get('admin_session')?.value;
        const session = token ? await verifyToken(token) : null;

        if (!session) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*',
};
