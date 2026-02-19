import GithubSlugger from 'github-slugger';

export interface Heading {
    id: string;
    text: string;
    level: number;
}

export function extractHeadings(content: string): Heading[] {
    const slugger = new GithubSlugger();
    const headings: Heading[] = [];
    
    // Regular expression to match H1 and H2 headings
    // This matches:
    // ^: Start of line
    // (#{1,2}): 1 or 2 hash characters
    // \s+: One or more whitespace characters
    // (.+): The heading text
    const regex = /^(#{1,2})\s+(.+)$/gm;
    
    let match;
    while ((match = regex.exec(content)) !== null) {
        const level = match[1].length;
        const text = match[2].trim();
        const id = slugger.slug(text);
        
        headings.push({
            id,
            text,
            level
        });
    }
    
    return headings;
}
