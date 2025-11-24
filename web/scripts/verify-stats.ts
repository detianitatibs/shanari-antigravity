import { AppDataSource } from '../lib/db/data-source';
import { Post } from '../lib/db/entities/Post';

async function verifyStats() {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const postRepo = AppDataSource.getRepository(Post);
        const total = await postRepo.count();
        const published = await postRepo.count({ where: { status: 'published' } });
        const drafts = await postRepo.count({ where: { status: 'draft' } });

        console.log('Stats Verification:');
        console.log(`Total: ${total}`);
        console.log(`Published: ${published}`);
        console.log(`Drafts: ${drafts}`);

        if (total !== published + drafts) {
            console.warn('Warning: Total does not match Published + Drafts (maybe other statuses?)');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error verifying stats:', error);
        process.exit(1);
    }
}

verifyStats();
