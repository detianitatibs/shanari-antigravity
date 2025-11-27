import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { AppDataSource } from '../../../../lib/db/data-source';
import { Post } from '../../../../lib/db/entities/Post';
import { Category } from '../../../../lib/db/entities/Category';
import { Tag } from '../../../../lib/db/entities/Tag';
import { AdminUser } from '../../../../lib/db/entities/AdminUser';
import { StorageService } from '../../../../lib/storage';
import { format } from 'date-fns';
import { auth } from '@/auth';

export async function GET(request: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        const postRepo = AppDataSource.getRepository(Post);
        const [posts, total] = await postRepo.findAndCount({
            order: { publishedAt: 'DESC', createdAt: 'DESC' },
            relations: ['categories', 'author'],
            skip,
            take: limit,
        });

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
        console.error('Error fetching admin posts:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const body = await request.json();
        const { title, slug, content, status, categories, authorId, description, thumbnail, tags, date } = body;

        // Validation
        if (!title || !slug || !content || !authorId) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Upload content to Storage
        const yearMonth = format(new Date(), 'yyyy/MM');
        const filePath = `posts/${yearMonth}/${slug}.md`;

        // Create frontmatter + content
        const publishedAt = date ? new Date(date) : new Date();
        const fileContent = `---
title: ${JSON.stringify(title)}
description: ${description ? JSON.stringify(description) : '""'}
date: ${publishedAt.toISOString()}
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

        // Save to DB
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const postRepo = AppDataSource.getRepository(Post);
        const categoryRepo = AppDataSource.getRepository(Category);
        const userRepo = AppDataSource.getRepository(AdminUser);

        const author = await userRepo.findOne({ where: { id: authorId } });
        if (!author) {
            return NextResponse.json({ error: 'Author not found' }, { status: 404 });
        }

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

        // Handle tags
        const tagRepo = AppDataSource.getRepository(Tag);
        const tagEntities: Tag[] = [];
        if (tags && tags.length > 0) {
            for (const tagName of tags) {
                let tag = await tagRepo.findOne({ where: { name: tagName } });
                if (!tag) {
                    tag = tagRepo.create({ name: tagName, slug: tagName }); // Simple slug for now
                    await tagRepo.save(tag);
                }
                tagEntities.push(tag);
            }
        }

        const newPost = postRepo.create({
            title,
            slug,
            filePath,
            status,
            author,
            categories: categoryEntities,
            tags: tagEntities,
            publishedAt: publishedAt,
            thumbnail: thumbnail,
        });

        await postRepo.save(newPost);

        revalidatePath('/blog');
        return NextResponse.json(newPost, { status: 201 });

    } catch (error) {
        console.error('Error creating post:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
