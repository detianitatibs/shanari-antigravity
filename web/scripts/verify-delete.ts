// import { AppDataSource } from '../lib/db/data-source';
// import { Post } from '../lib/db/entities/Post';

async function verifyDelete() {
    const baseUrl = 'http://localhost:3001';

    // 1. Login
    console.log('Logging in...');
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@example.com', password: 'admin123' }),
    });

    if (!loginRes.ok) {
        throw new Error('Login failed');
    }

    const cookies = loginRes.headers.get('set-cookie');
    if (!cookies) {
        throw new Error('No cookies received');
    }
    const authToken = cookies.split(';')[0]; // Extract auth-token

    // 2. Get Posts to find target
    console.log('Fetching posts...');
    const listRes = await fetch(`${baseUrl}/api/admin/posts`, {
        headers: { Cookie: authToken },
    });
    const listData = await listRes.json();
    const targetPost = listData.posts.find((p: { slug: string; title: string; id: number }) => p.slug === '20251006_ui_test');

    if (!targetPost) {
        console.log('Target post not found, maybe already deleted?');
        return;
    }

    console.log(`Found target post: ${targetPost.title} (ID: ${targetPost.id})`);

    // 3. Delete Post
    console.log('Deleting post...');
    const deleteRes = await fetch(`${baseUrl}/api/admin/posts/${targetPost.id}`, {
        method: 'DELETE',
        headers: { Cookie: authToken },
    });

    if (!deleteRes.ok) {
        const text = await deleteRes.text();
        throw new Error(`Delete failed: ${deleteRes.status} ${text}`);
    }

    console.log('Delete successful');

    // 4. Verify deletion
    console.log('Verifying deletion...');
    const verifyRes = await fetch(`${baseUrl}/api/admin/posts`, {
        headers: { Cookie: authToken },
    });
    const verifyData = await verifyRes.json();
    const deletedPost = verifyData.posts.find((p: { id: number }) => p.id === targetPost.id);

    if (deletedPost) {
        throw new Error('Post still exists!');
    }

    console.log('Verification successful: Post is gone.');
}

verifyDelete().catch(console.error);
