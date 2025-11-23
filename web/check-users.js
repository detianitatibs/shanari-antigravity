const { DataSource } = require('typeorm');
const { AdminUser } = require('./lib/db/entities/AdminUser');
const { Post } = require('./lib/db/entities/Post');
const { Category } = require('./lib/db/entities/Category');

const AppDataSource = new DataSource({
    type: 'sqlite',
    database: '/db/database.sqlite',
    entities: [AdminUser, Post, Category],
    synchronize: false,
});

async function checkUsers() {
    await AppDataSource.initialize();
    const userRepo = AppDataSource.getRepository(AdminUser);
    const users = await userRepo.find();
    console.log('Users:', JSON.stringify(users, null, 2));
    process.exit(0);
}

checkUsers().catch(console.error);
