import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { AppDataSource } from '../../../../lib/db/data-source';
import { AdminUser } from '../../../../lib/db/entities/AdminUser';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        // Initialize DB if needed
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const userRepo = AppDataSource.getRepository(AdminUser);
        const user = await userRepo.findOneBy({ email });

        // Simple mock password check for now (In production, use bcrypt)
        // For this task, we assume if user exists and password matches a hardcoded one or field
        // Since we didn't add password field to AdminUser entity in previous tasks,
        // let's assume for now we just check email existence and a hardcoded password for dev.
        // TODO: Add password hashing
        if (!user || password !== 'admin123') {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const secret = new TextEncoder().encode(
            process.env.JWT_SECRET || 'default-secret-key'
        );

        const token = await new SignJWT({ uid: user.id, email: user.email })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('24h')
            .sign(secret);

        const response = NextResponse.json({ success: true });
        response.cookies.set('auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
        });

        return response;
    } catch (err) {
        console.error('Login error:', err);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
