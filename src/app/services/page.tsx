'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { apiFetch, apiUrl } from '@/lib/api';
import type { Service, Category } from '@/types';

// Types imported from @/types

function ServicesContent() {
    const [services, setServices] = useState<Service[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    // URL state
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const searchTerm = searchParams.get('search') || '';
    const activeCategory = searchParams.get('categoryId') || '';

    // Debounced search state
    const [localSearch, setLocalSearch] = useState(searchTerm);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await apiFetch<Category[]>('services/categories');
                setCategories(data);
            } catch (err) {
                console.error("Failed to load categories", err);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        setLoading(true);
        const fetchServices = async () => {
            try {
                const params = new URLSearchParams();
                if (searchTerm) params.append('search', searchTerm);
                if (activeCategory) params.append('categoryId', activeCategory);

                const data = await apiFetch<Service[]>(`services?${params.toString()}`);
                setServices(data);
            } catch (err) {
                console.error("Failed to load services", err);
            } finally {
                setLoading(false);
            }
        };

        // Simple debounce for search
        const timeoutId = setTimeout(fetchServices, 300);
        return () => clearTimeout(timeoutId);
    }, [searchTerm, activeCategory]);

    const updateFilters = (key: 'search' | 'categoryId', value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <main className="flex-grow">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Our Services</h1>
                        <p className="text-gray-500 font-medium">Professional services for your every need</p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder="Search services..."
                            className="w-full h-12 border-2 border-black pl-10 pr-4 font-bold text-sm focus:outline-none focus:ring-4 focus:ring-black/10 transition-all placeholder:text-gray-400"
                            value={localSearch}
                            onChange={(e) => {
                                setLocalSearch(e.target.value);
                                updateFilters('search', e.target.value);
                            }}
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap gap-2 mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => updateFilters('categoryId', '')}
                        className={cn(
                            "rounded-full border-2 border-transparent uppercase font-bold text-xs hover:bg-transparent hover:border-black",
                            !activeCategory ? "bg-black text-white hover:bg-black hover:text-white" : "bg-white text-gray-600 border-gray-200"
                        )}
                    >
                        All Categories
                    </Button>
                    {categories.map(cat => (
                        <Button
                            key={cat.id}
                            variant="ghost"
                            onClick={() => updateFilters('categoryId', cat.id)}
                            className={cn(
                                "rounded-full border-2 border-transparent uppercase font-bold text-xs hover:bg-transparent hover:border-black",
                                activeCategory === cat.id ? "bg-black text-white hover:bg-black hover:text-white" : "bg-white text-gray-600 border-gray-200"
                            )}
                        >
                            {cat.name}
                        </Button>
                    ))}
                </div>

                {/* Services Grid */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin w-8 h-8 border-4 border-black border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="font-bold uppercase text-gray-400">Loading Services...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map(service => (
                            <div key={service.id} className="group bg-white border-2 border-black p-0 flex flex-col hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
                                <div className="p-6 flex-grow space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="bg-gray-100 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-gray-600">
                                            {service.categoryName || 'Service'}
                                        </div>
                                        <div className="font-black text-xl">₹{service.price}</div>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold uppercase leading-tight mb-2 group-hover:underline decoration-2 underline-offset-4">
                                            {service.name}
                                        </h3>
                                        <p className="text-gray-500 text-sm line-clamp-3">
                                            {service.description || 'No description available for this service.'}
                                        </p>
                                    </div>

                                    <div className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-wide">
                                        <ClockIcon className="w-4 h-4 mr-1" />
                                        {service.duration} mins
                                    </div>
                                </div>

                                <div className="p-4 border-t-2 border-black bg-gray-50">
                                    <Link href={`/services/${service.id}`}>
                                        <Button className="w-full bg-black text-white rounded-none uppercase font-bold h-10 hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] transition-all">
                                            Book Now
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && services.length === 0 && (
                    <div className="text-center py-20 bg-white border-2 border-black border-dashed">
                        <p className="font-bold uppercase text-gray-400 text-lg">No services found matching your criteria.</p>
                        <Button
                            variant="link"
                            className="mt-2 text-black underline font-bold uppercase"
                            onClick={() => {
                                setLocalSearch('');
                                router.push(pathname);
                            }}
                        >
                            Clear Filters
                        </Button>
                    </div>
                )}
            </main>
        </div>
    );
}

function ClockIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    )
}

export default function ServicesPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-black border-t-transparent rounded-full"></div>
            </div>
        }>
            <ServicesContent />
        </Suspense>
    );
}
