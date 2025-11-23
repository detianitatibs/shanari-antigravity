import fs from 'fs';
import path from 'path';

function getFiles(dir: string, files: string[] = []) {
    const fileList = fs.readdirSync(dir);
    for (const file of fileList) {
        const name = `${dir}/${file}`;
        if (fs.statSync(name).isDirectory()) {
            getFiles(name, files);
        } else {
            files.push(name);
        }
    }
    return files;
}

async function generateStories() {
    const componentsDir = path.join(process.cwd(), 'components');
    const allFiles = getFiles(componentsDir);
    const files = allFiles.filter(f => f.endsWith('.tsx') && !f.endsWith('.stories.tsx'));

    for (const file of files) {
        const storyPath = file.replace('.tsx', '.stories.tsx');

        if (fs.existsSync(storyPath)) {
            continue;
        }

        const componentName = path.basename(file, '.tsx') === 'index'
            ? path.basename(path.dirname(file))
            : path.basename(file, '.tsx');

        const dirName = path.dirname(file);
        const relativeDir = path.relative(componentsDir, dirName);
        const category = relativeDir.split(path.sep)[0] || 'Other';
        const title = `${category.charAt(0).toUpperCase() + category.slice(1)}/${componentName}`;

        const content = `import type { Meta, StoryObj } from '@storybook/react';
import { ${componentName} } from './index';

const meta: Meta<typeof ${componentName}> = {
    title: '${title}',
    component: ${componentName},
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ${componentName}>;

export const Default: Story = {};
`;

        fs.writeFileSync(storyPath, content);
        console.log(`Created story for ${componentName}`);
    }
}

generateStories();
