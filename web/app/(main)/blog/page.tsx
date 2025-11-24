import { Metadata } from 'next';
import { PostCard } from '../../../components/molecules/PostCard';
import { Sidebar } from '../../../components/organisms/Sidebar';
import { Pagination } from '../../../components/molecules/Pagination';
import { notFound } from 'next/navigation';
import { getAppUrl } from '../../../lib/utils';

export const metadata: Metadata = {
    title: 'Blog | Shanari',
    description: 'Tech blog about web development and software engineering.',
};

interface PageProps {
    searchParams: Promise<{ page?: string }>;
}

async function getPosts(page: number) {
    const res = await fetch(`http://localhost:3000/api/posts?page=${page}&limit=10`, {
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch posts');
    }

    return res.json();
}

export default async function BlogPage({ searchParams }: PageProps) {
    const { page } = await searchParams;
    const currentPage = parseInt(page || '1');
    const { posts, pagination } = await getPosts(currentPage);

    return (
        <div className="space-y-8">
            <div className="border-b border-zinc-200 pb-5">
                <h1 className="text-3xl font-bold leading-tight text-zinc-900">Blog</h1>
                <p className="mt-2 max-w-4xl text-sm text-zinc-500">
                    Thoughts, tutorials, and insights on software development.
                </p>
            </div>

            <div className="flex flex-col gap-8 lg:flex-row">
                <div className="flex-1">
                    <div className="grid gap-6 sm:grid-cols-2">
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
                    <Pagination
                        currentPage={pagination.page}
                        totalPages={pagination.totalPages}
                        baseUrl="/blog"
                    />
                </div>
                <Sidebar />
            </div>
        </div>
    );
}
