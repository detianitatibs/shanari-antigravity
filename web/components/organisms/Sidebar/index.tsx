import React from 'react';
import { AppDataSource } from '../../../lib/db/data-source';
import { Category } from '../../../lib/db/entities/Category';
import { Tag } from '../../../lib/db/entities/Tag';
import { Post } from '../../../lib/db/entities/Post';

async function getData() {
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }

    const categoryRepo = AppDataSource.getRepository(Category);
    const tagRepo = AppDataSource.getRepository(Tag);
    const postRepo = AppDataSource.getRepository(Post);

    const categories = await categoryRepo.find({ order: { name: 'ASC' } });
    const tags = await tagRepo.find({ order: { name: 'ASC' } });

    // Fetch archives (group by year/month)
    // SQLite specific date formatting
    const archives = await postRepo
        .createQueryBuilder('post')
        .select("strftime('%Y', post.publishedAt)", 'year')
        .addSelect("strftime('%m', post.publishedAt)", 'month')
        .addSelect('COUNT(*)', 'count')
        .where("post.status = 'published'")
        .groupBy('year, month')
        .orderBy('year', 'DESC')
        .addOrderBy('month', 'DESC')
        .getRawMany();

    return { categories, tags, archives };
}

export const Sidebar: React.FC = async () => {
    const { categories, tags, archives } = await getData();

    return (
        <aside className="w-full space-y-8 lg:w-80">
            {/* Category Filter */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-medium text-zinc-900">Categories</h3>
                <ul className="space-y-2">
                    {categories.map((cat) => (
                        <li key={cat.id}>
                            <a
                                href={`/blog/category/${cat.slug}`}
                                className="text-zinc-600 hover:text-indigo-600"
                            >
                                {cat.name}
                            </a>
                        </li>
                    ))}
                    {categories.length === 0 && (
                        <li className="text-zinc-400 text-sm">No categories yet.</li>
                    )}
                </ul>
            </div>

            {/* Tag Filter */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-medium text-zinc-900">Tags</h3>
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <a
                            key={tag.id}
                            href={`/blog/tag/${tag.slug}`}
                            className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-600 hover:bg-zinc-200"
                        >
                            {tag.name}
                        </a>
                    ))}
                    {tags.length === 0 && (
                        <span className="text-zinc-400 text-sm">No tags yet.</span>
                    )}
                </div>
            </div>

            {/* Archive Filter */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-medium text-zinc-900">Archives</h3>
                <ul className="space-y-2">
                    {archives.map((archive: any) => {
                        // Format month name (e.g. "01" -> "January")
                        const date = new Date(parseInt(archive.year), parseInt(archive.month) - 1);
                        const monthName = date.toLocaleString('en-US', { month: 'long' });

                        return (
                            <li key={`${archive.year}-${archive.month}`}>
                                <a
                                    href={`/blog/archive/${archive.year}/${archive.month}`}
                                    className="text-zinc-600 hover:text-indigo-600"
                                >
                                    {monthName} {archive.year} ({archive.count})
                                </a>
                            </li>
                        );
                    })}
                    {archives.length === 0 && (
                        <li className="text-zinc-400 text-sm">No archives yet.</li>
                    )}
                </ul>
            </div>
        </aside>
    );
};
