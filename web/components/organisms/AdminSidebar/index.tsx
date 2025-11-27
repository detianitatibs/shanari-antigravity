'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { signOut } from 'next-auth/react';

interface AdminSidebarProps {
    className?: string;
    onClose?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ className = '', onClose }) => {
    const pathname = usePathname() || '';

    const navItems = [
        { name: 'Dashboard', href: '/admin/dashboard' },
        { name: 'Posts', href: '/admin/posts' },
    ];

    return (
        <aside className={`w-64 bg-white shadow-sm flex flex-col h-full ${className}`}>
            <nav className="p-4 space-y-1 flex-1">
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={onClose}
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
            <div className="p-4 border-t border-zinc-200">
                <button
                    onClick={() => signOut({ callbackUrl: '/admin/login' })}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                    Sign Out
                </button>
            </div>
        </aside>
    );
};
