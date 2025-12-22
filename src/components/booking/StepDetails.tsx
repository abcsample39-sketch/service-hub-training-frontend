'use client';

import { useBookingStore } from '@/store/booking-store';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import { API_URL } from '@/lib/api';

const schema = z.object({
    name: z.string().min(2, "Name is required"),
    phone: z.string().min(10, "Valid phone number is required"),
    email: z.string().email("Valid email is required"),
    address: z.string().min(10, "Full address is required"),
});

type FormData = z.infer<typeof schema>;

interface SavedAddress {
    id: string;
    label: string;
    address: string;
}

export default function StepDetails() {
    const { customerDetails, setCustomerDetails, setStep } = useBookingStore();
    const { user } = useAuth();
    const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: customerDetails || {
            name: user?.displayName || '',
            phone: '',
            email: user?.email || '',
            address: ''
        }
    });

    // Fetch addresses if user is logged in
    useEffect(() => {
        const fetchAddresses = async () => {
            if (!user) return;
            try {
                const token = await user.getIdToken();
                const res = await fetch(`${API_URL}/users/addresses`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setSavedAddresses(data);
                }
            } catch (e) {
                console.error("Failed to fetch addresses", e);
            }
        };

        fetchAddresses();
    }, [user]);

    // Pre-fill user details if available and not already set
    useEffect(() => {
        if (user && !customerDetails?.name) {
            setValue('name', user.displayName || '');
            setValue('email', user.email || '');
        }
    }, [user, setValue, customerDetails]);

    const handleAddressSelect = (addr: SavedAddress) => {
        setValue('address', addr.address);
        setSelectedAddressId(addr.id);
    };

    const onSubmit = (data: FormData) => {
        setCustomerDetails(data);
        setStep(3);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h3 className="font-black text-xl mb-6 uppercase border-b-2 border-black pb-2">2. Enter Details</h3>

            <div className="space-y-6 max-w-xl">
                {/* Saved Addresses Section */}
                {savedAddresses.length > 0 && (
                    <div className="bg-gray-50 border-2 border-black p-4 mb-6">
                        <label className="block font-bold text-sm uppercase mb-3">Select from Saved Addresses</label>
                        <div className="grid grid-cols-1 gap-3">
                            {savedAddresses.map((addr) => (
                                <div
                                    key={addr.id}
                                    onClick={() => handleAddressSelect(addr)}
                                    className={cn(
                                        "cursor-pointer border-2 p-3 flex items-start gap-3 transition-all hover:border-black",
                                        selectedAddressId === addr.id ? "border-black bg-black text-white" : "border-gray-200 bg-white"
                                    )}
                                >
                                    <MapPin className="w-5 h-5 mt-0.5 shrink-0" />
                                    <div>
                                        <div className="font-bold uppercase text-xs">{addr.label}</div>
                                        <div className="text-sm line-clamp-2">{addr.address}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div>
                    <label className="block font-bold text-sm uppercase mb-2">Full Name</label>
                    <input
                        {...register('name')}
                        className={cn("w-full h-12 border-2 border-black px-4 font-bold focus:outline-none focus:ring-4 focus:ring-black/10", errors.name && "border-red-500")}
                        placeholder="Enter your full name"
                    />
                    {errors.name && <p className="text-red-600 text-xs font-bold mt-1 uppercase">{errors.name.message}</p>}
                </div>

                <div>
                    <label className="block font-bold text-sm uppercase mb-2">Phone Number</label>
                    <input
                        {...register('phone')}
                        className={cn("w-full h-12 border-2 border-black px-4 font-bold focus:outline-none focus:ring-4 focus:ring-black/10", errors.phone && "border-red-500")}
                        placeholder="+91 98765 43210"
                    />
                    {errors.phone && <p className="text-red-600 text-xs font-bold mt-1 uppercase">{errors.phone.message}</p>}
                </div>

                <div>
                    <label className="block font-bold text-sm uppercase mb-2">Email (Optional)</label>
                    <input
                        {...register('email')}
                        className={cn("w-full h-12 border-2 border-black px-4 font-bold focus:outline-none focus:ring-4 focus:ring-black/10", errors.email && "border-red-500")}
                        placeholder="your@email.com"
                    />
                    {errors.email && <p className="text-red-600 text-xs font-bold mt-1 uppercase">{errors.email.message}</p>}
                </div>

                <div>
                    <label className="block font-bold text-sm uppercase mb-2">Service Address</label>
                    <textarea
                        {...register('address')}
                        className={cn("w-full h-32 border-2 border-black p-4 font-bold focus:outline-none focus:ring-4 focus:ring-black/10 resize-none", errors.address && "border-red-500")}
                        placeholder="Enter your complete address with landmark"
                    />
                    {errors.address && <p className="text-red-600 text-xs font-bold mt-1 uppercase">{errors.address.message}</p>}
                </div>
            </div>

            <div className="mt-8 pt-8 border-t-2 border-gray-200 flex gap-4">
                <Button
                    type="button"
                    variant="outline"
                    className="flex-1 bg-white text-black font-bold uppercase h-12 border-2 border-black hover:bg-gray-100"
                    onClick={() => setStep(1)}
                >
                    Back
                </Button>
                <Button
                    type="submit"
                    className="flex-1 bg-gray-600 text-white font-bold uppercase h-12 hover:bg-black"
                >
                    Review Booking
                </Button>
            </div>
        </form>
    );
}
