import { DefaultLayout } from '../../components/templates/DefaultLayout';
import Script from 'next/script';

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Script
                async
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6473863751060692"
                crossOrigin="anonymous"
                strategy="afterInteractive"
            />
            <DefaultLayout>{children}</DefaultLayout>
        </>
    );
}
