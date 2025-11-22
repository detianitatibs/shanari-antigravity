import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Header } from './index';

const meta: Meta<typeof Header> = {
    title: 'Organisms/Header',
    component: Header,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {};
