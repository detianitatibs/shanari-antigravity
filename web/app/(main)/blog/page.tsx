import { Metadata } from 'next';
import { PostCard } from '../../../components/molecules/PostCard';

export const metadata: Metadata = {
    title: 'Blog | Shanari',
    description: 'Tech blog about web development and software engineering.',
};

async function getPosts() {
    // In server component, we can call the API directly or use fetch
    // Since we are in the same app, we should use absolute URL or call logic directly
    // For simplicity and consistency with "API Read", let's use fetch with absolute URL
    // In production, this should be the internal URL or service call
    const res = await fetch('http://localhost:3000/api/posts', {
        cache: 'no-store', // For now, always fetch fresh data
    });

    if (!res.ok) {
        throw new Error('Failed to fetch posts');
    }

    return res.json();
}

export default async function BlogPage() {
    const posts = await getPosts();

    return (
        <div className="space-y-8">
            <div className="border-b border-zinc-200 pb-5">
                <h1 className="text-3xl font-bold leading-tight text-zinc-900">Blog</h1>
                <p className="mt-2 max-w-4xl text-sm text-zinc-500">
                    Thoughts, tutorials, and insights on software development.
                </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post: { id: number; title: string; slug: string; publishedAt: string; categories: { id: number; name: string }[]; thumbnail: string }) => (
                    <PostCard
                        key={post.id}
                        title={post.title}
                        slug={post.slug}
                        publishedAt={post.publishedAt}
                        categories={post.categories}
                        thumbnail={post.thumbnail}
                    />
                ))}
            </div>
        </div>
    );
}
