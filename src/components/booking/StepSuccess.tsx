'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { useBookingStore } from '@/store/booking-store';

export default function StepSuccess({ service, provider }: { service: any, provider: any }) {
    const router = useRouter();
    const { customerDetails, selectedDate, selectedTimeSlot } = useBookingStore();

    return (
        <div className="container mx-auto px-4 py-12 flex justify-center">
            <div className="border-4 border-black bg-white p-12 max-w-2xl w-full text-center shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative">

                {/* Success Icon */}
                <div className="w-24 h-24 mx-auto mb-8 relative">
                    <div className="absolute inset-0 border-4 border-black rotate-45"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <CheckCircle2 className="w-12 h-12 text-green-600" />
                    </div>
                </div>

                <h2 className="text-3xl font-black uppercase mb-4">Booking Confirmed!</h2>

                <p className="text-gray-600 font-medium mb-8 leading-relaxed">
                    Your booking for <span className="font-bold text-black">{service.name}</span> with <span className="font-bold text-black">{provider.businessName}</span> has been confirmed for <span className="font-bold text-black">{selectedDate?.toLocaleDateString()} at {selectedTimeSlot}</span>.
                </p>

                <div className="space-y-4 max-w-xs mx-auto">
                    <Button
                        className="w-full h-12 bg-black text-white font-bold uppercase text-sm border-2 border-black hover:bg-gray-900"
                        onClick={() => router.push('/my-bookings')}
                    >
                        View My Bookings
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full h-12 bg-white text-black font-bold uppercase text-sm border-2 border-black hover:bg-gray-100"
                        onClick={() => router.push('/services')}
                    >
                        Book Another Service
                    </Button>
                </div>

                <div className="mt-8 pt-8 border-t-2 border-gray-100">
                    <p className="text-xs text-gray-400 font-bold uppercase">An email confirmation has been sent to {customerDetails?.email}</p>
                </div>
            </div>
        </div>
    );
}
