import { Meta, StoryObj } from '@storybook/nextjs';
import { ToolsDamageCalculationTemplate } from './index';

const meta: Meta<typeof ToolsDamageCalculationTemplate> = {
    title: 'Templates/ToolsDamageCalculationTemplate',
    component: ToolsDamageCalculationTemplate,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ToolsDamageCalculationTemplate>;

export const Default: Story = {};
