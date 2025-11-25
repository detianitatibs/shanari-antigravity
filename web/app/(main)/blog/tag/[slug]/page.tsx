import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PostCard } from '../../../../../components/molecules/PostCard';
import { Sidebar } from '../../../../../components/organisms/Sidebar';
import { Pagination } from '../../../../../components/molecules/Pagination';
import { getAppUrl } from '../../../../../lib/utils';

interface PageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ page?: string }>;
}

async function getPosts(tagSlug: string, page: number) {
    const res = await fetch(`${getAppUrl()}/api/posts?tag=${tagSlug}&page=${page}&limit=10`, {
        next: { revalidate: 3600 },
        cache: 'force-cache',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch posts');
    }

    return res.json();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    return {
        title: `Tag: ${decodeURIComponent(slug)} | Shanari`,
    };
}

export default async function TagPage({ params, searchParams }: PageProps) {
    const { slug } = await params;
    const { page } = await searchParams;
    const currentPage = parseInt(page || '1');
    const { posts, pagination } = await getPosts(slug, currentPage);

    if (!posts) {
        notFound();
    }

    return (
        <div className="space-y-8">
            <div className="border-b border-zinc-200 pb-5">
                <h1 className="text-3xl font-bold leading-tight text-zinc-900">
                    Tag: <span className="text-indigo-600">{decodeURIComponent(slug)}</span>
                </h1>
                <p className="mt-2 max-w-4xl text-sm text-zinc-500">
                    Posts tagged with this topic.
                </p>
            </div>

            <div className="flex flex-col gap-8 lg:flex-row">
                <div className="flex-1">
                    <div className="grid gap-6 sm:grid-cols-2">
                        {posts.length > 0 ? (
                            posts.map((post: { id: number; title: string; slug: string; publishedAt: string; categories: { id: number; name: string }[]; thumbnail: string }) => (
                                <PostCard
                                    key={post.id}
                                    title={post.title}
                                    slug={post.slug}
                                    publishedAt={post.publishedAt}
                                    categories={post.categories}
                                    thumbnail={post.thumbnail}
                                />
                            ))
                        ) : (
                            <p className="text-zinc-500">No posts found with this tag.</p>
                        )}
                    </div>
                    {posts.length > 0 && (
                        <Pagination
                            currentPage={pagination.page}
                            totalPages={pagination.totalPages}
                            baseUrl={`/blog/tag/${slug}`}
                        />
                    )}
                </div>
                <Sidebar />
            </div>
        </div>
    );
}
