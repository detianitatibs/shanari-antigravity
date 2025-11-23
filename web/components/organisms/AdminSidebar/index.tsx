'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const AdminSidebar: React.FC = () => {
    const pathname = usePathname() || '';

    const navItems = [
        { name: 'Dashboard', href: '/admin/dashboard' },
        { name: 'Posts', href: '/admin/posts' },
    ];

    return (
        <aside className="w-64 bg-white shadow-sm hidden md:block">
            <nav className="p-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`block px-4 py-2 rounded-md text-sm font-medium ${isActive
                                ? 'bg-indigo-50 text-indigo-700'
                                : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                                }`}
                        >
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
};
