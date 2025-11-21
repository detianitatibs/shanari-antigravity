import { AppDataSource } from '../lib/db/data-source';
import { AdminUser } from '../lib/db/entities/AdminUser';
import { Category } from '../lib/db/entities/Category';
import { Post } from '../lib/db/entities/Post';

async function seed() {
    try {
        console.log('Initializing Data Source...');
        await AppDataSource.initialize();
        console.log('Data Source has been initialized!');

        // Create Admin User
        const userRepo = AppDataSource.getRepository(AdminUser);
        const existingUser = await userRepo.findOneBy({ email: 'admin@example.com' });
        let user;
        if (!existingUser) {
            user = new AdminUser();
            user.name = 'Admin';
            user.email = 'admin@example.com';
            user.googleUid = 'mock-uid-123';
            await userRepo.save(user);
            console.log('Admin user created');
        } else {
            user = existingUser;
            console.log('Admin user already exists');
        }

        // Create Categories
        const categoryRepo = AppDataSource.getRepository(Category);
        const categories = ['daily', 'game', 'hobby', 'sport', 'parenting'];
        const categoryEntities = [];
        for (const name of categories) {
            let category = await categoryRepo.findOneBy({ name });
            if (!category) {
                category = new Category();
                category.name = name;
                await categoryRepo.save(category);
                console.log(`Category ${name} created`);
            }
            categoryEntities.push(category);
        }

        // Create Post
        const postRepo = AppDataSource.getRepository(Post);
        const existingPost = await postRepo.findOneBy({ slug: '20251005_daily_01' });
        if (!existingPost) {
            const post = new Post();
            post.title = 'Hello World';
            post.slug = '20251005_daily_01';
            post.filePath = 'posts/2025/10/20251005_daily_01.md';
            post.status = 'published';
            post.publishedAt = new Date();
            post.author = user;
            post.categories = [categoryEntities[0]]; // daily
            await postRepo.save(post);
            console.log('Sample post created');
        } else {
            console.log('Sample post already exists');
        }

        console.log('Seeding completed successfully');
        process.exit(0);
    } catch (err) {
        console.error('Error during seeding:', err);
        process.exit(1);
    }
}

seed();
