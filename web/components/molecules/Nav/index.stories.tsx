import type { Meta, StoryObj } from '@storybook/react';
import { Nav } from './index';

const meta: Meta<typeof Nav> = {
    title: 'Molecules/Nav',
    component: Nav,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Nav>;

export const Default: Story = {};
