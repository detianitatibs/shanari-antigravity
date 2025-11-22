import { NextResponse } from 'next/server';
import { AppDataSource } from '../../../lib/db/data-source';
import { Post } from '../../../lib/db/entities/Post';

export async function GET() {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const postRepo = AppDataSource.getRepository(Post);
        const posts = await postRepo.find({
            where: { status: 'published' },
            order: { publishedAt: 'DESC' },
            relations: ['categories', 'author'],
        });

        return NextResponse.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
