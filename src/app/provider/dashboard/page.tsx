'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { JobCard } from '@/components/provider/JobCard';
import { LayoutDashboard, CheckSquare, Clock, IndianRupee } from 'lucide-react';
import { API_URL } from '@/lib/api';

export default function ProviderDashboard() {
    const [activeTab, setActiveTab] = useState<'new' | 'active' | 'history'>('new');
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Mock Provider ID for now (Assuming we are "p1" or similar from earlier setup)
    // In real app, get from Auth Context
    const PROVIDER_ID = 'p1';

    const fetchBookings = async () => {
        try {
            // Fetch bookings for this provider
            const res = await fetch(`${API_URL}/bookings/provider/${PROVIDER_ID}`);
            if (res.ok) {
                const data = await res.json();
                setBookings(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleAction = async (action: string, bookingId: string) => {
        try {
            const res = await fetch(`${API_URL}/bookings/${bookingId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: action, providerId: PROVIDER_ID })
            });

            if (res.ok) {
                // Refresh data
                fetchBookings();
            } else {
                alert('Failed to update status');
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Derived State
    const newRequests = bookings.filter(b => b.status === 'Pending');
    const activeJobs = bookings.filter(b => ['Accepted', 'InProgress'].includes(b.status));
    const historyJobs = bookings.filter(b => ['Completed', 'Cancelled', 'Rejected'].includes(b.status));

    const totalEarnings = bookings
        .filter(b => b.status === 'Completed')
        .reduce((sum, b) => sum + Number(b.service?.price || 0), 0);

    const MetricsCard = ({ label, value, icon: Icon, color }: any) => (
        <div className="border-4 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between h-32">
            <div className={`w-10 h-10 border-2 border-black flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <div className="text-3xl font-black">{value}</div>
                <div className="text-xs font-bold text-gray-500 uppercase">{label}</div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-black">
            {/* Top Bar */}
            <header className="bg-white border-b-4 border-black px-8 py-4 flex justify-between items-center sticky top-0 z-50">
                <div>
                    <div className="bg-black text-white px-2 py-1 text-xs font-bold inline-block mb-1">PROVIDER PORTAL</div>
                    <div className="text-xl font-black uppercase">CleanPro Services</div>
                </div>
                <Button variant="outline" className="border-2 border-black font-bold hover:bg-gray-100">
                    Main Site →
                </Button>
            </header>

            <main className="container mx-auto px-4 py-12">
                <h1 className="text-4xl font-black mb-2">Welcome back, Provider!</h1>
                <p className="text-gray-500 font-bold mb-12">Here's your job dashboard for today</p>

                {/* Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <MetricsCard label="New Requests" value={newRequests.length} icon={Clock} color="bg-yellow-100" />
                    <MetricsCard label="Active Jobs" value={activeJobs.length} icon={LayoutDashboard} color="bg-blue-100" />
                    <MetricsCard label="Completed" value={historyJobs.filter(b => b.status === 'Completed').length} icon={CheckSquare} color="bg-green-100" />
                    <MetricsCard label="Earnings" value={`₹${totalEarnings}`} icon={IndianRupee} color="bg-purple-100" />
                </div>

                {/* Tabs */}
                <div className="flex gap-0 border-4 border-black bg-white w-fit mb-8">
                    {[
                        { id: 'new', label: `New Jobs (${newRequests.length})` },
                        { id: 'active', label: `Active (${activeJobs.length})` },
                        { id: 'history', label: `History (${historyJobs.length})` }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-8 py-3 font-black uppercase text-sm border-r-2 border-black last:border-r-0 transition-colors ${activeTab === tab.id ? 'bg-black text-white' : 'hover:bg-gray-100'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* List Area */}
                <div className="space-y-6">
                    {loading ? (
                        <div className="text-center py-20 font-bold text-gray-400 text-xl animate-pulse">LOADING JOBS...</div>
                    ) : (
                        <>
                            {activeTab === 'new' && newRequests.map(b => (
                                <JobCard key={b.id} booking={b} onAction={handleAction} />
                            ))}
                            {activeTab === 'active' && activeJobs.map(b => (
                                <JobCard key={b.id} booking={b} onAction={handleAction} />
                            ))}
                            {activeTab === 'history' && historyJobs.map(b => (
                                <JobCard key={b.id} booking={b} onAction={handleAction} />
                            ))}

                            {((activeTab === 'new' && newRequests.length === 0) ||
                                (activeTab === 'active' && activeJobs.length === 0) ||
                                (activeTab === 'history' && historyJobs.length === 0)) && (
                                    <div className="border-4 border-black bg-white p-12 text-center">
                                        <div className="text-xl font-bold text-gray-400 uppercase">No jobs found in this section</div>
                                    </div>
                                )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
