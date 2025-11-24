import { AppDataSource } from '../lib/db/data-source';
import { Post } from '../lib/db/entities/Post';
import { AdminUser } from '../lib/db/entities/AdminUser';
import { StorageService } from '../lib/storage';
import { format } from 'date-fns';

async function verifyPagination() {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

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

        // Create 15 posts to test pagination (limit is 10)
        console.log('Creating 15 test posts...');
        for (let i = 1; i <= 15; i++) {
            const slug = `pagination-post-${i}`;
            await createPost(slug, `Pagination Post ${i}`, author, new Date());
        }

        // Get total pages first
        const apiRes = await fetch('http://localhost:3000/api/posts?page=1&limit=10');
        const apiData = await apiRes.json();
        const totalPages = apiData.pagination.totalPages;
        console.log(`Total pages: ${totalPages}`);

        if (totalPages < 2) {
            throw new Error('Not enough posts to test pagination. Need at least 11 posts.');
        }

        // Verify Page 1
        console.log('Verifying Page 1...');
        await verifyUrl('http://localhost:3000/blog?page=1', 'Next', true);
        await verifyUrl('http://localhost:3000/blog?page=1', 'Previous', false);

        // Verify Last Page
        console.log(`Verifying Page ${totalPages} (Last Page)...`);
        await verifyUrl(`http://localhost:3000/blog?page=${totalPages}`, 'Next', false);
        await verifyUrl(`http://localhost:3000/blog?page=${totalPages}`, 'Previous', true);

        // Verify Middle Page (if exists)
        if (totalPages > 2) {
            console.log('Verifying Page 2...');
            await verifyUrl('http://localhost:3000/blog?page=2', 'Next', true);
            await verifyUrl('http://localhost:3000/blog?page=2', 'Previous', true);
        }

        console.log('ALL TESTS PASSED');
        process.exit(0);

    } catch (error) {
        console.error('Error verifying pagination:', error);
        process.exit(1);
    }
}

async function createPost(slug: string, title: string, author: AdminUser, date: Date) {
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
            categories: [],
            tags: [],
        });
    } else {
        post.title = title;
        post.status = 'published';
        post.publishedAt = date;
    }
    await postRepo.save(post);
}

async function verifyUrl(url: string, expectedText: string, shouldExist: boolean) {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
    }
    const html = await res.text();

    // For Previous/Next, we want to check if they are LINKS or just SPANS.
    // If expectedText is "Previous" or "Next", we refine the check.
    let exists = html.includes(expectedText);

    if (expectedText === 'Previous') {
        // Check if it's an active link
        exists = html.includes('>Previous</a>');
    } else if (expectedText === 'Next') {
        exists = html.includes('>Next</a>');
    }

    if (shouldExist && !exists) {
        throw new Error(`Expected "${expectedText}" link not found in ${url}`);
    }
    if (!shouldExist && exists) {
        throw new Error(`Unexpected "${expectedText}" link found in ${url}`);
    }
    console.log(`Verified ${url}: "${expectedText}" link is ${exists ? 'present' : 'absent'} as expected`);
}

verifyPagination();
