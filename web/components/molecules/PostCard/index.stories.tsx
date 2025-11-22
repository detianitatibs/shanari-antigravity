import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PostCard } from './index';

const meta: Meta<typeof PostCard> = {
    title: 'Molecules/PostCard',
    component: PostCard,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PostCard>;

export const Default: Story = {
    args: {
        title: 'Hello World',
        slug: 'hello-world',
        publishedAt: '2025-10-05T00:00:00.000Z',
        categories: [
            { id: 1, name: 'Next.js' },
            { id: 2, name: 'React' },
        ],
    },
};
