import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-white border-t border-zinc-200">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <p className="text-center text-sm text-zinc-500">
                    &copy; {new Date().getFullYear()} Shanari. All rights reserved.
                </p>
            </div>
        </footer>
    );
};
