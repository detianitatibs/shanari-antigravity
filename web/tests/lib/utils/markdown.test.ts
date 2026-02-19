import { describe, it, expect } from 'vitest';
import { extractHeadings } from '../../../lib/utils/markdown';

describe('extractHeadings', () => {
    it('should extract H1 and H2 headings', () => {
        const content = `
# Heading 1
Some content.

## Heading 2
More content.

# Another Heading 1
        `;

        const headings = extractHeadings(content);

        expect(headings).toHaveLength(3);
        expect(headings[0]).toEqual({ id: 'heading-1', text: 'Heading 1', level: 1 });
        expect(headings[1]).toEqual({ id: 'heading-2', text: 'Heading 2', level: 2 });
        expect(headings[2]).toEqual({ id: 'another-heading-1', text: 'Another Heading 1', level: 1 });
    });

    it('should ignore H3 and deeper headings', () => {
        const content = `
### Heading 3
#### Heading 4
        `;

        const headings = extractHeadings(content);

        expect(headings).toHaveLength(0);
    });

    it('should generate unique IDs for duplicate headings', () => {
        const content = `
# Duplicate
# Duplicate
        `;

        const headings = extractHeadings(content);

        expect(headings).toHaveLength(2);
        expect(headings[0].id).toBe('duplicate');
        expect(headings[1].id).toBe('duplicate-1');
    });

    it('should handle special characters in IDs', () => {
        const content = `
# Hello World!
# React & Next.js
        `;

        const headings = extractHeadings(content);

        expect(headings[0].id).toBe('hello-world');
        expect(headings[1].id).toBe('react--nextjs');
    });

    it('should return empty array for content without headings', () => {
        const content = 'Just some text without headings.';
        const headings = extractHeadings(content);
        expect(headings).toHaveLength(0);
    });
});
