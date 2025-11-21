import React from 'react';

export const Sidebar: React.FC = () => {
    return (
        <aside className="w-full space-y-8 lg:w-80">
            {/* Category Filter */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-medium text-zinc-900">Categories</h3>
                <ul className="space-y-2">
                    {['Daily', 'Game', 'Hobby', 'Sport', 'Parenting'].map((cat) => (
                        <li key={cat}>
                            <a
                                href={`/blog/category/${cat.toLowerCase()}`}
                                className="text-zinc-600 hover:text-indigo-600"
                            >
                                {cat}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Archive Filter */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-medium text-zinc-900">Archives</h3>
                <ul className="space-y-2">
                    <li>
                        <a href="#" className="text-zinc-600 hover:text-indigo-600">
                            October 2025 (5)
                        </a>
                    </li>
                    <li>
                        <a href="#" className="text-zinc-600 hover:text-indigo-600">
                            September 2025 (3)
                        </a>
                    </li>
                </ul>
            </div>
        </aside>
    );
};
