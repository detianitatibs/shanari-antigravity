'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminLayout } from '../../../../components/templates/AdminLayout';
import { Button } from '../../../../components/atoms/Button';

interface Post {
    id: number;
    title: string;
    status: string;
    slug: string;
    updatedAt: string;
    author: {
        name: string;
    };
}

// interface Pagination {
//     total: number;
//     page: number;
//     limit: number;
//     totalPages: number;
// }

export default function AdminPostsPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    // const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch('/api/admin/posts');
                if (res.ok) {
                    const data = await res.json();
                    setPosts(data.posts);
                    // setPagination(data.pagination);
                }
            } catch (error) {
                console.error('Failed to fetch posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this post?')) return;

        try {
            const res = await fetch(`/api/admin/posts/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setPosts(posts.filter((post) => post.id !== id));
            } else {
                alert('Failed to delete post');
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('An error occurred');
        }
    };

    return (
        <AdminLayout>
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-zinc-900">Posts</h1>
                <Link href="/admin/posts/new">
                    <Button>Create New</Button>
                </Link>
            </div>

            <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
                <table className="min-w-full divide-y divide-zinc-200">
                    <thead className="bg-zinc-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                                Title
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                                Author
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                                Date
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-500">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 bg-white">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-center text-sm text-zinc-500">
                                    Loading...
                                </td>
                            </tr>
                        ) : posts.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-center text-sm text-zinc-500">
                                    No posts found.
                                </td>
                            </tr>
                        ) : (
                            posts.map((post) => (
                                <tr key={post.id}>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="text-sm font-medium text-zinc-900">
                                            {post.title}
                                        </div>
                                        <div className="text-sm text-zinc-500">{post.slug}</div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <span
                                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${post.status === 'published'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                                }`}
                                        >
                                            {post.status}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-500">
                                        {post.author?.name || 'Unknown'}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-500">
                                        {new Date(post.updatedAt).toLocaleDateString()}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                        <Link
                                            href={`/admin/posts/${post.id}/edit`}
                                            className="mr-4 text-indigo-600 hover:text-indigo-900"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(post.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
