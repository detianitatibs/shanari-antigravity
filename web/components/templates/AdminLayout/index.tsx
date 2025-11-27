'use client';

import React, { useState } from 'react';
import { Header } from '../../organisms/Header';
import { Footer } from '../../organisms/Footer';
import { AdminSidebar } from '../../organisms/AdminSidebar';

interface AdminLayoutProps {
    children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen flex-col bg-zinc-100">
            <Header />

            {/* Mobile Sidebar Toggle */}
            <div className="md:hidden bg-white border-b border-zinc-200 p-4 flex items-center justify-between">
                <span className="font-semibold text-zinc-700">Admin Menu</span>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 rounded-md text-zinc-600 hover:bg-zinc-100"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isSidebarOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            <div className="flex flex-1 relative">
                {/* Desktop Sidebar */}
                <div className="hidden md:block h-full">
                    <AdminSidebar />
                </div>

                {/* Mobile Sidebar Overlay */}
                {isSidebarOpen && (
                    <div className="absolute inset-0 z-40 md:hidden">
                        <div
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={() => setIsSidebarOpen(false)}
                        />
                        <div className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl z-50">
                            <AdminSidebar onClose={() => setIsSidebarOpen(false)} />
                        </div>
                    </div>
                )}

                <main className="flex-1 p-4 md:p-8 w-full overflow-x-hidden">
                    <div className="mx-auto max-w-5xl">
                        {children}
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
};
