import { Meta, StoryObj } from '@storybook/nextjs';
import { DamageResultMatrix } from './index';

const meta: Meta<typeof DamageResultMatrix> = {
    title: 'Organisms/DamageResultMatrix',
    component: DamageResultMatrix,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DamageResultMatrix>;

const mockMatrix = [
    {
        label: 'タイプ不一致',
        stab: 1.0,
        base: {
            label: '補正なし',
            mult: 1.0,
            single: {
                normal: { minDamage: 90, maxDamage: 110, rolls: [90, 92, 94, 96, 98, 100, 102, 104, 106, 108, 110] },
                wall: { minDamage: 45, maxDamage: 55, rolls: [] }
            },
            double: {
                normal: { minDamage: 70, maxDamage: 80, rolls: [] },
                wall: { minDamage: 35, maxDamage: 40, rolls: [] }
            }
        },
        children: [
            {
                label: '1.1倍',
                mult: 1.1,
                single: {
                    normal: { minDamage: 99, maxDamage: 121, rolls: [] },
                    wall: { minDamage: 50, maxDamage: 60, rolls: [] }
                },
                double: {
                    normal: { minDamage: 77, maxDamage: 88, rolls: [] },
                    wall: { minDamage: 38, maxDamage: 44, rolls: [] }
                }
            }
        ]
    },
    {
        label: 'タイプ一致',
        stab: 1.5,
        base: {
            label: '補正なし',
            mult: 1.0,
            single: {
                normal: { minDamage: 135, maxDamage: 165, rolls: [135, 137, 140, 165] },
                wall: { minDamage: 67, maxDamage: 82, rolls: [] }
            },
            double: {
                normal: { minDamage: 105, maxDamage: 120, rolls: [] },
                wall: { minDamage: 52, maxDamage: 60, rolls: [] }
            }
        },
        children: []
    }
];

export const Default: Story = {
    args: {
        matrix: mockMatrix,
        hp: 150
    },
};

export const HighHP_NoKO: Story = {
    args: {
        matrix: mockMatrix,
        hp: 300 // Max damage 165, so no KO color
    },
};
