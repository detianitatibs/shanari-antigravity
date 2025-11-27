'use client';

import React, { useState } from 'react';
import { Logo } from '../../atoms/Logo';
import { Nav } from '../../molecules/Nav';
import { HamburgerButton } from '../../atoms/HamburgerButton';
import { MobileMenu } from '../../molecules/MobileMenu';
import Image from 'next/image';

export const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { href: '/profile', label: 'Profile' },
        { href: '/blog', label: 'Blog' },
    ];
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
                        <a
                            href="https://x.com/itatibs"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block h-8 w-8 relative rounded-full overflow-hidden hover:opacity-80 transition-opacity"
                            aria-label="X (Twitter) Profile"
                        >
                            <Image
                                src="/itatibs.JPEG"
                                alt="Profile"
                                fill
                                className="object-cover"
                            />
                        </a>
                        <div className="md:hidden z-50">
                            <HamburgerButton
                                isOpen={isMenuOpen}
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <MobileMenu
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                links={navLinks}
            />
        </header>
    );
};
