import React from 'react';
import { Logo } from '../../atoms/Logo';
import { Nav } from '../../molecules/Nav';
import { Icon } from '../../atoms/Icon';
import Link from 'next/link';

export const Header: React.FC = () => {
    return (
        <header className="bg-white border-b border-zinc-200 sticky top-0 z-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Logo />
                        <div className="hidden md:block">
                            <Nav />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/profile"
                            className="p-2 text-zinc-500 hover:text-zinc-700"
                            aria-label="Profile"
                        >
                            <Icon name="user" className="h-6 w-6" />
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};
