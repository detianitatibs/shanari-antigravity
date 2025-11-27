import { AdminLayout } from '@/components/templates/AdminLayout';
import { AppDataSource } from '@/lib/db/data-source';
import { Post } from '@/lib/db/entities/Post';

async function getStats() {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const postRepo = AppDataSource.getRepository(Post);
        const total = await postRepo.count();
        const published = await postRepo.count({ where: { status: 'published' } });
        const drafts = await postRepo.count({ where: { status: 'draft' } });

        return { total, published, drafts };
    } catch (error) {
        console.error('Error fetching stats:', error);
        return { total: 0, published: 0, drafts: 0 };
    }
}

export default async function AdminDashboard() {
    const stats = await getStats();

    return (
        <AdminLayout>
            <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-lg bg-white p-6 shadow-sm">
                    <h3 className="text-sm font-medium text-zinc-500">Total Posts</h3>
                    <p className="mt-2 text-3xl font-bold text-zinc-900">{stats.total}</p>
                </div>
                <div className="rounded-lg bg-white p-6 shadow-sm">
                    <h3 className="text-sm font-medium text-zinc-500">Published</h3>
                    <p className="mt-2 text-3xl font-bold text-green-600">{stats.published}</p>
                </div>
                <div className="rounded-lg bg-white p-6 shadow-sm">
                    <h3 className="text-sm font-medium text-zinc-500">Drafts</h3>
                    <p className="mt-2 text-3xl font-bold text-yellow-600">{stats.drafts}</p>
                </div>
            </div>

            <div className="mt-8 rounded-lg bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-medium text-zinc-900">Recent Activity</h2>
                <p className="text-zinc-500">No recent activity.</p>
            </div>
        </AdminLayout>
    );
}
