import { AdminLayout } from '../../../../components/templates/AdminLayout';

export default function AdminDashboard() {
    return (
        <AdminLayout>
            <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-lg bg-white p-6 shadow-sm">
                    <h3 className="text-sm font-medium text-zinc-500">Total Posts</h3>
                    <p className="mt-2 text-3xl font-bold text-zinc-900">12</p>
                </div>
                <div className="rounded-lg bg-white p-6 shadow-sm">
                    <h3 className="text-sm font-medium text-zinc-500">Published</h3>
                    <p className="mt-2 text-3xl font-bold text-green-600">8</p>
                </div>
                <div className="rounded-lg bg-white p-6 shadow-sm">
                    <h3 className="text-sm font-medium text-zinc-500">Drafts</h3>
                    <p className="mt-2 text-3xl font-bold text-yellow-600">4</p>
                </div>
            </div>

            <div className="mt-8 rounded-lg bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-medium text-zinc-900">Recent Activity</h2>
                <p className="text-zinc-500">No recent activity.</p>
            </div>
        </AdminLayout>
    );
}
