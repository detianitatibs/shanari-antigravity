import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import { Icon } from '../../../../components/atoms/Icon';
import { TableOfContents } from '../../../../components/molecules/TableOfContents';
import { extractHeadings } from '../../../../lib/utils/markdown';
import { PostService } from '../../../../lib/db/services/post';
import { RelatedPosts } from '../../../../components/organisms/RelatedPosts';
import { MarkdownImage } from '../../../../components/atoms/MarkdownImage';
import { format } from 'date-fns';
import matter from 'gray-matter';
import { getAppUrl } from '../../../../lib/utils';

interface PageProps {
    params: Promise<{ slug: string }>;
}

async function getPost(slug: string) {
    const post = await PostService.getPostWithContent(slug);

    if (!post) {
        return null;
    }

    return post;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        return {
            title: 'Post Not Found',
        };
    }

    const thumbnail = post.thumbnail
        ? post.thumbnail.startsWith('http')
            ? post.thumbnail
            : `${getAppUrl()}${post.thumbnail}`
        : null;

    return {
        title: `${post.title} | Shanari`,
        description: matter(post.content).data.description,
        openGraph: {
            title: post.title,
            description: matter(post.content).data.description,
            images: thumbnail ? [thumbnail] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: matter(post.content).data.description,
            images: thumbnail ? [thumbnail] : [],
        },
    };
}

export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        notFound();
    }

    const relatedPosts = await PostService.getRelatedPosts(post);

    const { content, data } = matter(post.content);
    const headings = extractHeadings(content);

    const shareUrl = `${getAppUrl()}/blog/${post.slug}`;
    const shareText = post.title;
    const shareHashtags = post.tags?.map((t: { name: string }) => t.name).join(',') || '';
    const twitterShareUrl = `https://x.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}&hashtags=${encodeURIComponent(shareHashtags)}`;

    return (
        <article className="mx-auto max-w-3xl">
            <header className="mb-8 border-b border-zinc-200 pb-8 text-center">
                <div className="mb-4 flex flex-wrap justify-center gap-2">
                    {post.categories.map((category: { id: number; name: string }) => (
                        <span
                            key={`cat-${category.id}`}
                            className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800"
                        >
                            {category.name}
                        </span>
                    ))}
                    {post.tags?.map((tag: { id: number; name: string }) => (
                        <span
                            key={`tag-${tag.id}`}
                            className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-600"
                        >
                            #{tag.name}
                        </span>
                    ))}
                </div>
                <h1 className="mb-2 text-4xl font-bold text-zinc-900">{post.title}</h1>
                {data.description && (
                    <p className="mb-4 text-lg text-zinc-600">{data.description}</p>
                )}
                <div className="flex flex-col items-center gap-4">
                    <time dateTime={post.publishedAt instanceof Date ? post.publishedAt.toISOString() : post.publishedAt} className="text-zinc-500">
                        {format(new Date(post.publishedAt), 'MMMM d, yyyy')}
                    </time>
                    <a
                        href={twitterShareUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-80"
                    >
                        <Icon name="twitter-x" className="h-4 w-4" />
                    </a>
                </div>
            </header>

            <TableOfContents headings={headings} />

            <div className="prose prose-zinc mx-auto max-w-none">
                <ReactMarkdown
                    rehypePlugins={[rehypeRaw, rehypeSlug]}
                    remarkPlugins={[remarkGfm]}
                    components={{
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        img: ({ node: _, src, alt, ...rest }: any) => <MarkdownImage src={src as string} alt={alt as string} {...rest} />
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>

            <RelatedPosts posts={relatedPosts} />
        </article>
    );
}
