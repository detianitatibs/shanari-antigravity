import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PostCard } from '../../../../../../components/molecules/PostCard';
import { Sidebar } from '../../../../../../components/organisms/Sidebar';
import { Pagination } from '../../../../../../components/molecules/Pagination';
import { format } from 'date-fns';
import { getAppUrl } from '../../../../../../lib/utils';

interface PageProps {
    params: Promise<{ year: string; month: string }>;
    searchParams: Promise<{ page?: string }>;
}

async function getPosts(year: string, month: string, page: number) {
    const res = await fetch(`${getAppUrl()}/api/posts?year=${year}&month=${month}&page=${page}&limit=10`, {
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch posts');
    }

    return res.json();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { year, month } = await params;
    return {
        title: `Archive: ${year}/${month} | Shanari`,
    };
}

export default async function ArchivePage({ params, searchParams }: PageProps) {
    const { year, month } = await params;
    const { page } = await searchParams;
    const currentPage = parseInt(page || '1');
    const { posts, pagination } = await getPosts(year, month, currentPage);

    if (!posts) {
        notFound();
    }

    // Create a date object to format the month name nicely
    const dateObj = new Date(parseInt(year), parseInt(month) - 1);
    const monthName = format(dateObj, 'MMMM yyyy');

    return (
        <div className="space-y-8">
            <div className="border-b border-zinc-200 pb-5">
                <h1 className="text-3xl font-bold leading-tight text-zinc-900">
                    Archive: <span className="text-indigo-600">{monthName}</span>
                </h1>
                <p className="mt-2 max-w-4xl text-sm text-zinc-500">
                    Posts published in {monthName}.
                </p>
            </div>

            <div className="flex flex-col gap-8 lg:flex-row">
                <div className="flex-1">
                    <div className="grid gap-6 sm:grid-cols-2">
                        {posts.length > 0 ? (
                            posts.map((post: any) => (
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
                            <p className="text-zinc-500">No posts found for this period.</p>
                        )}
                    </div>
                    {posts.length > 0 && (
                        <Pagination
                            currentPage={pagination.page}
                            totalPages={pagination.totalPages}
                            baseUrl={`/blog/archive/${year}/${month}`}
                        />
                    )}
                </div>
                <Sidebar />
            </div>
        </div>
    );
}
