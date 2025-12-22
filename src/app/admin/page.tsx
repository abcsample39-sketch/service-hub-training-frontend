'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Activity, CreditCard, Users, Clock } from 'lucide-react';
import { API_URL } from '@/lib/api';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalBookings: 0,
        completedBookings: 0,
        activeProviders: 0,
        pendingApps: 0,
        revenue: 0,
    });

    useEffect(() => {
        fetch(`${API_URL}/admin/dashboard`)
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(err => console.error(err));
    }, []);

    const statCards = [
        {
            title: 'Total Revenue',
            value: `₹${stats.revenue}`,
            icon: CreditCard,
            color: 'bg-green-100 text-green-600',
        },
        {
            title: 'Total Bookings',
            value: stats.totalBookings,
            icon: Activity,
            color: 'bg-blue-100 text-blue-600',
        },
        {
            title: 'Active Providers',
            value: stats.activeProviders,
            icon: Users,
            color: 'bg-purple-100 text-purple-600',
        },
        {
            title: 'Pending Apps',
            value: stats.pendingApps,
            icon: Clock,
            color: 'bg-orange-100 text-orange-600',
        },
    ];

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-black uppercase">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => (
                    <div key={i} className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between h-40">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase mb-2">{stat.title}</p>
                                <h3 className="text-4xl font-black">{stat.value}</h3>
                            </div>
                            <div className={`p-3 border-2 border-black rounded-full ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions or Recent Activity could go here */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <h3 className="font-black text-xl mb-4 uppercase">Recent Activity</h3>
                    <p className="text-gray-500 font-bold">No recent activity to show.</p>
                </div>

                <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <h3 className="font-black text-xl mb-4 uppercase">System Status</h3>
                    <div className="flex items-center gap-3 text-green-600 font-bold">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        All systems operational
                    </div>
                </div>
            </div>
        </div>
    );
}
