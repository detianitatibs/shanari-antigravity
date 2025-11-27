import React from 'react';
import Link from 'next/link';

interface LinkItem {
    href: string;
    label: string;
}

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    links: LinkItem[];
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, links }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-40 md:hidden">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Menu Content */}
            <div className="fixed right-0 top-0 h-full w-64 bg-white shadow-xl p-6 transform transition-transform duration-300 ease-in-out">
                <nav className="flex flex-col space-y-4 mt-16">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-lg font-medium text-zinc-700 hover:text-zinc-900 py-2 border-b border-zinc-100"
                            onClick={onClose}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    );
};
