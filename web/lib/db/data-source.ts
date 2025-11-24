import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { AdminUser } from './entities/AdminUser';
import { Post } from './entities/Post';
import { Category } from './entities/Category';
import { Tag } from './entities/Tag';
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
    // Default for local development
    // Use process.cwd() to get the project root (web directory)
    // Then go up one level to find the db directory
    return path.join(process.cwd(), '../db/database.sqlite');
};

export const AppDataSource = new DataSource({
    type: 'sqlite',
    database: getDatabasePath(),
    synchronize: true, // Auto-create tables for dev
    logging: false,
    entities: [AdminUser, Post, Category, Tag],
    migrations: [],
    subscribers: [],
});
