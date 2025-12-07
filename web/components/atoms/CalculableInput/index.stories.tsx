import { Meta, StoryObj } from '@storybook/nextjs';
import { CalculableInput } from './index';

const meta: Meta<typeof CalculableInput> = {
    title: 'Atoms/CalculableInput',
    component: CalculableInput,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CalculableInput>;

export const Default: Story = {
    args: {
        label: 'Damage',
        value: '',
        placeholder: 'e.g. 100*1.5',
    },
};

export const Filled: Story = {
    args: {
        label: 'Attack',
        value: '150',
    },
};
