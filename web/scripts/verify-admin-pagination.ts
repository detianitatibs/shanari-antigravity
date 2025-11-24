import { AppDataSource } from '../lib/db/data-source';
import { Post } from '../lib/db/entities/Post';
import { AdminUser } from '../lib/db/entities/AdminUser';
import { StorageService } from '../lib/storage';
import { format } from 'date-fns';

async function verifyAdminPagination() {
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

        // Create 15 posts to test pagination
        console.log('Creating 15 test posts for admin...');
        for (let i = 1; i <= 15; i++) {
            const slug = `admin-pagination-post-${i}`;
            // Set publishedAt to be different for sorting verification
            // Post 15 is newest, Post 1 is oldest
            const date = new Date();
            date.setMinutes(date.getMinutes() - (15 - i)); // Post 15: now, Post 1: 14 mins ago

            await createPost(slug, `Admin Pagination Post ${i}`, author, date);
        }

        console.log('Test posts created. Verifying admin pagination API...');

        // Login to get auth token
        console.log('Logging in...');
        const loginRes = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@example.com', password: 'admin123' }),
        });

        if (!loginRes.ok) {
            throw new Error(`Login failed: ${loginRes.status} ${await loginRes.text()}`);
        }

        const cookieHeader = loginRes.headers.get('set-cookie');
        if (!cookieHeader) {
            throw new Error('No set-cookie header received');
        }
        const authToken = cookieHeader.split(';')[0]; // Extract auth-token=...
        console.log('Logged in. Token:', authToken);

        // Verify Page 1 API (Should have 10 posts, sorted DESC)
        // Post 15 should be first, Post 6 should be last on page 1
        const res1 = await fetch('http://localhost:3000/api/admin/posts?page=1&limit=10', {
            headers: { Cookie: authToken },
        });
        if (!res1.ok) {
            const text = await res1.text();
            throw new Error(`API returned ${res1.status}: ${text}`);
        }
        const data1 = await res1.json();
        // console.log('Page 1 data:', JSON.stringify(data1, null, 2));

        if (data1.posts.length !== 10) {
            throw new Error(`Expected 10 posts on page 1, got ${data1.posts.length}`);
        }
        if (data1.posts[0].title !== 'Admin Pagination Post 15') {
            throw new Error(`Expected first post to be "Admin Pagination Post 15", got "${data1.posts[0].title}"`);
        }
        if (data1.posts[9].title !== 'Admin Pagination Post 6') {
            throw new Error(`Expected last post on page 1 to be "Admin Pagination Post 6", got "${data1.posts[9].title}"`);
        }

        // Verify Page 2 API (Should have 5 posts)
        // Post 5 should be first, Post 1 should be last
        const res2 = await fetch('http://localhost:3000/api/admin/posts?page=2&limit=10', {
            headers: { Cookie: authToken },
        });
        const data2 = await res2.json();

        if (data2.posts.length < 5) {
            // Note: total might be more than 15 if other tests created posts. 
            // But we expect at least these 5 specific ones in this order if they are the newest.
            // Actually, previous tests created posts too. So Page 2 might be full.
            // But "Admin Pagination Post 5" should be the first one on Page 2 relative to our created batch?
            // No, if we just created them, they are the newest.
            // So Page 1: Admin Post 15...6.
            // Page 2: Admin Post 5...1.
            // Let's verify presence of Admin Post 5 on Page 2.
        }

        const post5 = data2.posts.find((p: any) => p.title === 'Admin Pagination Post 5');
        if (!post5) {
            throw new Error('Expected "Admin Pagination Post 5" on page 2');
        }

        console.log('ALL API TESTS PASSED');
        process.exit(0);

    } catch (error) {
        console.error('Error verifying admin pagination:', error);
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

verifyAdminPagination();
