'use client';

import { useEffect, useState } from 'react';
import type { Heading } from '../../lib/utils/markdown';

interface TableOfContentsProps {
    headings: Heading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '-100px 0px -40% 0px' }
        );

        headings.forEach((heading) => {
            const element = document.getElementById(heading.id);
            if (element) {
                observer.observe(element);
            }
        });

        return () => observer.disconnect();
    }, [headings]);

    if (headings.length === 0) {
        return null;
    }

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            // Update URL hash without jumping
            history.pushState(null, '', `#${id}`);
            setActiveId(id);
        }
    };

    return (
        <nav className="mb-8 rounded-lg bg-zinc-50 p-6 shadow-sm dark:bg-zinc-800/50">
            <h2 className="mb-4 text-lg font-bold text-zinc-900 dark:text-zinc-100">
                目次
            </h2>
            <ul className="space-y-2">
                {headings.map((heading) => (
                    <li
                        key={heading.id}
                        className={`${heading.level === 1 ? 'ml-0' : 'ml-4'
                            }`}
                    >
                        <a
                            href={`#${heading.id}`}
                            onClick={(e) => handleClick(e, heading.id)}
                            className={`block text-sm transition-colors duration-200 hover:text-indigo-600 dark:hover:text-indigo-400 ${activeId === heading.id
                                ? 'font-medium text-indigo-600 dark:text-indigo-400'
                                : 'text-zinc-600 dark:text-zinc-400'
                                }`}
                        >
                            {heading.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
