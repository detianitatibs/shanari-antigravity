import { render, screen } from '@testing-library/react';
import { PostCard } from '../../../components/molecules/PostCard';
import { describe, it, expect } from 'vitest';

describe('PostCard', () => {
    const mockPost = {
        title: 'Test Post',
        slug: 'test-post',
        publishedAt: '2025-10-05T00:00:00.000Z',
        categories: [
            { id: 1, name: 'React' },
            { id: 2, name: 'Next.js' },
        ],
    };

    it('renders post information correctly', () => {
        render(<PostCard {...mockPost} />);

        expect(screen.getByText('Test Post')).toBeDefined();
        expect(screen.getByText('2025.10.05')).toBeDefined();
        expect(screen.getByText('React')).toBeDefined();
        expect(screen.getByText('Next.js')).toBeDefined();

        const link = screen.getByRole('link');
        expect(link.getAttribute('href')).toBe('/blog/test-post');
    });
});
