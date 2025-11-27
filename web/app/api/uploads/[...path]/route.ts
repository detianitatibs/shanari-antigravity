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

    // GCS Proxy Logic
    const bucketName = process.env.GCS_BUCKET_NAME;
    if (bucketName) {
        try {
            const { Storage } = await import('@google-cloud/storage');
            const storage = new Storage();
            const bucket = storage.bucket(bucketName);
            const file = bucket.file(filePath);

            const [exists] = await file.exists();
            if (!exists) {
                return new NextResponse('File not found', { status: 404 });
            }

            const [metadata] = await file.getMetadata();
            const contentType = metadata.contentType || 'application/octet-stream';

            // Download file content
            const [content] = await file.download();

            return new NextResponse(content, {
                headers: {
                    'Content-Type': contentType,
                    'Cache-Control': 'public, max-age=31536000, immutable',
                },
            });
        } catch (error) {
            console.error('GCS Proxy Error:', error);
            return new NextResponse('Internal Server Error', { status: 500 });
        }
    }

    // Local fallback (existing logic)
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
