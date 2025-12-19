'use client';

import { useBookingStore } from '@/store/booking-store';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import StepSchedule from './StepSchedule';
import StepDetails from './StepDetails';
import StepConfirm from './StepConfirm';
import StepSuccess from './StepSuccess';


import { Check } from 'lucide-react';

interface Service {
    id: string;
    name: string;
    description: string;
    price: string;
    duration: number;
    categoryId: string;
}

interface Provider {
    id: string;
    userId: string;
    businessName: string;
    bio: string;
    rating: string;
    experience: number;
}

export default function BookingWizard({ service, provider, onClose }: { service: Service, provider: Provider, onClose: () => void }) {
    const { step, setStep, isSuccess } = useBookingStore();

    // If success, show success screen only
    if (isSuccess) {
        return <StepSuccess service={service} provider={provider} />;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-black uppercase">Complete your booking</h1>
                <Button variant="ghost" onClick={onClose} className="font-bold hover:bg-transparent">CLOSE ✕</Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2">
                    {/* Progress Bar / Tabs */}
                    <div className="flex border-4 border-black mb-8 bg-white">
                        {['Schedule', 'Details', 'Confirm'].map((label, idx) => {
                            const stepNum = idx + 1;
                            const isActive = step === stepNum;
                            return (
                                <div
                                    key={label}
                                    className={cn(
                                        "flex-1 py-3 text-center font-black uppercase text-sm border-r-2 border-black last:border-r-0 flex items-center justify-center gap-2",
                                        isActive ? "bg-black text-white" : "text-gray-400 bg-gray-50"
                                    )}
                                >
                                    <span className={cn(
                                        "w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs",
                                        isActive ? "border-white" : "border-gray-400"
                                    )}>
                                        {stepNum}
                                    </span>
                                    {label}
                                </div>
                            );
                        })}
                    </div>

                    {/* Step Content */}
                    <div className="border-4 border-black p-8 bg-white min-h-[400px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        {step === 1 && <StepSchedule />}
                        {step === 2 && <StepDetails />}
                        {step === 3 && <StepConfirm service={service} provider={provider} />}
                    </div>
                </div>

                {/* Right Sidebar: Summary */}
                <div className="lg:col-span-1">
                    <div className="border-4 border-black p-6 bg-white sticky top-4">
                        <div className="flex items-center gap-4 mb-6 border-b-2 border-black pb-4">
                            <div className="w-12 h-12 bg-gray-200 border-2 border-black flex items-center justify-center font-black text-xl">
                                {provider?.businessName?.[0]}
                            </div>
                            <div>
                                <div className="text-xs font-bold text-gray-500 uppercase">Selected Provider</div>
                                <div className="font-black">{provider?.businessName}</div>
                                <div className="text-xs font-bold">★ {provider?.rating}</div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <div className="text-xs font-bold text-gray-500 uppercase">Service</div>
                                <div className="font-bold">{service?.name}</div>
                            </div>
                            <div>
                                <div className="text-xs font-bold text-gray-500 uppercase">Duration</div>
                                <div className="font-bold">{service?.duration} Hours</div>
                            </div>
                            <div className="pt-4 border-t-2 border-black flex justify-between items-center text-xl font-black">
                                <span>Total</span>
                                <span>₹{service?.price}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
