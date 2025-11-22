import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BlogPage from '../../app/(main)/blog/page';

// Mock fetch
global.fetch = vi.fn();

// Mock PostCard component since we tested it separately
vi.mock('../../components/molecules/PostCard', () => ({
    PostCard: ({ title }: { title: string }) => <div data-testid="post-card">{title}</div>,
}));

describe('BlogPage', () => {
    it('renders a list of posts', async () => {
        const mockPosts = [
            {
                id: 1,
                title: 'Post 1',
                slug: 'post-1',
                publishedAt: '2025-10-01',
                categories: [],
            },
            {
                id: 2,
                title: 'Post 2',
                slug: 'post-2',
                publishedAt: '2025-10-02',
                categories: [],
            },
        ];

        (global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
            ok: true,
            json: async () => mockPosts,
        });

        const page = await BlogPage();
        render(page);

        expect(screen.getByText('Blog')).toBeDefined();
        expect(screen.getAllByTestId('post-card')).toHaveLength(2);
        expect(screen.getByText('Post 1')).toBeDefined();
        expect(screen.getByText('Post 2')).toBeDefined();
    });
});
