import { AppDataSource } from '../lib/db/data-source';
import { Post } from '../lib/db/entities/Post';
import { AdminUser } from '../lib/db/entities/AdminUser';
import { StorageService } from '../lib/storage';
import { format } from 'date-fns';

async function createTestPost() {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const postRepo = AppDataSource.getRepository(Post);
        const userRepo = AppDataSource.getRepository(AdminUser);

        // Ensure admin user exists
        let author = await userRepo.findOne({ where: { email: 'admin@example.com' } });
        if (!author) {
            author = userRepo.create({
                email: 'admin@example.com',
                name: 'Admin User',
                googleUid: 'admin-uid-123',
            });
            await userRepo.save(author);
        }

        const slug = 'iframe-test';
        const title = 'Iframe Test';
        const content = '<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ"></iframe>';
        const yearMonth = format(new Date(), 'yyyy/MM');
        const filePath = `posts/${yearMonth}/${slug}.md`;

        const fileContent = `---
title: ${title}
description: Test Description
date: ${new Date().toISOString()}
image: ""
math:
license: CC @detain_itatibs
slug: "${slug}"
hidden: false
draft: false
categories:
tags:
---

${content}`;

        await StorageService.save(filePath, fileContent, 'text/markdown');

        let post = await postRepo.findOne({ where: { slug } });
        if (!post) {
            post = postRepo.create({
                title,
                slug,
                filePath,
                status: 'published',
                author,
                publishedAt: new Date(),
                categories: [],
            });
        } else {
            post.title = title;
            post.filePath = filePath;
            post.status = 'published';
            post.author = author;
            post.publishedAt = new Date();
        }

        await postRepo.save(post);
        console.log('Test post created successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error creating test post:', error);
        process.exit(1);
    }
}

createTestPost();
