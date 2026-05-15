'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../Icon';

interface MarkdownImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src?: string;
    alt?: string;
}

export const MarkdownImage: React.FC<MarkdownImageProps> = ({ src, alt, ...props }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!src) return null;

    return (
        <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={src}
                alt={alt}
                {...props}
                className={`cursor-pointer transition-opacity hover:opacity-90 ${props.className || ''}`}
                onClick={() => setIsOpen(true)}
            />

            {mounted && isOpen && createPortal(
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
                    onClick={() => setIsOpen(false)}
                >
                    <button
                        className="absolute right-4 top-4 text-white hover:text-gray-300 z-50"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen(false);
                        }}
                        aria-label="Close"
                    >
                        <Icon name="x" className="h-8 w-8" />
                    </button>
                    <div className="relative flex max-h-full max-w-full items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={src}
                            alt={alt}
                            className="max-h-[90vh] max-w-[90vw] object-contain"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};
