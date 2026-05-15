import { getInitializedDataSource } from '../data-source';
import { Post } from '../entities/Post';
import { FindOneOptions } from 'typeorm';
import { fileService } from '../../storage/file-service';

export class PostService {
    private static async getRepository() {
        const dataSource = await getInitializedDataSource();
        return dataSource.getRepository(Post);
    }

    static async getPosts(options: {
        page?: number;
        limit?: number;
        categorySlug?: string;
        tagSlug?: string;
        year?: string;
        month?: string;
        status?: string;
    }) {
        const {
            page = 1,
            limit = 10,
            categorySlug,
            tagSlug,
            year,
            month,
            status = 'published',
        } = options;

        const skip = (page - 1) * limit;
        const repo = await this.getRepository();
        const queryBuilder = repo.createQueryBuilder('post')
            .leftJoinAndSelect('post.categories', 'category')
            .leftJoinAndSelect('post.tags', 'tag')
            .leftJoinAndSelect('post.author', 'author')
            .where('post.status = :status', { status });

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

        return {
            posts,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    static async getPost(slug: string, status: string = 'published') {
        const repo = await this.getRepository();
        const options: FindOneOptions<Post> = {
            where: { slug, status },
            relations: ['categories', 'tags', 'author'],
        };
        return repo.findOne(options);
    }

    static async getPostWithContent(slug: string, status: string = 'published') {
        const post = await this.getPost(slug, status);
        if (!post) return null;

        let content = '';
        try {
            content = await fileService.getFileContent(post.filePath);
        } catch (error) {
            console.error(`Failed to load content for post ${slug}:`, error);
        }

        return { ...post, content };
    }

    static async getRelatedPosts(currentPost: Post, limit: number = 3) {
        const repo = await this.getRepository();

        // Logical flow for related posts:
        // 1. Same tags
        // 2. Same categories
        // 3. Exclude current post
        // 4. Status published
        // 5. Limit results

        // We use query builder to handle complex OR conditions with priority
        const queryBuilder = repo.createQueryBuilder('post')
            .leftJoinAndSelect('post.categories', 'category')
            .leftJoinAndSelect('post.tags', 'tag')
            .where('post.status = :status', { status: 'published' })
            .andWhere('post.id != :id', { id: currentPost.id });

        const tagIds = currentPost.tags?.map(t => t.id) || [];
        const categoryIds = currentPost.categories?.map(c => c.id) || [];

        if (tagIds.length === 0 && categoryIds.length === 0) {
            // If no tags or categories, return recent posts
            return queryBuilder
                .orderBy('post.publishedAt', 'DESC')
                .take(limit)
                .getMany();
        }

        // Build a query that prioritizes tag matches then category matches
        // Note: Complex scoring in SQL is hard with standard typeorm, 
        // so we'll fetch a slightly larger set matching ANY tag or category, 
        // and then sort/filter in memory for better relevance control.

        const conditions = [];
        if (tagIds.length > 0) {
            conditions.push('tag.id IN (:...tagIds)');
        }
        if (categoryIds.length > 0) {
            conditions.push('category.id IN (:...categoryIds)');
        }

        queryBuilder.andWhere(`(${conditions.join(' OR ')})`, { tagIds, categoryIds });

        // Fetch more than limit to allow for sorting
        const candidates = await queryBuilder.limit(limit * 3).getMany();

        // Calculate score
        const scoredPosts = candidates.map(post => {
            let score = 0;
            // High score for matching tags
            post.tags?.forEach(tag => {
                if (tagIds.includes(tag.id)) score += 2;
            });
            // Lower score for matching categories
            post.categories?.forEach(cat => {
                if (categoryIds.includes(cat.id)) score += 1;
            });
            return { post, score };
        });

        // Sort by score desc, then publishedAt desc
        scoredPosts.sort((a, b) => {
            if (a.score !== b.score) return b.score - a.score;
            return b.post.publishedAt.getTime() - a.post.publishedAt.getTime();
        });

        return scoredPosts.slice(0, limit).map(p => p.post);
    }
}
