import React from 'react';
import { Header } from '../../organisms/Header';
import { Footer } from '../../organisms/Footer';

interface AdminLayoutProps {
    children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    return (
        <div className="flex min-h-screen flex-col bg-zinc-100">
            <Header />
            <main className="flex-grow">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="rounded-lg bg-white p-6 shadow">
                        {children}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};
