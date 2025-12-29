'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { BookingSchedule } from './steps/BookingSchedule';
import { BookingDetails } from './steps/BookingDetails';
import { BookingConfirm } from './steps/BookingConfirm';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { apiFetch } from '@/lib/api';

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_TYooMQauvdEDq54NiTphI7jx';
const stripePromise = loadStripe(stripeKey);

console.log(`🔑 Frontend Stripe key: ${stripeKey.startsWith('pk_test_') ? 'TEST' : 'LIVE'} mode`);
console.log(`Frontend Stripe account ID: ${stripeKey.substring(8, 32)}`);

interface BookingWidgetProps {
    serviceName: string;
    serviceDuration: string;
    providerName: string;
    price: number;
    onBack: () => void;
    onConfirm: (bookingDetails: any) => void;
}

export default function BookingWidget({ serviceName, serviceDuration, providerName, price, onBack, onConfirm }: BookingWidgetProps) {
    const [step, setStep] = useState(1);
    const [date, setDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');

    // Stripe State
    const [clientSecret, setClientSecret] = useState('');

    useEffect(() => {
        // Create PaymentIntent when user reaches Step 3 (or prepares to)
        // Optimization: Create it when entering Step 2 or just before 3
        if (step === 3 && !clientSecret) {
            apiFetch<{ clientSecret: string }>('payments/create-intent', {
                method: "POST",
                body: JSON.stringify({ amount: price }),
            })
                .then((data) => {
                    if (!data.clientSecret) {
                        console.error("No clientSecret in response:", data);
                        throw new Error("Invalid payment intent response");
                    }
                    setClientSecret(data.clientSecret);
                })
                .catch(err => {
                    console.error("Error creating payment intent:", err);
                    alert(`Failed to load payment system: ${err.message}. Please check console for details.`);
                });
        }
    }, [step, price, clientSecret]);

    const currentStepClass = (s: number) =>
        cn("flex-1 text-center py-2 text-xs font-bold border-b-2",
            step === s ? "border-black bg-black text-white" : "border-gray-200 text-gray-400 bg-gray-50"
        );

    // Booking Data Object
    const bookingDetails = {
        serviceName,
        serviceDuration,
        providerName,
        price,
        date,
        time: selectedTime,
        name,
        phone,
        email,
        address
    };

    return (
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex border-b-2 border-black">
                <div className={currentStepClass(1)}>1. Schedule</div>
                <div className={currentStepClass(2)}>2. Details</div>
                <div className={currentStepClass(3)}>3. Confirm</div>
            </div>

            <div className="p-6">
                {step === 1 && (
                    <BookingSchedule
                        date={date}
                        setDate={setDate}
                        selectedTime={selectedTime}
                        setSelectedTime={setSelectedTime}
                        onContinue={() => setStep(2)}
                        onBack={onBack}
                    />
                )}

                {step === 2 && (
                    <BookingDetails
                        name={name} setName={setName}
                        phone={phone} setPhone={setPhone}
                        email={email} setEmail={setEmail}
                        address={address} setAddress={setAddress}
                        onBack={() => setStep(1)}
                        onContinue={() => setStep(3)}
                    />
                )}

                {step === 3 && (
                    <>
                        {clientSecret ? (
                            <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                                <BookingConfirm
                                    {...bookingDetails}
                                    onBack={() => setStep(2)}
                                    onConfirm={() => onConfirm(bookingDetails)}
                                />
                            </Elements>
                        ) : (
                            <div className="flex justify-center items-center h-48">
                                <div className="text-gray-500 font-bold animate-pulse">Loading Payment...</div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
