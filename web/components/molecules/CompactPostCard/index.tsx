import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';

interface Category {
    id: number;
    name: string;
}

interface CompactPostCardProps {
    title: string;
    slug: string;
    publishedAt: string;
    categories: Category[];
    thumbnail?: string;
}

export const CompactPostCard: React.FC<CompactPostCardProps> = ({
    title,
    slug,
    publishedAt,
    thumbnail,
}) => {
    return (
        <Link href={`/blog/${slug}`} className="group block h-full">
            <article className="flex h-full flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800">
                {thumbnail && (
                    <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-700">
                        <Image
                            src={thumbnail}
                            alt={title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </div>
                )}
                <div className="flex flex-1 flex-col p-4">
                    <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                        <time dateTime={publishedAt}>
                            {format(new Date(publishedAt), 'yyyy.MM.dd')}
                        </time>
                    </div>
                    <h3 className="line-clamp-2 text-sm font-bold text-zinc-900 transition-colors group-hover:text-indigo-600 dark:text-zinc-100 dark:group-hover:text-indigo-400">
                        {title}
                    </h3>
                </div>
            </article>
        </Link>
    );
};
