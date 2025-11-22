import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET as getPosts } from '../../app/api/posts/route';
import { GET as getPost } from '../../app/api/posts/[slug]/route';

// Mock dependencies
const { mockFind, mockFindOne, mockGetRepository } = vi.hoisted(() => {
    const mockFind = vi.fn();
    const mockFindOne = vi.fn();
    const mockGetRepository = vi.fn(() => ({
        find: mockFind,
        findOne: mockFindOne,
    }));
    return { mockFind, mockFindOne, mockGetRepository };
});

vi.mock('../../lib/db/data-source', () => ({
    AppDataSource: {
        isInitialized: true,
        initialize: vi.fn(),
        getRepository: mockGetRepository,
    },
}));

vi.mock('../../lib/storage/file-service', () => ({
    fileService: {
        getFileContent: vi.fn().mockResolvedValue('# Mock Content'),
    },
}));

describe('Posts API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('GET /api/posts', () => {
        it('should return a list of published posts', async () => {
            const mockPosts = [
                { id: 1, title: 'Post 1', status: 'published' },
                { id: 2, title: 'Post 2', status: 'published' },
            ];
            mockFind.mockResolvedValue(mockPosts);

            const response = await getPosts();
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toEqual(mockPosts);
            expect(mockFind).toHaveBeenCalledWith({
                where: { status: 'published' },
                order: { publishedAt: 'DESC' },
                relations: ['categories', 'author'],
            });
        });

        it('should handle errors gracefully', async () => {
            mockFind.mockRejectedValue(new Error('DB Error'));

            const response = await getPosts();
            const data = await response.json();

            expect(response.status).toBe(500);
            expect(data).toEqual({ error: 'Internal Server Error' });
        });
    });

    describe('GET /api/posts/[slug]', () => {
        it('should return a single post with content', async () => {
            const mockPost = { id: 1, title: 'Post 1', slug: 'post-1', filePath: 'path/to/file.md' };
            mockFindOne.mockResolvedValue(mockPost);

            // Create a mock request and params
            const request = new Request('http://localhost/api/posts/post-1');
            const params = Promise.resolve({ slug: 'post-1' });

            const response = await getPost(request, { params });
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toEqual({ ...mockPost, content: '# Mock Content' });
        });

        it('should return 404 if post not found', async () => {
            mockFindOne.mockResolvedValue(null);

            const request = new Request('http://localhost/api/posts/not-found');
            const params = Promise.resolve({ slug: 'not-found' });

            const response = await getPost(request, { params });

            expect(response.status).toBe(404);
        });
    });
});
