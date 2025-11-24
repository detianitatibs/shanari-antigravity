import type { Meta, StoryObj } from '@storybook/nextjs';
import { AdminSidebar } from './index';

const meta: Meta<typeof AdminSidebar> = {
    title: 'Organisms/AdminSidebar',
    component: AdminSidebar,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AdminSidebar>;

export const Default: Story = {};
