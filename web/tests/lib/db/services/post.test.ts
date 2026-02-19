import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PostService } from '../../../../lib/db/services/post';
import { Post } from '../../../../lib/db/entities/Post';
import { Category } from '../../../../lib/db/entities/Category';
import { Tag } from '../../../../lib/db/entities/Tag';

// Mock dependencies
const { mockCreateQueryBuilder, mockGetRepository, mockFindOne } = vi.hoisted(() => {
    const mockAndWhere = vi.fn().mockReturnThis();
    const mockWhere = vi.fn().mockReturnThis();
    const mockLeftJoinAndSelect = vi.fn().mockReturnThis();
    const mockOrderBy = vi.fn().mockReturnThis();
    const mockSkip = vi.fn().mockReturnThis();
    const mockTake = vi.fn().mockReturnThis();
    const mockGetMany = vi.fn();
    const mockGetManyAndCount = vi.fn();
    const mockLimit = vi.fn().mockReturnThis();

    const mockFindOne = vi.fn();

    const mockCreateQueryBuilder = vi.fn(() => ({
        leftJoinAndSelect: mockLeftJoinAndSelect,
        where: mockWhere,
        andWhere: mockAndWhere,
        orderBy: mockOrderBy,
        skip: mockSkip,
        take: mockTake,
        getMany: mockGetMany,
        getManyAndCount: mockGetManyAndCount,
        limit: mockLimit,
    }));

    const mockGetRepository = vi.fn(() => ({
        createQueryBuilder: mockCreateQueryBuilder,
        findOne: mockFindOne,
    }));

    return { mockCreateQueryBuilder, mockGetRepository, mockFindOne };
});

vi.mock('../../../../lib/db/data-source', () => ({
    AppDataSource: {
        isInitialized: true,
        initialize: vi.fn(),
        getRepository: mockGetRepository,
    },
}));

vi.mock('../../../../lib/storage/file-service', () => ({
    fileService: {
        getFileContent: vi.fn(),
    },
}));

import { fileService } from '../../../../lib/storage/file-service';

describe('PostService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getPostWithContent', () => {
        it('should return post with content', async () => {
            const mockPost = { id: 1, slug: 'slug', filePath: 'path.md' } as Post;
            const mockContent = '# Content';

            mockFindOne.mockResolvedValue(mockPost);
            (fileService.getFileContent as any).mockResolvedValue(mockContent);

            const result = await PostService.getPostWithContent('slug');

            expect(result).toEqual({ ...mockPost, content: mockContent });
            expect(fileService.getFileContent).toHaveBeenCalledWith('path.md');
        });

        it('should return null if post not found', async () => {
            mockFindOne.mockResolvedValue(null);

            const result = await PostService.getPostWithContent('slug');

            expect(result).toBeNull();
            expect(fileService.getFileContent).not.toHaveBeenCalled();
        });
    });

    describe('getRelatedPosts', () => {
        it('should return recent posts if no tags or categories', async () => {
            const currentPost = { id: 1, tags: [], categories: [] } as unknown as Post;
            const mockRecentPosts = [{ id: 2 }, { id: 3 }];

            // Setup mock return for getMany
            const mockQueryBuilder = mockGetRepository().createQueryBuilder();
            (mockQueryBuilder.getMany as any).mockResolvedValue(mockRecentPosts);

            const result = await PostService.getRelatedPosts(currentPost);

            expect(result).toEqual(mockRecentPosts);
            expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('post.publishedAt', 'DESC');
            expect(mockQueryBuilder.take).toHaveBeenCalledWith(3);
        });

        it('should prioritize posts with matching tags', async () => {
            const tag1 = { id: 1, name: 'Tag1' } as Tag;
            const tag2 = { id: 2, name: 'Tag2' } as Tag;
            const currentPost = { id: 1, tags: [tag1], categories: [] } as unknown as Post;

            const postWithTag = { id: 2, tags: [tag1], categories: [], publishedAt: new Date('2023-01-01') } as unknown as Post;
            const postOutput = { id: 3, tags: [tag2], categories: [], publishedAt: new Date('2023-01-02') } as unknown as Post;

            // Setup mock return for getMany (candidates)
            const mockQueryBuilder = mockGetRepository().createQueryBuilder();
            (mockQueryBuilder.getMany as any).mockResolvedValue([postOutput, postWithTag]);

            const result = await PostService.getRelatedPosts(currentPost);

            // Should be sorted by score (matching tag = 2 points)
            expect(result[0]).toEqual(postWithTag);
            expect(result[1]).toEqual(postOutput);
        });

        it('should exclude current post', async () => {
            const currentPost = { id: 1, tags: [], categories: [] } as unknown as Post;

            await PostService.getRelatedPosts(currentPost);

            const mockQueryBuilder = mockGetRepository().createQueryBuilder();
            expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('post.id != :id', { id: 1 });
        });
    });
});
