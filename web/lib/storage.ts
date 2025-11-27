import { Storage } from '@google-cloud/storage';
import fs from 'fs';
import path from 'path';

const storage = new Storage();
const bucketName = process.env.GCS_BUCKET_NAME || 'shanari-antigravity';
const bucket = storage.bucket(bucketName);

const USE_GCS = !!process.env.GCS_BUCKET_NAME;

export const StorageService = {
    async save(filePath: string, content: string | Buffer, contentType: string): Promise<string> {
        if (USE_GCS) {
            try {
                const file = bucket.file(filePath);
                await file.save(content, {
                    contentType,
                    resumable: false,
                });
                return `https://storage.googleapis.com/${bucketName}/${filePath}`;
            } catch (error) {
                console.warn('GCS upload failed, falling back to local:', error);
            }
        }

        // Local fallback
        let localPath: string;
        let publicUrl: string;

        if (filePath.startsWith('posts/')) {
            // Save posts to ../data (private/internal storage)
            localPath = path.join(process.cwd(), '../data', filePath);
            publicUrl = ''; // Posts don't have a direct public URL in this context
        } else {
            // Save images/others to ../data/uploads (served via API)
            localPath = path.join(process.cwd(), '../data', 'uploads', filePath);
            publicUrl = `/api/uploads/${filePath}`;
        }

        const dir = path.dirname(localPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        if (Buffer.isBuffer(content)) {
            fs.writeFileSync(localPath, content);
        } else {
            fs.writeFileSync(localPath, content);
        }

        return publicUrl;
    },

    async get(filePath: string): Promise<string> {
        if (USE_GCS) {
            try {
                const file = bucket.file(filePath);
                const [content] = await file.download();
                return content.toString();
            } catch (error) {
                console.warn('GCS download failed, falling back to local:', error);
            }
        }

        // Local fallback
        let localPath: string;
        if (filePath.startsWith('posts/')) {
            localPath = path.join(process.cwd(), '../data', filePath);
        } else {
            localPath = path.join(process.cwd(), '../data', 'uploads', filePath);
        }

        if (fs.existsSync(localPath)) {
            return fs.readFileSync(localPath, 'utf-8');
        }
        return '';
    }
};
