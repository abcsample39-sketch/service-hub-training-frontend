'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Users, FileText, Calendar, Settings } from 'lucide-react';

export function AdminTabs() {
    const pathname = usePathname();

    const tabs = [
        // { name: 'Main', href: '/admin/dashboard', icon: LayoutDashboard }, // Assuming a main dashboard exists or mapping to one
        { name: 'Services', href: '/admin/services', icon: Settings },
        { name: 'Bookings', href: '/admin/bookings', icon: Calendar },
        { name: 'Providers', href: '/admin/providers', icon: Users },
        { name: 'Applications', href: '/admin/applications', icon: FileText },
    ];

    return (
        <div className="flex border-b-2 border-black bg-white mb-6">
            {tabs.map((tab) => {
                const isActive = pathname === tab.href;
                const Icon = tab.icon;
                return (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        className={cn(
                            "flex items-center px-6 py-4 text-sm font-bold uppercase tracking-wide transition-all border-r-2 border-black hover:bg-gray-50",
                            isActive ? "bg-black text-white hover:bg-black" : "text-gray-600"
                        )}
                    >
                        <Icon className={cn("w-4 h-4 mr-2", isActive ? "text-white" : "text-gray-400")} />
                        {tab.name}
                        {/* Optional Badge for Applications if needed, can be passed as prop or fetched */}
                    </Link>
                );
            })}
        </div>
    );
}
