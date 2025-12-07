import { Meta, StoryObj } from '@storybook/nextjs';
import { TypeEffectivenessSelector } from './index';

const meta: Meta<typeof TypeEffectivenessSelector> = {
    title: 'Molecules/TypeEffectivenessSelector',
    component: TypeEffectivenessSelector,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TypeEffectivenessSelector>;

export const Default: Story = {
    args: {
        label: 'Type Effectiveness',
        value: 1,
    },
};

export const SuperEffective: Story = {
    args: {
        label: 'Type Effectiveness',
        value: 2,
    },
};
