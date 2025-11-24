import React from 'react';
import Link from 'next/link';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    baseUrl: string;
}

export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    baseUrl,
}) => {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="mt-12 flex justify-center">
            <nav className="flex items-center gap-2">
                {/* Previous Button */}
                {currentPage > 1 ? (
                    <Link
                        href={`${baseUrl}?page=${currentPage - 1}`}
                        className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                    >
                        Previous
                    </Link>
                ) : (
                    <span className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-300">
                        Previous
                    </span>
                )}

                {/* Page Numbers */}
                <div className="hidden sm:flex sm:gap-2">
                    {pages.map((page) => (
                        <Link
                            key={page}
                            href={`${baseUrl}?page=${page}`}
                            className={`rounded-lg px-4 py-2 text-sm font-medium ${currentPage === page
                                ? 'bg-indigo-600 text-white'
                                : 'border border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                                }`}
                        >
                            {page}
                        </Link>
                    ))}
                </div>

                {/* Next Button */}
                {currentPage < totalPages ? (
                    <Link
                        href={`${baseUrl}?page=${currentPage + 1}`}
                        className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                    >
                        Next
                    </Link>
                ) : (
                    <span className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-300">
                        Next
                    </span>
                )}
            </nav>
        </div>
    );
};
