import type { Meta, StoryObj } from '@storybook/nextjs';
import { Sidebar } from './index';

const meta: Meta<typeof Sidebar> = {
    title: 'Organisms/Sidebar',
    component: Sidebar,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {};
