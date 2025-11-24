import { AppDataSource } from '../lib/db/data-source';
import { AdminUser } from '../lib/db/entities/AdminUser';

async function seed() {
    try {
        await AppDataSource.initialize();
        console.log('Database initialized');

        const userRepo = AppDataSource.getRepository(AdminUser);

        // Check if admin exists
        const existing = await userRepo.findOneBy({ email: 'admin@example.com' });
        if (existing) {
            console.log('Admin user already exists');
            return;
        }

        const admin = userRepo.create({
            name: 'Admin User',
            email: 'admin@example.com',
            googleUid: 'admin-uid-123', // Mock UID
        });

        await userRepo.save(admin);
        console.log('Admin user created');

    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    } finally {
        await AppDataSource.destroy();
    }
}

seed();
