import React from 'react';
import { Header } from '../../organisms/Header';
import { Footer } from '../../organisms/Footer';
import { Sidebar } from '../../organisms/Sidebar';

interface BlogLayoutProps {
    children: React.ReactNode;
}

export const BlogLayout: React.FC<BlogLayoutProps> = ({ children }) => {
    return (
        <div className="flex min-h-screen flex-col bg-zinc-50">
            <Header />
            <main className="flex-grow">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-8 lg:flex-row">
                        <div className="flex-grow">{children}</div>
                        <div className="flex-shrink-0">
                            <Sidebar />
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};
