import { AppDataSource } from '../lib/db/data-source';
import { Post } from '../lib/db/entities/Post';
import { Category } from '../lib/db/entities/Category';
import { Tag } from '../lib/db/entities/Tag';
import { AdminUser } from '../lib/db/entities/AdminUser';
import { StorageService } from '../lib/storage';
import { format } from 'date-fns';

async function verifyFiltering() {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const categoryRepo = AppDataSource.getRepository(Category);
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

        // Create Category
        const catName = 'FilterCat';
        let category = await categoryRepo.findOne({ where: { name: catName } });
        if (!category) {
            category = categoryRepo.create({ name: catName, slug: catName.toLowerCase() });
            await categoryRepo.save(category);
        }

        // Create Tag
        const tagName = 'FilterTag';
        let tag = await tagRepo.findOne({ where: { name: tagName } });
        if (!tag) {
            tag = tagRepo.create({ name: tagName, slug: tagName.toLowerCase() });
            await tagRepo.save(tag);
        }

        // Create Post 1: With Category
        const slug1 = 'filter-cat-post';
        await createPost(slug1, 'Filter Cat Post', author, [category], [], new Date());

        // Create Post 2: With Tag
        const slug2 = 'filter-tag-post';
        await createPost(slug2, 'Filter Tag Post', author, [], [tag], new Date());

        // Create Post 3: Archive (Last Month)
        const slug3 = 'filter-archive-post';
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        await createPost(slug3, 'Filter Archive Post', author, [], [], lastMonth);

        console.log('Test posts created. Verifying filtering...');

        // Verify Category Page
        await verifyUrl(`http://localhost:3000/blog/category/${catName.toLowerCase()}`, 'Filter Cat Post');

        // Verify Tag Page
        await verifyUrl(`http://localhost:3000/blog/tag/${tagName.toLowerCase()}`, 'Filter Tag Post');

        // Verify Archive Page
        const year = format(lastMonth, 'yyyy');
        const month = format(lastMonth, 'MM');
        await verifyUrl(`http://localhost:3000/blog/archive/${year}/${month}`, 'Filter Archive Post');

        console.log('ALL TESTS PASSED');
        process.exit(0);

    } catch (error) {
        console.error('Error verifying filtering:', error);
        process.exit(1);
    }
}

async function createPost(slug: string, title: string, author: AdminUser, categories: Category[], tags: Tag[], date: Date) {
    const postRepo = AppDataSource.getRepository(Post);
    const yearMonth = format(new Date(), 'yyyy/MM');
    const filePath = `posts/${yearMonth}/${slug}.md`;

    const fileContent = `---
title: ${title}
date: ${date.toISOString()}
slug: "${slug}"
---
Content`;

    await StorageService.save(filePath, fileContent, 'text/markdown');

    let post = await postRepo.findOne({ where: { slug } });
    if (!post) {
        post = postRepo.create({
            title,
            slug,
            filePath,
            status: 'published',
            author,
            publishedAt: date,
            categories,
            tags,
        });
    } else {
        post.title = title;
        post.status = 'published';
        post.publishedAt = date;
        post.categories = categories;
        post.tags = tags;
    }
    await postRepo.save(post);
}

async function verifyUrl(url: string, expectedText: string) {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
    }
    const html = await res.text();
    if (!html.includes(expectedText)) {
        throw new Error(`Expected text "${expectedText}" not found in ${url}`);
    }
    console.log(`Verified ${url}: Found "${expectedText}"`);
}

verifyFiltering();
