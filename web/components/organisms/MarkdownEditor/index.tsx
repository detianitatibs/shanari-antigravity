'use client';

import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    onImageUpload: (file: File) => Promise<string>;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
    value,
    onChange,
    onImageUpload,
}) => {
    const [isUploading, setIsUploading] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const url = await onImageUpload(file);
            insertText(`![${file.name}](${url})`);
        } catch (error) {
            console.error('Image upload failed:', error);
            alert('Image upload failed');
        } finally {
            setIsUploading(false);
            // Reset input
            e.target.value = '';
        }
    };

    const insertText = (text: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newValue =
            value.substring(0, start) + text + value.substring(end);

        onChange(newValue);

        // Restore focus and cursor position
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + text.length, start + text.length);
        }, 0);
    };

    return (
        <div className="grid h-[600px] grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col rounded-lg border border-zinc-200 bg-white shadow-sm">
                <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-2 flex items-center gap-2">
                    <span className="text-sm font-medium text-zinc-700">Editor</span>
                    <div className="ml-auto flex items-center gap-2">
                        <label className="cursor-pointer rounded p-1 hover:bg-zinc-200">
                            <span className="text-xs">📷 Image</span>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={isUploading}
                            />
                        </label>
                    </div>
                </div>
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="flex-1 resize-none p-4 focus:outline-none font-mono text-sm"
                    placeholder="Write your markdown here..."
                />
            </div>

            <div className="flex flex-col rounded-lg border border-zinc-200 bg-white shadow-sm overflow-hidden">
                <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-2">
                    <span className="text-sm font-medium text-zinc-700">Preview</span>
                </div>
                <div className="flex-1 overflow-y-auto p-4 prose prose-zinc max-w-none dark:prose-invert">
                    <ReactMarkdown
                        rehypePlugins={[rehypeRaw]}
                        remarkPlugins={[remarkGfm]}
                        components={{
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            code({ inline, className, children, ...props }: any) {
                                const match = /language-(\w+)/.exec(className || '');
                                return !inline && match ? (
                                    <SyntaxHighlighter
                                        style={vscDarkPlus}
                                        language={match[1]}
                                        PreTag="div"
                                        {...props}
                                    >
                                        {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                ) : (
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                );
                            },
                        }}
                    >
                        {value}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    );
};
