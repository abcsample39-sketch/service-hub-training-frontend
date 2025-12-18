'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '@/store/useOnboardingStore';
import { getToken } from '@/lib/auth'; // Import auth util
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

const SERVICES_LIST = [
    'Cleaning', 'Plumbing', 'Electrical',
    'Salon & Spa', 'Carpentry', 'Painting',
    'Appliances', 'Gardening', 'Pest Control'
];

export default function ProviderOnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const {
        businessName, address, experience, selectedServices,
        setBusinessDetails, toggleService, reset
    } = useOnboardingStore();

    const handleNext = () => {
        if (step < 3) setStep(step + 1);
        else handleSubmit();
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = async () => {
        const token = getToken();
        if (!token) {
            alert("You must be logged in to submit an application.");
            router.push('/login');
            return;
        }

        try {
            const res = await fetch("http://localhost:3001/providers/onboarding", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    businessName,
                    address,
                    experience,
                    services: selectedServices,
                    bio: "" // Not collected in UI yet
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Submission failed");
            }

            // Success
            alert("Application Submitted Application! Pending Admin Approval.");
            reset();
            router.push('/provider/dashboard');
        } catch (err: any) {
            alert(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-white text-black py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">

            {/* Header / Title */}
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold uppercase tracking-tight mb-2">Become a Provider</h1>
                <p className="text-gray-500">Join our network and grow your business</p>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-2xl mb-12 flex items-center justify-between relative">
                <div className="absolute left-0 top-1/2 w-full h-0.5 bg-gray-200 -z-10"></div>
                <div className={cn("absolute left-0 top-1/2 h-0.5 bg-black -z-10 transition-all duration-300",
                    step === 1 ? "w-0" : step === 2 ? "w-1/2" : "w-full"
                )}></div>

                {[1, 2, 3].map((s) => (
                    <div key={s} className={cn(
                        "w-10 h-10 flex items-center justify-center border-2 bg-white font-bold transition-colors",
                        step >= s ? "border-black bg-black text-white" : "border-gray-200 text-gray-400"
                    )}>
                        {s}
                    </div>
                ))}
            </div>

            {/* Form Container */}
            <div className="w-full max-w-2xl border-2 border-black p-8 relative">

                {/* Step 1: Business Details */}
                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h2 className="text-xl font-bold uppercase border-b border-black pb-2 mb-6">Business Details</h2>

                        <div className="space-y-2">
                            <Label htmlFor="businessName">Business Name *</Label>
                            <Input
                                id="businessName"
                                value={businessName}
                                onChange={(e) => setBusinessDetails({ businessName: e.target.value })}
                                placeholder="My Services Co."
                                className="border-black focus-visible:ring-black rounded-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Address *</Label>
                            <Input
                                id="address"
                                value={address}
                                onChange={(e) => setBusinessDetails({ address: e.target.value })}
                                placeholder="Full address with pincode"
                                className="border-black focus-visible:ring-black rounded-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="experience">Years of Experience *</Label>
                            <Input
                                id="experience"
                                type="number"
                                value={experience}
                                onChange={(e) => setBusinessDetails({ experience: parseInt(e.target.value) || 0 })}
                                placeholder="e.g. 5"
                                className="border-black focus-visible:ring-black rounded-none"
                            />
                        </div>
                    </div>
                )}

                {/* Step 2: Services */}
                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h2 className="text-xl font-bold uppercase border-b border-black pb-2 mb-6">Select Services *</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {SERVICES_LIST.map((service) => (
                                <div
                                    key={service}
                                    onClick={() => toggleService(service)}
                                    className={cn(
                                        "flex items-center space-x-3 p-4 border cursor-pointer hover:bg-gray-50 transition-colors",
                                        selectedServices.includes(service) ? "border-black bg-black/5" : "border-gray-200"
                                    )}
                                >
                                    <div className={cn(
                                        "w-5 h-5 border flex items-center justify-center",
                                        selectedServices.includes(service) ? "border-black bg-black text-white" : "border-gray-300"
                                    )}>
                                        {selectedServices.includes(service) && <Check className="w-3 h-3" />}
                                    </div>
                                    <span className="font-medium">{service}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 3: Review */}
                {step === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h2 className="text-xl font-bold uppercase border-b border-black pb-2 mb-6">Review Application</h2>

                        <div className="space-y-4 text-sm">
                            <div className="grid grid-cols-3 gap-4 border-b border-gray-100 pb-4">
                                <span className="font-bold text-gray-500 uppercase">Business</span>
                                <span className="col-span-2 font-medium">{businessName}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-gray-100 pb-4">
                                <span className="font-bold text-gray-500 uppercase">Address</span>
                                <span className="col-span-2 font-medium">{address}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-gray-100 pb-4">
                                <span className="font-bold text-gray-500 uppercase">Experience</span>
                                <span className="col-span-2 font-medium">{experience} Years</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-gray-100 pb-4">
                                <span className="font-bold text-gray-500 uppercase">Services</span>
                                <div className="col-span-2 flex flex-wrap gap-2">
                                    {selectedServices.map(s => (
                                        <span key={s} className="px-2 py-1 bg-gray-100 text-xs uppercase font-bold tracking-wider">
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                    <Button
                        variant="outline"
                        onClick={handleBack}
                        disabled={step === 1}
                        className="w-32 border-black text-black hover:bg-gray-100 rounded-none uppercase font-bold tracking-wider"
                    >
                        Back
                    </Button>
                    <Button
                        onClick={handleNext}
                        disabled={step === 1 && (!businessName || !address)}
                        className="w-32 bg-black text-white hover:bg-gray-900 rounded-none uppercase font-bold tracking-wider"
                    >
                        {step === 3 ? 'Submit' : 'Next Step'}
                    </Button>
                </div>

            </div>
        </div>
    );
}
