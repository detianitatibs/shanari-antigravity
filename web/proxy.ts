import { auth } from './auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
    const isAuth = !!req.auth;
    const isLoginPage = req.nextUrl.pathname === '/admin/login';
    const isAdminPage = req.nextUrl.pathname.startsWith('/admin');
    const isApiAdminPage = req.nextUrl.pathname.startsWith('/api/admin');

    // Protect /admin routes
    if (isAdminPage && !isLoginPage && !isAuth) {
        return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    // Protect /api/admin routes
    if (isApiAdminPage && !isAuth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Redirect to /admin if already logged in and visiting login page
    if (isLoginPage && isAuth) {
        return NextResponse.redirect(new URL('/admin', req.url));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ['/admin/:path*', '/api/admin/:path*'],
};
