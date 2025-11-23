import type { Meta, StoryObj } from '@storybook/react';
import { PostForm } from './index';

const meta: Meta<typeof PostForm> = {
    title: 'Organisms/PostForm',
    component: PostForm,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PostForm>;

export const Default: Story = {};
