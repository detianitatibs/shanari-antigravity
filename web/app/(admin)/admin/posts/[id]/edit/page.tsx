'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/templates/AdminLayout';
import { PostForm, PostData } from '@/components/organisms/PostForm';

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [post, setPost] = useState<PostData | null>(null);
    const [loading, setLoading] = useState(true);
    const [id, setId] = useState<string | null>(null);

    useEffect(() => {
        params.then((resolvedParams) => {
            setId(resolvedParams.id);
        });
    }, [params]);

    useEffect(() => {
        if (!id) return;

        const fetchPost = async () => {
            try {
                const res = await fetch(`/api/admin/posts/${id}`);
                if (!res.ok) throw new Error('Failed to fetch post');
                const data = await res.json();
                setPost({
                    title: data.title,
                    slug: data.slug,
                    content: data.content,
                    status: data.status,
                    categories: data.categories.map((c: { name: string }) => c.name),
                    description: data.description,
                    thumbnail: data.thumbnail,
                    tags: data.tags,
                    date: data.publishedAt,
                });
            } catch (error) {
                console.error('Error fetching post:', error);
                alert('Failed to load post');
                router.push('/admin/posts');
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id, router]);

    const handleSubmit = async (data: PostData) => {
        if (!id) return;

        // Fetch current user
        const userRes = await fetch('/api/auth/me');
        let authorId = 1; // Default fallback
        if (userRes.ok) {
            const user = await userRes.json();
            authorId = user.id;
        }

        const payload = { ...data, authorId };

        const res = await fetch(`/api/admin/posts/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            throw new Error('Failed to update post');
        }

        router.push('/admin/posts');
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="p-6 text-center">Loading...</div>
            </AdminLayout>
        );
    }

    if (!post) return null;

    return (
        <AdminLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-zinc-900">Edit Post</h1>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
                <PostForm
                    initialData={post}
                    onSubmit={handleSubmit}
                    isEditing={true}
                />
            </div>
        </AdminLayout>
    );
}
