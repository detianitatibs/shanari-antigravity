import { DefaultLayout } from '../../components/templates/DefaultLayout';

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <DefaultLayout>{children}</DefaultLayout>;
}
