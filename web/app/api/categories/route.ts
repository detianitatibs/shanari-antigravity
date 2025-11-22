import { NextResponse } from 'next/server';
import { AppDataSource } from '../../../lib/db/data-source';
import { Category } from '../../../lib/db/entities/Category';

export async function GET() {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const categoryRepo = AppDataSource.getRepository(Category);
        const categories = await categoryRepo.find({
            order: { name: 'ASC' },
        });

        return NextResponse.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
