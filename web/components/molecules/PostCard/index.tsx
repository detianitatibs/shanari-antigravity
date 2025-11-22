import React from 'react';
import Link from 'next/link';
import { format } from 'date-fns';

interface Category {
    id: number;
    name: string;
}

interface PostCardProps {
    title: string;
    slug: string;
    publishedAt: string;
    categories: Category[];
}

export const PostCard: React.FC<PostCardProps> = ({
    title,
    slug,
    publishedAt,
    categories,
}) => {
    return (
        <Link href={`/blog/${slug}`} className="group block">
            <article className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-2 flex items-center gap-2 text-sm text-zinc-500">
                    <time dateTime={publishedAt}>
                        {format(new Date(publishedAt), 'yyyy.MM.dd')}
                    </time>
                    {categories.map((category) => (
                        <span
                            key={category.id}
                            className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600"
                        >
                            {category.name}
                        </span>
                    ))}
                </div>
                <h3 className="text-xl font-bold text-zinc-900 group-hover:text-indigo-600">
                    {title}
                </h3>
            </article>
        </Link>
    );
};
