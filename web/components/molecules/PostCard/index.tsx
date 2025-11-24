import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
    thumbnail?: string;
}

export const PostCard: React.FC<PostCardProps> = ({
    title,
    slug,
    publishedAt,
    categories,
    thumbnail,
}) => {
    return (
        <Link href={`/blog/${slug}`} className="group block h-full">
            <article className="flex h-full flex-col rounded-lg border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                {thumbnail && (
                    <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-zinc-100 relative">
                        <Image
                            src={thumbnail}
                            alt={title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                    <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-zinc-500">
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
                </div>
            </article>
        </Link>
    );
};
