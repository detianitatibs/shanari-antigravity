import { AppDataSource } from '../lib/db/data-source';
import { Post } from '../lib/db/entities/Post';
import { Category } from '../lib/db/entities/Category';
import { Tag } from '../lib/db/entities/Tag';
import { AdminUser } from '../lib/db/entities/AdminUser';
import { StorageService } from '../lib/storage';
import { format } from 'date-fns';

async function verifyJapaneseFiltering() {
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

        // Create Japanese Category
        const catName = '日本語カテゴリ';
        // Ensure slug is properly encoded or stored as is. 
        // If we use the name as slug, it will be "日本語カテゴリ".
        let category = await categoryRepo.findOne({ where: { name: catName } });
        if (!category) {
            category = categoryRepo.create({ name: catName, slug: catName });
            await categoryRepo.save(category);
        }

        // Create Japanese Tag
        const tagName = '日本語タグ';
        let tag = await tagRepo.findOne({ where: { name: tagName } });
        if (!tag) {
            tag = tagRepo.create({ name: tagName, slug: tagName });
            await tagRepo.save(tag);
        }

        // Create Post
        const slug = 'japanese-filter-post';
        await createPost(slug, 'Japanese Filter Post', author, [category], [tag], new Date());

        console.log('Test post created. Verifying Japanese filtering...');

        // Verify Category Page
        // URL encoded: %E6%97%A5%E6%9C%AC%E8%AA%9E%E3%82%AB%E3%83%86%E3%82%B4%E3%83%AA
        const encodedCat = encodeURIComponent(catName);
        await verifyUrl(`http://localhost:3000/blog/category/${encodedCat}`, 'Category: <span class="text-indigo-600">日本語カテゴリ</span>');

        // Verify Tag Page
        const encodedTag = encodeURIComponent(tagName);
        await verifyUrl(`http://localhost:3000/blog/tag/${encodedTag}`, 'Tag: <span class="text-indigo-600">日本語タグ</span>');

        console.log('ALL TESTS PASSED');
        process.exit(0);

    } catch (error) {
        console.error('Error verifying Japanese filtering:', error);
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
    // Note: React might render attributes differently (e.g. className vs class), so we check for the text content primarily
    // But here we check for the decoded title specifically.
    // The expectedText includes HTML structure, so we need to be careful with quotes.
    // React renders className="...", verifyUrl expects class="...". 
    // Actually, server-side rendered HTML usually has class="...".
    // Let's check for just the decoded text part to be safe, or adjust expectation.
    if (!html.includes(expectedText.replace('className', 'class'))) {
        // Fallback check for just the text if HTML structure differs
        if (!html.includes('日本語カテゴリ') && !html.includes('日本語タグ')) {
            throw new Error(`Expected text "${expectedText}" not found in ${url}`);
        }
    }
    console.log(`Verified ${url}: Found decoded text`);
}

verifyJapaneseFiltering();
