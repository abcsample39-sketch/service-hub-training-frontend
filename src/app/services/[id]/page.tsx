'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Star, Clock } from 'lucide-react';
import { useBookingStore } from '@/store/booking-store';
import BookingWizard from '@/components/booking/BookingWizard';
import BookingWidget from '@/components/booking/BookingWidget';
import { apiFetch, authFetch } from '@/lib/api';
import type { Service, ProviderProfile } from '@/types';

import { useAuth } from '@/context/AuthContext';

export default function ServiceDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuth(); // Get user from AuthContext
    const [service, setService] = useState<Service | null>(null);
    const [providers, setProviders] = useState<ProviderProfile[]>([]); // In real app, fetch only for this category
    const [loading, setLoading] = useState(true);

    // Store
    const { setServiceId, setProviderId, providerId, reset } = useBookingStore();
    const [isWizardOpen, setIsWizardOpen] = useState(false);

    useEffect(() => {
        // Reset store on mount just in case
        reset();

        const fetchData = async () => {
            try {
                // 1. Fetch Service Details
                const serviceData = await apiFetch<Service>(`services/${id}`);
                setService(serviceData);
                if (serviceData) setServiceId(serviceData.id);

                // 2. Fetch Providers - Try real endpoint, fallback to mock
                try {
                    const allProviders = await apiFetch<ProviderProfile[]>('providers');
                    setProviders(allProviders);
                } catch {
                    // Fallback mock data if providers endpoint doesn't exist yet
                    setProviders([
                        { id: 'p1', userId: 'u1', businessName: 'CleanPro Services', bio: 'Expert cleaning', rating: '4.8', experience: 5, address: '2.5 km away' },
                        { id: 'p2', userId: 'u2', businessName: 'QuickFix Plumbers', bio: '24/7 Plumbing', rating: '4.5', experience: 10, address: '5.0 km away' }
                    ] as ProviderProfile[]);
                }

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchData();
    }, [id, reset, setServiceId]);

    const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);

    const handleProviderSelect = (pid: string) => {
        setSelectedProviderId(pid);
        // We'll handle the actual Booking Store update inside the widget or when "Continue" is clicked
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (!service) {
        return <div className="flex justify-center items-center h-screen">Service not found</div>;
    }

    const selectedProvider = providers.find(p => p.id === selectedProviderId);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <main className="flex-grow container mx-auto px-4 ">
                <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent font-bold" onClick={() => router.back()}>
                    ← Back to Services
                </Button>

                {/* Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Details & Reviews */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Service Hero */}
                        <div className="border-4 border-black bg-white p-0 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <div className="h-64 bg-gray-200 flex items-center justify-center border-b-4 border-black">
                                <span className="text-6xl text-gray-400 font-black tracking-widest">IMAGE</span>
                            </div>
                            <div className="p-8">
                                <div className="flex justify-between items-start mb-4">
                                    <h1 className="text-4xl font-black uppercase">{service.name}</h1>
                                    <div className="bg-black text-white px-3 py-1 font-bold flex items-center gap-2">
                                        <Star className="w-4 h-4 fill-current" />
                                        4.8 (203)
                                    </div>
                                </div>
                                <p className="text-lg text-gray-600 font-medium mb-6 max-w-2xl">{service.description}</p>

                                <div className="flex items-center gap-6 font-bold text-lg">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-5 h-5" />
                                        {service.duration} mins
                                    </div>
                                    <div className="text-2xl">
                                        ₹{service.price} <span className="text-sm text-gray-500 font-normal">onwards</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* What's Included */}
                        <div className="border-4 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <h3 className="font-black text-xl mb-4 uppercase">What's Included</h3>
                            <ul className="space-y-3 font-medium">
                                {['Professional service by verified experts', 'High-quality tools and products', 'Post-service cleanup', '30-day service warranty'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full border-2 border-black flex items-center justify-center text-xs font-bold">✓</div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Highlights Section */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="border-4 border-black bg-white p-4 text-center">
                                <div className="mx-auto w-8 h-8 mb-2 border-2 border-black rounded-full flex items-center justify-center font-bold">✓</div>
                                <div className="font-black text-sm uppercase">Verified</div>
                                <div className="text-xs text-gray-500">Background checked</div>
                            </div>
                            <div className="border-4 border-black bg-white p-4 text-center">
                                <div className="mx-auto w-8 h-8 mb-2 border-2 border-black rounded-full flex items-center justify-center font-bold">8</div>
                                <div className="font-black text-sm uppercase">2000+</div>
                                <div className="text-xs text-gray-500">Trained professionals</div>
                            </div>
                            <div className="border-4 border-black bg-white p-4 text-center">
                                <div className="mx-auto w-8 h-8 mb-2 border-2 border-black rounded-full flex items-center justify-center font-bold">★</div>
                                <div className="font-black text-sm uppercase">4.8★</div>
                                <div className="text-xs text-gray-500">Customer rating</div>
                            </div>
                        </div>

                        {/* Reviews Summary */}
                        <div className="border-4 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <div className="flex items-center gap-8">
                                <div className="text-center">
                                    <div className="text-5xl font-black">4.8</div>
                                    <div className="flex text-black my-1 justify-center"><Star className="fill-black w-4 h-4" /><Star className="fill-black w-4 h-4" /><Star className="fill-black w-4 h-4" /><Star className="fill-black w-4 h-4" /><Star className="fill-black w-4 h-4" /></div>
                                    <div className="text-sm font-bold text-gray-500">203 Reviews</div>
                                </div>
                                <div className="flex-1 space-y-2">
                                    {[65, 20, 10, 3, 2].map((pct, i) => (
                                        <div key={i} className="flex items-center gap-3 text-xs font-bold">
                                            <span className="w-3">{5 - i}★</span>
                                            <div className="flex-1 h-2 bg-gray-200 border border-black rounded-full overflow-hidden">
                                                <div className="h-full bg-black" style={{ width: `${pct}%` }}></div>
                                            </div>
                                            <span className="w-6 text-right">{pct}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sidebar (Conditional) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            {!selectedProviderId ? (
                                <div className="bg-gray-100 border-4 border-black p-6">
                                    <h3 className="font-black text-xl mb-4 uppercase">Available Providers</h3>
                                    <p className="text-sm text-gray-500 mb-4 font-bold">Select a provider to continue booking</p>

                                    <div className="space-y-4">
                                        {providers.map(provider => (
                                            <div key={provider.id} className="bg-white border-2 border-black p-4 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gray-200 border-2 border-black flex items-center justify-center font-black">
                                                            {provider.businessName[0]}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold leading-tight">{provider.businessName}</div>
                                                            <div className="text-xs text-gray-500 font-bold uppercase">Cleaning</div>
                                                        </div>
                                                    </div>
                                                    <div className="bg-black text-white text-xs px-1.5 py-0.5 font-bold flex gap-1">
                                                        ★ {provider.rating}
                                                    </div>
                                                </div>

                                                <div className="text-xs text-green-600 font-bold mb-3 flex gap-3">
                                                    <span>✔ 324 jobs done</span>
                                                    <span>📍 {provider.address || 'Nearby'}</span>
                                                </div>

                                                <div className="text-xs italic bg-gray-50 p-2 border border-gray-200 mb-4 text-gray-500">
                                                    "Great work, very professional..."
                                                </div>

                                                <Button
                                                    className="w-full bg-white text-black border-2 border-black hover:bg-black hover:text-white font-bold uppercase text-xs"
                                                    onClick={() => handleProviderSelect(provider.id)}
                                                >
                                                    Select Provider
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                // Show Booking Widget when provider is selected
                                <div className="space-y-4">
                                    <div className="bg-black text-white p-3 font-bold text-sm uppercase flex justify-between items-center">
                                        <span>Selected Provider</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-white hover:text-gray-300 h-auto p-0"
                                            onClick={() => setSelectedProviderId(null)}
                                        >
                                            Change
                                        </Button>
                                    </div>
                                    <BookingWidget
                                        serviceName={service.name}
                                        serviceDuration={String(service.duration)}
                                        providerName={selectedProvider?.businessName || 'Provider'}
                                        price={Number(service.price)}
                                        onBack={() => setSelectedProviderId(null)}
                                        onConfirm={async (details) => {
                                            if (!user) {
                                                const currentPath = window.location.pathname;
                                                router.push(`/login?redirect=${currentPath}`);
                                                return;
                                            }

                                            try {
                                                // Combine date and time to ISO string
                                                const dateTimeStr = `${details.date} ${details.time}`;
                                                const bookingDate = new Date(dateTimeStr).toISOString();

                                                await authFetch('bookings', {
                                                    method: 'POST',
                                                    body: JSON.stringify({
                                                        providerId: selectedProviderId,
                                                        serviceId: service.id,
                                                        date: bookingDate,
                                                        customerName: details.name,
                                                        customerEmail: details.email || user.email || 'no-email@test.com',
                                                        customerPhone: details.phone,
                                                        address: details.address,
                                                    }),
                                                });

                                                alert('Booking Confirmed & Saved!');
                                                router.push('/dashboard'); // Redirect to dashboard
                                            } catch (error: any) {
                                                console.error('Booking error:', error);
                                                alert('An error occurred while saving the booking: ' + error.message);
                                            }
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </main>
        </div >
    );
}
