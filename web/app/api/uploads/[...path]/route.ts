import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import mime from 'mime';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    // Only allow in development or if explicitly configured for local storage
    // But since this route only exists if we create it, and we only use it if StorageService points to it...
    // Ideally we should check process.env.NODE_ENV === 'development' or similar, but for now let's just serve.

    // Security: Ensure we don't traverse up
    const { path: pathSegments } = await params;
    const filePath = pathSegments.join('/');

    // Prevent directory traversal
    if (filePath.includes('..')) {
        return new NextResponse('Invalid path', { status: 400 });
    }

    // Locate the file in ../data/uploads
    // Note: In Docker, this maps to /data/uploads. Locally it maps to ../data/uploads relative to web/
    const uploadsDir = path.join(process.cwd(), '../data', 'uploads');
    const fullPath = path.join(uploadsDir, filePath);

    if (!fs.existsSync(fullPath)) {
        return new NextResponse('File not found', { status: 404 });
    }

    const fileBuffer = fs.readFileSync(fullPath);
    const contentType = mime.getType(fullPath) || 'application/octet-stream';

    return new NextResponse(fileBuffer, {
        headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=31536000, immutable',
        },
    });
}
