import React from 'react';
import Link from 'next/link';

interface LogoProps {
    className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = '' }) => {
    return (
        <Link
            href="/"
            className={`text-xl font-bold tracking-tight text-zinc-900 hover:text-zinc-700 ${className}`}
        >
            Shanari
        </Link>
    );
};
