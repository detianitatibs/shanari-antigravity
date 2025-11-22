import { Storage } from '@google-cloud/storage';
import fs from 'fs';
import path from 'path';

export interface FileService {
    getFileContent(filePath: string): Promise<string>;
}

class LocalFileService implements FileService {
    private basePath: string;

    constructor(basePath: string) {
        this.basePath = basePath;
    }

    async getFileContent(filePath: string): Promise<string> {
        const fullPath = path.join(this.basePath, filePath);
        try {
            return fs.readFileSync(fullPath, 'utf-8');
        } catch (error) {
            console.error(`Error reading local file: ${fullPath}`, error);
            throw new Error(`File not found: ${filePath}`);
        }
    }
}

class GCSFileService implements FileService {
    private storage: Storage;
    private bucketName: string;

    constructor(bucketName: string) {
        this.storage = new Storage();
        this.bucketName = bucketName;
    }

    async getFileContent(filePath: string): Promise<string> {
        try {
            const bucket = this.storage.bucket(this.bucketName);
            const file = bucket.file(filePath);
            const [content] = await file.download();
            return content.toString('utf-8');
        } catch (error) {
            console.error(`Error reading GCS file: ${filePath}`, error);
            throw new Error(`File not found: ${filePath}`);
        }
    }
}

const getFileService = (): FileService => {
    const bucketName = process.env.GCS_BUCKET_NAME;

    // If bucket name is 'local-bucket' or not set, use local file service
    // In Docker, /data is mounted. Locally, we might want to use ../../data relative to this file?
    // Or just assume we run in Docker or have DATA_DIR env.
    // Let's use a DATA_DIR env or default to /data for Docker.
    // For local dev outside docker, we need to handle that.

    if (bucketName === 'local-bucket' || !bucketName) {
        // Check if we are in a container or local
        // A simple way is to check if /data exists
        if (fs.existsSync('/data')) {
            return new LocalFileService('/data');
        }
        // Fallback for local development outside Docker (e.g. npm run dev on host)
        // Assuming running from web root, data is in ../data
        const localDataPath = path.resolve(process.cwd(), '../data');
        return new LocalFileService(localDataPath);
    }

    return new GCSFileService(bucketName);
};

export const fileService = getFileService();
