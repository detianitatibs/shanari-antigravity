const fs = require('fs');
const path = require('path');

const filePath = '/Users/tokudakeisuke/Documents/02_technology/015_shanari_antigravity/data/posts/2025/11/20250813_game_02.md';

try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Fix description (ensure it's quoted)
    content = content.replace(
        /description: (.*)/,
        (match, p1) => {
            if (p1.startsWith('"')) return match;
            return `description: "${p1.replace(/"/g, '\\"')}"`;
        }
    );

    // Fix title (ensure it's quoted, ESPECIALLY if it starts with [)
    content = content.replace(
        /title: (.*)/,
        (match, p1) => {
            if (p1.startsWith('"')) return match; // Already quoted
            // Always quote if not quoted
            return `title: "${p1.replace(/"/g, '\\"')}"`;
        }
    );

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Successfully fixed frontmatter in:', filePath);
} catch (error) {
    console.error('Error fixing file:', error);
    process.exit(1);
}
