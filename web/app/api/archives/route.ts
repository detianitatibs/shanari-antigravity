import { NextResponse } from 'next/server';
import { AppDataSource } from '../../../lib/db/data-source';
import { Post } from '../../../lib/db/entities/Post';

export async function GET() {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const postRepo = AppDataSource.getRepository(Post);

        // Use raw query to group by month
        // SQLite specific syntax for date formatting: strftime('%Y-%m', published_at)
        const archives = await postRepo.query(`
      SELECT strftime('%Y-%m', published_at) as month, COUNT(*) as count
      FROM posts
      WHERE status = 'published'
      GROUP BY month
      ORDER BY month DESC
    `);

        return NextResponse.json(archives);
    } catch (error) {
        console.error('Error fetching archives:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
