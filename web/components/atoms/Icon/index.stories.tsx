import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from './index';

const meta: Meta<typeof Icon> = {
    title: 'Atoms/Icon',
    component: Icon,
    tags: ['autodocs'],
    argTypes: {
        name: {
            control: { type: 'select' },
            options: ['menu', 'x', 'user', 'search'],
        },
    },
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const Menu: Story = {
    args: {
        name: 'menu',
    },
};

export const User: Story = {
    args: {
        name: 'user',
        size: 32,
        className: 'text-indigo-500',
    },
};
