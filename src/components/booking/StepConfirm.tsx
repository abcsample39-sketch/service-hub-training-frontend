'use client';

import { useBookingStore } from '@/store/booking-store';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { API_URL } from '@/lib/api';

export default function StepConfirm({ service, provider }: { service: any, provider: any }) {
    const { customerDetails, selectedDate, selectedTimeSlot, setStep, setSuccess, providerId, serviceId } = useBookingStore();
    const [submitting, setSubmitting] = useState(false);

    const handleConfirm = async () => {
        setSubmitting(true);
        try {
            // Construct ISO date combining selected date and time slot (approximation for MVP)
            // Ideally we'd parse the time slot "09:00 AM" into hours/min
            const bookingDate = new Date(selectedDate!);
            const [time, period] = selectedTimeSlot!.split(' ');
            let [hours, mins] = time.split(':').map(Number);
            if (period === 'PM' && hours !== 12) hours += 12;
            if (period === 'AM' && hours === 12) hours = 0;
            bookingDate.setHours(hours, mins, 0, 0);

            const payload = {
                providerId: provider.id, // Or use providerId from store
                serviceId: service.id,   // Or use serviceId from store
                date: bookingDate.toISOString(),
                customerName: customerDetails?.name,
                customerEmail: customerDetails?.email,
                customerPhone: customerDetails?.phone,
                address: customerDetails?.address
            };

            const res = await fetch(`${API_URL}/bookings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const err = await res.json();
                alert('Booking failed: ' + (err.message || 'Unknown error'));
                return;
            }

            setSuccess(true);
        } catch (error) {
            console.error('Booking submission error:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <h3 className="font-black text-xl mb-6 uppercase border-b-2 border-black pb-2">3. Confirm Booking</h3>

            <div className="space-y-6">
                <div className="bg-gray-50 p-6 border-2 border-gray-200">
                    <h4 className="font-bold uppercase text-gray-500 mb-4 text-xs tracking-wider">Service Details</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="block font-black">{service.name}</span>
                            <span className="text-gray-500">{service.duration} hours</span>
                        </div>
                        <div>
                            <span className="block font-black">{provider.businessName}</span>
                            <span className="text-gray-500">Service Provider</span>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 p-6 border-2 border-gray-200">
                    <h4 className="font-bold uppercase text-gray-500 mb-4 text-xs tracking-wider">Schedule</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="block font-black">Date</span>
                            <span className="text-gray-500">{selectedDate?.toLocaleDateString()}</span>
                        </div>
                        <div>
                            <span className="block font-black">Time</span>
                            <span className="text-gray-500">{selectedTimeSlot}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 p-6 border-2 border-gray-200">
                    <h4 className="font-bold uppercase text-gray-500 mb-4 text-xs tracking-wider">Customer Details</h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-gray-500">Name</span>
                            <span className="font-bold">{customerDetails?.name}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-gray-500">Phone</span>
                            <span className="font-bold">{customerDetails?.phone}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-gray-500">Email</span>
                            <span className="font-bold">{customerDetails?.email}</span>
                        </div>
                        <div className="pt-2">
                            <span className="block text-gray-500 mb-1">Address</span>
                            <span className="font-bold block w-full">{customerDetails?.address}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-8 border-t-2 border-gray-200 flex gap-4">
                <Button
                    variant="outline"
                    className="flex-1 bg-white text-black font-bold uppercase h-12 border-2 border-black hover:bg-gray-100"
                    onClick={() => setStep(2)}
                    disabled={submitting}
                >
                    Edit Details
                </Button>
                <Button
                    className="flex-1 bg-black text-white font-bold uppercase h-12 hover:bg-green-600 transition-colors"
                    onClick={handleConfirm}
                    disabled={submitting}
                >
                    {submitting ? 'Confirming...' : `Pay ₹${service.price} & Book`}
                </Button>
            </div>
        </div>
    );
}
