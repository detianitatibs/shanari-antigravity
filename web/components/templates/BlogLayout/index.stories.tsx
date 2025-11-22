import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { BlogLayout } from './index';

const meta: Meta<typeof BlogLayout> = {
    title: 'Templates/BlogLayout',
    component: BlogLayout,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;
type Story = StoryObj<typeof BlogLayout>;

export const Default: Story = {
    args: {
        children: (
            <div className="h-96 rounded-lg border-4 border-dashed border-zinc-200 p-12 text-center">
                <p className="text-zinc-500">Blog Content goes here</p>
            </div>
        ),
    },
};
