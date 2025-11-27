import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        return NextResponse.json({
            id: session.user.id,
            email: session.user.email,
            name: session.user.name,
        });
    } catch (error) {
        console.error('Error in /api/auth/me:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
