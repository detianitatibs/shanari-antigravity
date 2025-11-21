import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './index';

const meta: Meta<typeof Input> = {
    title: 'Atoms/Input',
    component: Input,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
    args: {
        placeholder: 'Enter text...',
    },
};

export const WithLabel: Story = {
    args: {
        label: 'Email',
        placeholder: 'you@example.com',
        type: 'email',
    },
};

export const WithError: Story = {
    args: {
        label: 'Password',
        type: 'password',
        value: 'wrongpassword',
        error: 'Incorrect password',
    },
};
