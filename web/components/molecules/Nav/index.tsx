import React from 'react';
import Link from 'next/link';

export const Nav: React.FC = () => {
    const links = [
        { href: '/profile', label: 'Profile' },
        { href: '/blog', label: 'Blog' },
        { href: '/pokemon-damage-calculation', label: 'PokémonDamageCalc' },
    ];

    return (
        <nav className="flex gap-6">
            {links.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm font-medium text-zinc-700 hover:text-zinc-900"
                >
                    {link.label}
                </Link>
            ))}
        </nav>
    );
};
