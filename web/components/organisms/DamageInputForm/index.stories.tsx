import { Meta, StoryObj } from '@storybook/nextjs';
import { DamageInputForm } from './index';

const meta: Meta<typeof DamageInputForm> = {
    title: 'Organisms/DamageInputForm',
    component: DamageInputForm,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DamageInputForm>;

export const Default: Story = {
    args: {
        values: {
            level: '50',
            attack: '150',
            attackRank: 0,
            power: '100',
            typeEffectiveness: 1,
            defense: '100',
            defenseRank: 0,
            hp: '150',
        },
    },
};
