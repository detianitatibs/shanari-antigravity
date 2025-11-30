import React from 'react';
import { Header } from '../../organisms/Header';
import { Footer } from '../../organisms/Footer';

interface DefaultLayoutProps {
    children: React.ReactNode;
}

export const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
    return (
        <div className="flex min-h-screen flex-col bg-zinc-50">
            <Header />
            <main className="flex-grow">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
            <Footer />
        </div>
    );
};
