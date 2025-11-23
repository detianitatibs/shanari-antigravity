import { NextResponse } from 'next/server';
import { AppDataSource } from '../../../../../lib/db/data-source';
import { Post } from '../../../../../lib/db/entities/Post';
import { Category } from '../../../../../lib/db/entities/Category';
import { AdminUser } from '../../../../../lib/db/entities/AdminUser';
import { StorageService } from '../../../../../lib/storage';
import { format } from 'date-fns';
import matter from 'gray-matter';

export async function GET(
    request: Request,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    context: any
) {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const { id } = await context.params;
        const postRepo = AppDataSource.getRepository(Post);

        const post = await postRepo.findOne({
            where: { id: parseInt(id) },
            relations: ['categories', 'author'],
        });

        if (!post) {
            return NextResponse.json(
                { error: 'Post not found' },
                { status: 404 }
            );
        }

        // Fetch content from Storage
        const fileContent = await StorageService.get(post.filePath);
        const { content, data } = matter(fileContent);

        return NextResponse.json({
            ...post,
            content,
            description: data.description,
            thumbnail: data.image,
            tags: data.tags,
        });
    } catch (error) {
        console.error('Error fetching post:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    context: any
) {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const { id } = await context.params;
        const postRepo = AppDataSource.getRepository(Post);

        const result = await postRepo.delete(id);

        if (result.affected === 0) {
            return NextResponse.json(
                { error: 'Post not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting post:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    context: any
) {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const { id } = await context.params;
        const body = await request.json();
        const { title, slug, content, status, categories, authorId, description, thumbnail, tags } = body;

        const postRepo = AppDataSource.getRepository(Post);
        const categoryRepo = AppDataSource.getRepository(Category);
        const userRepo = AppDataSource.getRepository(AdminUser);

        const post = await postRepo.findOne({
            where: { id: parseInt(id) },
            relations: ['categories', 'author'],
        });

        if (!post) {
            return NextResponse.json(
                { error: 'Post not found' },
                { status: 404 }
            );
        }

        // Update Storage content
        let filePath = post.filePath;
        if (slug !== post.slug) {
            const yearMonth = format(new Date(), 'yyyy/MM');
            filePath = `posts/${yearMonth}/${slug}.md`;
        }

        const fileContent = `---
title: ${title}
description: ${description || ''}
date: ${post.publishedAt ? post.publishedAt.toISOString() : new Date().toISOString()}
updated: ${new Date().toISOString()}
image: "${thumbnail || ''}"
math:
license: CC @detain_itatibs
slug: "${slug}"
hidden: false
draft: ${status === 'draft'}
categories:
${categories?.map((c: string) => `  - ${c}`).join('\n') || ''}
tags:
${tags?.map((t: string) => `  - ${t}`).join('\n') || ''}
---

${content}`;

        await StorageService.save(filePath, fileContent, 'text/markdown');

        // Update Categories
        const categoryEntities: Category[] = [];
        if (categories && Array.isArray(categories)) {
            for (const catName of categories) {
                let category = await categoryRepo.findOneBy({ name: catName });
                if (!category) {
                    category = categoryRepo.create({ name: catName, slug: catName.toLowerCase() });
                    await categoryRepo.save(category);
                }
                categoryEntities.push(category);
            }
        }

        // Update Author if provided
        if (authorId && authorId !== post.authorId) {
            const author = await userRepo.findOneBy({ id: authorId });
            if (author) {
                post.author = author;
            }
        }

        post.title = title;
        post.slug = slug;
        post.filePath = filePath;
        post.status = status;
        post.categories = categoryEntities;

        if (status === 'published' && !post.publishedAt) {
            post.publishedAt = new Date();
        }

        await postRepo.save(post);

        return NextResponse.json(post);

    } catch (error) {
        console.error('Error updating post:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
