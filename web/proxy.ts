import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function proxy(request: NextRequest) {
    // Only run on /admin routes or /api/admin routes
    if (!request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/api/admin')) {
        return NextResponse.next();
    }

    // Allow access to login page
    if (request.nextUrl.pathname === '/admin/login' || request.nextUrl.pathname === '/api/auth/login') {
        return NextResponse.next();
    }

    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
        if (request.nextUrl.pathname.startsWith('/api/')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
        const secret = new TextEncoder().encode(
            process.env.JWT_SECRET || 'default-secret-key'
        );
        await jwtVerify(token, secret);
        return NextResponse.next();
    } catch {
        if (request.nextUrl.pathname.startsWith('/api/')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }
}

export const config = {
    matcher: ['/admin/:path*', '/api/admin/:path*'],
};
