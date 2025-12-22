'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, CheckCircle, Users, FileText, Home, ArrowRight } from 'lucide-react';
import { API_URL } from '@/lib/api';

const TABS = [
    { name: 'Services', href: '/admin/services' },
    { name: 'Bookings', href: '/admin/bookings' },
    { name: 'Providers', href: '/admin/providers' },
    { name: 'Applications', href: '/admin/applications', badge: 2 },
];

// Helper Component
function StatsCard({ label, value, icon: Icon, color, bg }: any) {
    return (
        <div className="border-2 border-black p-4 flex flex-col justify-between h-32 relative bg-white">
            <div className={cn("w-8 h-8 flex items-center justify-center border border-black mb-2", bg, color)}>
                <Icon size={16} />
            </div>
            <div>
                <h2 className="text-3xl font-bold">{value}</h2>
                <p className="text-sm text-gray-500 font-medium">{label}</p>
            </div>
        </div>
    );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [stats, setStats] = useState({
        totalBookings: 0,
        completedBookings: 0,
        activeProviders: 0,
        pendingApps: 0
    });

    useEffect(() => {
        // Fetch stats
        fetch(`${API_URL}/admin/dashboard`, {
            headers: {
                // 'Authorization': `Bearer ${token}` // TODO: Add Auth Token from store
            }
        })
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(err => console.error("Failed to fetch admin stats", err));
    }, []);

    return (
        <div className="min-h-screen bg-white">
            {/* Top Header */}
            <header className="flex h-16 items-center justify-between border-b border-black px-48">
                <div className="flex items-center gap-4">
                    <div className="bg-black text-white p-2 rounded-sm">
                        <LayoutDashboard size={20} />
                    </div>
                    <h1 className="text-xl font-bold uppercase tracking-tight">Admin Panel</h1>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/">
                        <Button variant="outline" className="border-black rounded-none uppercase font-bold text-xs">
                            <Home className="mr-2 h-4 w-4" /> Main Site
                        </Button>
                    </Link>
                </div>
            </header>

            <main className="p-8 max-w-7xl mx-auto space-y-8">

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatsCard label="Total Bookings" value={stats.totalBookings} icon={LayoutDashboard} color="text-blue-600" bg="bg-blue-50" />
                    <StatsCard label="Completed" value={stats.completedBookings} icon={CheckCircle} color="text-green-600" bg="bg-green-50" />
                    <StatsCard label="Active Providers" value={stats.activeProviders} icon={Users} color="text-purple-600" bg="bg-purple-50" />
                    <StatsCard label="Pending Apps" value={stats.pendingApps} icon={FileText} color="text-orange-600" bg="bg-orange-50" />
                </div>

                {/* Navigation Tabs */}
                <div className="flex border-b-2 border-black">
                    {TABS.map((tab) => {
                        const isActive = pathname.startsWith(tab.href);
                        return (
                            <Link
                                key={tab.name}
                                href={tab.href}
                                className={cn(
                                    "px-8 py-3 font-bold uppercase text-sm border-r border-black relative transition-colors",
                                    isActive ? "bg-black text-white" : "bg-white text-black hover:bg-gray-50"
                                )}
                            >
                                {tab.name}
                                {tab.badge && (
                                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                                        {tab.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* Tab Content */}
                <div className="min-h-[400px]">
                    {children}
                </div>
            </main>
        </div>
    );
}
