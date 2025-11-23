import React from 'react';
import { Header } from '../../organisms/Header';
import { Footer } from '../../organisms/Footer';
import { AdminSidebar } from '../../organisms/AdminSidebar';

interface AdminLayoutProps {
    children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    return (
        <div className="flex min-h-screen flex-col bg-zinc-100">
            <Header />
            <div className="flex flex-1">
                <AdminSidebar />
                <main className="flex-1 p-8">
                    <div className="mx-auto max-w-5xl">
                        {children}
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
};
