import type { Meta, StoryObj } from '@storybook/nextjs';
import { MarkdownEditor } from './index';

const meta: Meta<typeof MarkdownEditor> = {
    title: 'Organisms/MarkdownEditor',
    component: MarkdownEditor,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MarkdownEditor>;

export const Default: Story = {};
