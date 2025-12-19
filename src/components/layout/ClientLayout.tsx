'use client';

import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';
import { AuthProvider } from '@/context/AuthContext';

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');

    if (isAdmin) {
        return <AuthProvider>{children}</AuthProvider>;
    }

    return (
        <AuthProvider>
            <div className="flex min-h-screen flex-col font-sans">
                <Header />
                <main className="flex-1 container mx-auto px-4 py-8">
                    {children}
                </main>
                <Footer />
            </div>
        </AuthProvider>
    );
}
