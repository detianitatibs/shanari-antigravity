import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { AdminUser } from './entities/AdminUser';
import { Post } from './entities/Post';
import { Category } from './entities/Category';
import path from 'path';

// Handle DATABASE_URL or default to local path
const getDatabasePath = () => {
    if (process.env.DATABASE_URL) {
        // If it starts with file:, strip it
        if (process.env.DATABASE_URL.startsWith('file:')) {
            return process.env.DATABASE_URL.slice(5);
        }
        return process.env.DATABASE_URL;
    }
    // Default for local development (outside docker)
    // Assumes running from web directory or root, need to be careful.
    // Let's assume running from web directory, so ../db/database.sqlite
    return path.resolve(__dirname, '../../../../db/database.sqlite');
};

export const AppDataSource = new DataSource({
    type: 'sqlite',
    database: getDatabasePath(),
    synchronize: true, // Auto-create tables for dev
    logging: false,
    entities: [AdminUser, Post, Category],
    migrations: [],
    subscribers: [],
});
