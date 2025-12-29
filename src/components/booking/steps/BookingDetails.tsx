'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface BookingDetailsProps {
    name: string;
    setName: (val: string) => void;
    phone: string;
    setPhone: (val: string) => void;
    email: string;
    setEmail: (val: string) => void;
    address: string;
    setAddress: (val: string) => void;
    onBack: () => void;
    onContinue: () => void;
}

export function BookingDetails({ name, setName, phone, setPhone, email, setEmail, address, setAddress, onBack, onContinue }: BookingDetailsProps) {
    const isDetailsComplete = name && phone && address;

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase">Full Name</label>
                <input
                    type="text"
                    className="w-full border-2 border-black p-2 text-sm font-medium rounded-none focus:outline-none focus:ring-0"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase">Phone Number</label>
                <input
                    type="tel"
                    className="w-full border-2 border-black p-2 text-sm font-medium rounded-none focus:outline-none focus:ring-0"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase">Email (Optional)</label>
                <input
                    type="email"
                    className="w-full border-2 border-black p-2 text-sm font-medium rounded-none focus:outline-none focus:ring-0"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase">Service Address</label>
                <textarea
                    className="w-full border-2 border-black p-2 text-sm font-medium rounded-none focus:outline-none focus:ring-0 h-24 resize-none"
                    placeholder="Enter your complete address with landmark"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                ></textarea>
            </div>

            <div className="flex gap-2 pt-2">
                <Button onClick={onBack} variant="outline" className="flex-1 border-2 border-black rounded-none font-bold uppercase hover:bg-gray-100">
                    Back
                </Button>
                <Button
                    onClick={onContinue}
                    className={cn(
                        "flex-[2] font-bold uppercase rounded-none transition-colors",
                        !isDetailsComplete
                            ? "bg-gray-400 text-white cursor-not-allowed"
                            : "bg-black text-white hover:bg-gray-800"
                    )}
                    disabled={!isDetailsComplete}
                >
                    Review Booking
                </Button>
            </div>
        </div>
    );
}
