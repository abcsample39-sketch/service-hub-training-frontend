'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
    children: ReactNode;
    requiredRole?: 'Admin' | 'Provider' | 'Customer';
}

/**
 * ProtectedRoute component that redirects unauthenticated users to login
 * and optionally checks for specific roles.
 */
export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    // Show loading state while checking auth
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin w-8 h-8 border-4 border-black border-t-transparent rounded-full"></div>
            </div>
        );
    }

    // Not authenticated
    if (!user) {
        return null;
    }

    // Role check - for now we just render, but could enhance with role from JWT
    // TODO: Implement proper role checking when auth is unified
    return <>{children}</>;
}

export default ProtectedRoute;
