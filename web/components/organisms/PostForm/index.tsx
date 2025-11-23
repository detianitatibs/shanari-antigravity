'use client';

import React, { useState } from 'react';
import { MarkdownEditor } from '../MarkdownEditor';
import Link from 'next/link';

export interface PostData {
    title: string;
    slug: string;
    content: string;
    status: 'published' | 'draft';
    categories: string[];
    description?: string;
    thumbnail?: string;
    tags?: string[];
}

interface PostFormProps {
    initialData?: PostData;
    onSubmit: (data: PostData) => Promise<void>;
    isEditing?: boolean;
}

export const PostForm: React.FC<PostFormProps> = ({
    initialData,
    onSubmit,
    isEditing = false,
}) => {
    const [title, setTitle] = useState(initialData?.title || '');
    const [slug, setSlug] = useState(initialData?.slug || '');
    const [content, setContent] = useState(initialData?.content || '');
    const [status, setStatus] = useState<'published' | 'draft'>(
        initialData?.status || 'draft'
    );
    const [categories, setCategories] = useState<string>(
        initialData?.categories?.join(', ') || ''
    );
    const [description, setDescription] = useState(initialData?.description || '');
    const [thumbnail, setThumbnail] = useState(initialData?.thumbnail || '');
    const [tags, setTags] = useState<string>(
        initialData?.tags?.join(', ') || ''
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit({
                title,
                slug,
                content,
                status,
                categories: categories.split(',').map((c) => c.trim()).filter(Boolean),
                description,
                thumbnail,
                tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
            });
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to save post');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImageUpload = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('image', file);

        const res = await fetch('/api/admin/image-upload', {
            method: 'POST',
            body: formData,
        });

        if (!res.ok) {
            throw new Error('Upload failed');
        }

        const data = await res.json();
        return data.url;
    };

    const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingThumbnail(true);
        try {
            const url = await handleImageUpload(file);
            setThumbnail(url);
        } catch (error) {
            console.error('Thumbnail upload failed:', error);
            alert('Thumbnail upload failed');
        } finally {
            setIsUploadingThumbnail(false);
            e.target.value = '';
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-700">
                        Title
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-700">
                        Slug
                    </label>
                    <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        required
                        className="block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-700">
                        Description
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm resize-none"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-700">
                        Thumbnail Image
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={thumbnail}
                            onChange={(e) => setThumbnail(e.target.value)}
                            className="block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            placeholder="https://..."
                        />
                        <label className="cursor-pointer inline-flex items-center justify-center rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50">
                            Upload
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleThumbnailUpload}
                                disabled={isUploadingThumbnail}
                            />
                        </label>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-700">
                        Status
                    </label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
                        className="block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-700">
                        Categories (comma separated)
                    </label>
                    <input
                        type="text"
                        value={categories}
                        onChange={(e) => setCategories(e.target.value)}
                        className="block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        placeholder="daily, tech"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-700">
                        Tags (comma separated)
                    </label>
                    <input
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        className="block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        placeholder="tag1, tag2"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-700">
                    Content
                </label>
                <MarkdownEditor
                    value={content}
                    onChange={setContent}
                    onImageUpload={handleImageUpload}
                />
            </div>

            <div className="flex justify-end gap-4">
                <Link
                    href="/admin/posts"
                    className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Cancel
                </Link>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                >
                    {isSubmitting ? 'Saving...' : isEditing ? 'Update Post' : 'Create Post'}
                </button>
            </div>
        </form>
    );
};
