import { Meta, StoryObj } from '@storybook/nextjs';
import { DamageResultTable } from './index';

const meta: Meta<typeof DamageResultTable> = {
    title: 'Organisms/DamageResultTable',
    component: DamageResultTable,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DamageResultTable>;

const mockResult = {
    minDamage: 85,
    maxDamage: 100,
    rolls: [85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100],
};

export const Default: Story = {
    args: {
        result: mockResult,
        hp: undefined,
    },
};

export const WithHP_1HKO: Story = {
    args: {
        result: mockResult,
        hp: 80, // min 85 >= 80
    },
};

export const WithHP_Random1HKO: Story = {
    args: {
        result: mockResult,
        hp: 95, // max 100 >= 95 > min 85
    },
};
