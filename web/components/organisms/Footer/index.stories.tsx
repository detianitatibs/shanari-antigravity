import type { Meta, StoryObj } from '@storybook/react';
import { Footer } from './index';

const meta: Meta<typeof Footer> = {
    title: 'Organisms/Footer',
    component: Footer,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Footer>;

export const Default: Story = {};
