import { MetadataRoute } from 'next';
import { AppDataSource } from '../lib/db/data-source';
import { Post } from '../lib/db/entities/Post';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://shanari-shanari.com';

    // Initialize DB if needed
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }

    // Fetch published posts
    const postRepo = AppDataSource.getRepository(Post);
    const posts = await postRepo.find({
        where: { status: 'published' },
        select: ['slug', 'updatedAt'],
        order: { publishedAt: 'DESC' },
    });

    const postUrls = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/profile`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        ...postUrls,
    ];
}
