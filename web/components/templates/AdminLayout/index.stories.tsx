import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { AdminLayout } from './index';

const meta: Meta<typeof AdminLayout> = {
    title: 'Templates/AdminLayout',
    component: AdminLayout,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;
type Story = StoryObj<typeof AdminLayout>;

export const Default: Story = {
    args: {
        children: (
            <div className="text-center">
                <h1 className="text-2xl font-bold text-zinc-900">Admin Dashboard</h1>
                <p className="mt-4 text-zinc-500">Manage your content here.</p>
            </div>
        ),
    },
};
