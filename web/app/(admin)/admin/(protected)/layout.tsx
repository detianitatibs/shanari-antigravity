import { auth } from '../../../../auth';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function ProtectedAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session) {
        redirect('/admin/login');
    }

    return <>{children}</>;
}
