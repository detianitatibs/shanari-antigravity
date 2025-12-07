import { Meta, StoryObj } from '@storybook/nextjs';
import { RankInput } from './index';

const meta: Meta<typeof RankInput> = {
    title: 'Atoms/RankInput',
    component: RankInput,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RankInput>;

export const Default: Story = {
    args: {
        label: 'Attack Rank',
        value: 0,
    },
};

export const MaxRank: Story = {
    args: {
        label: 'Boosted',
        value: 6,
    },
};

export const MinRank: Story = {
    args: {
        label: 'Debuffed',
        value: -6,
    },
};
