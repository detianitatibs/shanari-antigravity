import type { Meta, StoryObj } from '@storybook/react';
import { DefaultLayout } from './index';

const meta: Meta<typeof DefaultLayout> = {
    title: 'Templates/DefaultLayout',
    component: DefaultLayout,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;
type Story = StoryObj<typeof DefaultLayout>;

export const Default: Story = {
    args: {
        children: (
            <div className="rounded-lg border-4 border-dashed border-zinc-200 p-12 text-center">
                <p className="text-zinc-500">Content goes here</p>
            </div>
        ),
    },
};
