'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/templates/AdminLayout';
import { PostForm, PostData } from '@/components/organisms/PostForm';

export default function NewPostPage() {
    const router = useRouter();

    const handleSubmit = async (data: PostData) => {
        // TODO: Get actual author ID from session/context. For now using 1 (admin).
        const payload = { ...data, authorId: 1 };

        const res = await fetch('/api/admin/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            throw new Error('Failed to create post');
        }

        router.push('/admin/posts');
    };

    return (
        <AdminLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-zinc-900">Create New Post</h1>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
                <PostForm onSubmit={handleSubmit} />
            </div>
        </AdminLayout>
    );
}
