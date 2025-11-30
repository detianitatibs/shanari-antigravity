import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { AppDataSource } from '../../../../../lib/db/data-source';
import { Post } from '../../../../../lib/db/entities/Post';
import { Category } from '../../../../../lib/db/entities/Category';
import { Tag } from '../../../../../lib/db/entities/Tag';
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

        revalidatePath('/blog');
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
        const { title, slug, content, status, categories, authorId, description, thumbnail, tags, date } = body;

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

        const publishedAt = date ? new Date(date) : (post.publishedAt || new Date());

        const fileContent = `---
title: ${JSON.stringify(title)}
description: ${description ? JSON.stringify(description) : '""'}
date: ${publishedAt.toISOString()}
updated: ${new Date().toISOString()}
image: ${thumbnail ? JSON.stringify(thumbnail) : '""'}
math:
license: CC @detain_itatibs
slug: ${JSON.stringify(slug)}
hidden: false
draft: ${status === 'draft'}
categories:
${categories?.map((c: string) => `  - ${c}`).join('\n') || ''}
tags:
${tags?.map((t: string) => `  - ${t}`).join('\n') || ''}
---

${content}`;

        await StorageService.save(filePath, fileContent, 'text/markdown');

        // Handle categories
        const categoryEntities: Category[] = [];
        if (categories && categories.length > 0) {
            for (const catName of categories) {
                let category = await categoryRepo.findOne({ where: { name: catName } });
                if (!category) {
                    category = categoryRepo.create({
                        name: catName,
                        slug: catName.toLowerCase().replace(/ /g, '-'),
                    });
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

        // Handle tags
        const tagRepo = AppDataSource.getRepository(Tag);
        const tagEntities: Tag[] = [];
        if (tags && tags.length > 0) {
            for (const tagName of tags) {
                let tag = await tagRepo.findOne({ where: { name: tagName } });
                if (!tag) {
                    tag = tagRepo.create({ name: tagName, slug: tagName });
                    await tagRepo.save(tag);
                }
                tagEntities.push(tag);
            }
        }

        post.title = title;
        post.slug = slug;
        post.filePath = filePath;
        post.status = status;
        post.categories = categoryEntities;
        post.tags = tagEntities;
        post.publishedAt = publishedAt;
        post.thumbnail = thumbnail;

        // If status is published and publishedAt was not set, set it now
        if (status === 'published' && !post.publishedAt) {
            post.publishedAt = new Date();
        }

        await postRepo.save(post);

        revalidatePath('/blog');
        revalidatePath(`/blog/${slug}`);
        return NextResponse.json(post);

    } catch (error) {
        console.error('Error updating post:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
