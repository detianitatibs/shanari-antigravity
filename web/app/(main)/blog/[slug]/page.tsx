import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';

interface PageProps {
    params: Promise<{ slug: string }>;
}

async function getPost(slug: string) {
    const res = await fetch(`http://localhost:3000/api/posts/${slug}`, {
        cache: 'no-store',
    });

    if (res.status === 404) {
        return null;
    }

    if (!res.ok) {
        throw new Error('Failed to fetch post');
    }

    return res.json();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        return {
            title: 'Post Not Found',
        };
    }

    return {
        title: `${post.title} | Shanari`,
    };
}

export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        notFound();
    }

    return (
        <article className="mx-auto max-w-3xl">
            <header className="mb-8 border-b border-zinc-200 pb-8 text-center">
                <div className="mb-4 flex justify-center gap-2">
                    {post.categories.map((category: { id: number; name: string }) => (
                        <span
                            key={category.id}
                            className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-600"
                        >
                            {category.name}
                        </span>
                    ))}
                </div>
                <h1 className="mb-4 text-4xl font-bold text-zinc-900">{post.title}</h1>
                <time dateTime={post.publishedAt} className="text-zinc-500">
                    {format(new Date(post.publishedAt), 'MMMM d, yyyy')}
                </time>
            </header>

            <div className="prose prose-zinc mx-auto max-w-none">
                <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
        </article>
    );
}
