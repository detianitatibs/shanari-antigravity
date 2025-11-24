import { NextResponse } from 'next/server';
import { AppDataSource } from '../../../lib/db/data-source';
import { Post } from '../../../lib/db/entities/Post';

export async function GET(request: Request) {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const { searchParams } = new URL(request.url);
        const categorySlug = searchParams.get('category');
        const tagSlug = searchParams.get('tag');
        const year = searchParams.get('year');
        const month = searchParams.get('month');

        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        const postRepo = AppDataSource.getRepository(Post);
        const queryBuilder = postRepo.createQueryBuilder('post')
            .leftJoinAndSelect('post.categories', 'category')
            .leftJoinAndSelect('post.tags', 'tag')
            .leftJoinAndSelect('post.author', 'author')
            .where('post.status = :status', { status: 'published' });

        if (categorySlug) {
            queryBuilder.andWhere('category.slug = :categorySlug', { categorySlug });
        }

        if (tagSlug) {
            queryBuilder.andWhere('tag.slug = :tagSlug', { tagSlug });
        }

        if (year && month) {
            queryBuilder.andWhere("strftime('%Y', post.publishedAt) = :year", { year });
            queryBuilder.andWhere("strftime('%m', post.publishedAt) = :month", { month });
        }

        queryBuilder
            .orderBy('post.publishedAt', 'DESC')
            .skip(skip)
            .take(limit);

        const [posts, total] = await queryBuilder.getManyAndCount();

        return NextResponse.json({
            posts,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
