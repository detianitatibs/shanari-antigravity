import { NextResponse } from 'next/server';
import { AppDataSource } from '../../../../lib/db/data-source';
import { Post } from '../../../../lib/db/entities/Post';
import { fileService } from '../../../../lib/storage/file-service';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const { slug } = await params;
        const postRepo = AppDataSource.getRepository(Post);
        const post = await postRepo.findOne({
            where: { slug, status: 'published' },
            relations: ['categories', 'author'],
        });

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        // Fetch markdown content
        let content = '';
        try {
            content = await fileService.getFileContent(post.filePath);
        } catch (error) {
            console.error(`Failed to load content for post ${slug}:`, error);
            // Return post without content or error?
            // For now, let's return what we have but maybe with a warning or empty content
            // Ideally we should probably 500 if content is missing but metadata exists
        }

        return NextResponse.json({ ...post, content });
    } catch (error) {
        console.error('Error fetching post:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
