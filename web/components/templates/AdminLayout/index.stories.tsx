import type { Meta, StoryObj } from '@storybook/nextjs';
import { AdminLayout } from './index';

const meta: Meta<typeof AdminLayout> = {
    title: 'Templates/AdminLayout',
    component: AdminLayout,
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;
type Story = StoryObj<typeof AdminLayout>;

export const Default: Story = {
    args: {
        children: (
            <div className="p-4">
                <h1 className="text-2xl font-bold">Admin Content</h1>
                <p>This is the main content area of the admin layout.</p>
            </div>
        ),
    },
};
