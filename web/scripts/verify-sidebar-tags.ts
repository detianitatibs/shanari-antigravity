import { AppDataSource } from '../lib/db/data-source';
import { Post } from '../lib/db/entities/Post';
import { Tag } from '../lib/db/entities/Tag';
import { AdminUser } from '../lib/db/entities/AdminUser';
import { StorageService } from '../lib/storage';
import { format } from 'date-fns';

async function verifySidebarTags() {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const postRepo = AppDataSource.getRepository(Post);
        const tagRepo = AppDataSource.getRepository(Tag);
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

        // Create tags
        const tagNames = ['SidebarTag1', 'SidebarTag2'];
        const tagEntities: Tag[] = [];
        for (const name of tagNames) {
            let tag = await tagRepo.findOne({ where: { name } });
            if (!tag) {
                tag = tagRepo.create({ name, slug: name.toLowerCase() });
                await tagRepo.save(tag);
            }
            tagEntities.push(tag);
        }

        // Create post with tags
        const slug = 'sidebar-tag-test';
        const title = 'Sidebar Tag Test';
        const content = 'Test content';
        const yearMonth = format(new Date(), 'yyyy/MM');
        const filePath = `posts/${yearMonth}/${slug}.md`;

        const fileContent = `---
title: ${title}
description: Test Description
date: ${new Date().toISOString()}
image: ""
slug: "${slug}"
tags:
${tagNames.map(t => `  - ${t}`).join('\n')}
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
                tags: tagEntities,
            });
        } else {
            post.tags = tagEntities;
            post.status = 'published';
        }

        await postRepo.save(post);
        console.log('Test post with tags created');

        // Verify by fetching the page
        const res = await fetch('http://localhost:3000/blog');
        const html = await res.text();

        if (html.includes('SidebarTag1') && html.includes('SidebarTag2')) {
            console.log('SUCCESS: Tags found in sidebar');
            process.exit(0);
        } else {
            console.error('FAILURE: Tags NOT found in sidebar');
            console.log('HTML snippet:', html.substring(0, 500)); // Log start of HTML
            process.exit(1);
        }

    } catch (error) {
        console.error('Error verifying sidebar tags:', error);
        process.exit(1);
    }
}

verifySidebarTags();
