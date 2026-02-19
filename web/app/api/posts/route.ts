import { NextResponse } from 'next/server';
import { PostService } from '../../../lib/db/services/post';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const categorySlug = searchParams.get('category') || undefined;
        const tagSlug = searchParams.get('tag') || undefined;
        const year = searchParams.get('year') || undefined;
        const month = searchParams.get('month') || undefined;

        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');

        const result = await PostService.getPosts({
            page,
            limit,
            categorySlug,
            tagSlug,
            year,
            month,
        });

        return NextResponse.json({
            posts: result.posts,
            pagination: {
                total: result.total,
                page: result.page,
                limit: result.limit,
                totalPages: result.totalPages,
            },
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
