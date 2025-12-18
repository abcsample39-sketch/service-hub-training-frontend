'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';

const MOCK_SERVICES = [
    { id: 1, name: 'Deep Home Cleaning', category: 'Cleaning', price: '₹2499', rating: '4.8' },
    { id: 2, name: 'Bathroom Cleaning', category: 'Cleaning', price: '₹599', rating: '4.7' },
    { id: 3, name: 'Pipe Leak Repair', category: 'Plumbing', price: '₹799', rating: '4.9' },
    { id: 4, name: 'Toilet Installation', category: 'Plumbing', price: '₹1299', rating: '4.6' },
    { id: 5, name: 'Wiring & Electrical Work', category: 'Electrical', price: '₹999', rating: '4.8' },
];

export default function AdminServicesPage() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredServices = MOCK_SERVICES.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Actions Row */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Search services..."
                        className="pl-10 border-black rounded-none focus-visible:ring-black"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button className="bg-black text-white hover:bg-gray-800 rounded-none uppercase font-bold text-xs">
                    <Plus className="mr-2 h-4 w-4" /> Add Service
                </Button>
            </div>

            {/* Services Table */}
            <div className="border-2 border-black">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b-2 border-black font-bold text-sm uppercase">
                    <div className="col-span-4">Service</div>
                    <div className="col-span-3">Category</div>
                    <div className="col-span-2">Price</div>
                    <div className="col-span-1">Rating</div>
                    <div className="col-span-2 text-right">Actions</div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-gray-200">
                    {filteredServices.map((service) => (
                        <div key={service.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 transition-colors">
                            <div className="col-span-4 font-bold">{service.name}</div>
                            <div className="col-span-3">
                                <span className="px-3 py-1 rounded-full border border-black text-xs font-bold uppercase">
                                    {service.category}
                                </span>
                            </div>
                            <div className="col-span-2 font-medium">{service.price}</div>
                            <div className="col-span-1 flex items-center font-bold">
                                {service.rating} <span className="text-black ml-1">★</span>
                            </div>
                            <div className="col-span-2 flex justify-end gap-2">
                                <Button variant="outline" size="icon" className="h-8 w-8 border-black rounded-none hover:bg-gray-200">
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon" className="h-8 w-8 border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-none">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}

                    {filteredServices.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            No services found matching "{searchTerm}"
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
