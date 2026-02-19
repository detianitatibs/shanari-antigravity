import React from 'react';
import { CompactPostCard } from '../../molecules/CompactPostCard';

interface Category {
    id: number;
    name: string;
}

interface Post {
    id: number;
    title: string;
    slug: string;
    publishedAt: string | Date;
    categories: Category[];
    thumbnail?: string;
}

interface RelatedPostsProps {
    posts: Post[];
}

export const RelatedPosts: React.FC<RelatedPostsProps> = ({ posts }) => {
    if (!posts || posts.length === 0) {
        return null;
    }

    return (
        <section className="mt-16 border-t border-zinc-200 pt-16 dark:border-zinc-700">
            <h2 className="mb-6 text-xl font-bold text-zinc-900 dark:text-zinc-100">
                関連記事
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                    <CompactPostCard
                        key={post.id}
                        slug={post.slug}
                        title={post.title}
                        publishedAt={post.publishedAt instanceof Date ? post.publishedAt.toISOString() : post.publishedAt}
                        categories={post.categories}
                        thumbnail={post.thumbnail}
                    />
                ))}
            </div>
        </section>
    );
};
