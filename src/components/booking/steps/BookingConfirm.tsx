'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface BookingConfirmProps {
    serviceName: string;
    serviceDuration: string;
    providerName: string;
    date: string;
    time: string;
    name: string;
    phone: string;
    address: string;
    price: number;
    email?: string;
    onBack: () => void;
    onConfirm: () => void;
}

export function BookingConfirm({
    serviceName, serviceDuration, providerName,
    date, time, name, phone, address, price,
    onBack, onConfirm
}: BookingConfirmProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [elementError, setElementError] = useState<string | null>(null);

    useEffect(() => {
        if (!stripe) {
            console.error("Stripe failed to load");
            setElementError("Stripe failed to load. Please check your internet connection and try again.");
        } else if (!elements) {
            console.error("Elements failed to load");
            setElementError("Payment elements failed to load. This may be due to browser tracking prevention features. Please try disabling tracking prevention for this site, or use a different browser like Chrome or Firefox.");
        } else {
            setElementError(null);
        }
    }, [stripe, elements]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) {
            setMessage("Payment system not ready. Please try again.");
            return;
        }

        setIsLoading(true);
        setMessage(null);

        try {
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {},
                redirect: "if_required",
            });

            if (error) {
                console.error("Payment confirmation error:", error);
                setMessage(error.message ?? "An unexpected error occurred.");
                setIsLoading(false);
            } else if (paymentIntent && paymentIntent.status === "succeeded") {
                setMessage("Payment successful!");
                onConfirm();
            } else {
                setMessage("Payment processing...");
                setIsLoading(false);
            }
        } catch (err) {
            console.error("Payment submission error:", err);
            setMessage("An error occurred during payment. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border border-black">
                <div className="bg-gray-100 p-4 border-b border-black">
                    <h3 className="font-bold text-lg">{serviceName}</h3>
                    <p className="text-gray-500 text-sm font-bold">{serviceDuration} hours</p>
                </div>
                <div className="p-4 space-y-4">
                    <div className="flex justify-between items-start border-b border-gray-100 pb-2">
                        <span className="text-gray-500 font-bold text-sm">Provider</span>
                        <div className="text-right">
                            <div className="font-bold">{providerName}</div>
                            <div className="text-xs text-gray-500">★ 4.8</div>
                        </div>
                    </div>
                    {/* Simplified for brevity - assume props passed are correct */}
                    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                        <span className="text-gray-500 font-bold text-sm">Date/Time</span>
                        <span className="font-bold">{date}, {time}</span>
                    </div>
                    <div className="border-b border-gray-100 pb-2">
                        <span className="text-gray-500 font-bold text-sm block mb-1">Details</span>
                        <p className="font-bold text-sm">{name} | {phone}</p>
                        <p className="font-bold text-sm">{address}</p>
                    </div>
                    <div className="flex justify-between items-center pt-2 bg-gray-100 -mx-4 -mb-4 p-4 border-t border-black mt-4">
                        <span className="font-bold text-lg">Total Amount</span>
                        <span className="font-black text-xl">₹{price}</span>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="bg-white border rounded-md p-4">
                    <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
                </div>
                {elementError && (
                    <Card className="border-red-500 bg-red-50 p-4">
                        <div className="text-red-700 text-sm font-bold">
                            Payment System Error: {elementError}
                        </div>
                    </Card>
                )}
                {message && <div className="text-red-500 text-sm font-bold">{message}</div>}
                <div className="flex gap-2 pt-2">
                    <Button type="button" onClick={onBack} variant="outline" className="flex-1 border-2 border-black rounded-none font-bold uppercase hover:bg-gray-100">
                        Back
                    </Button>
                    <Button disabled={isLoading || !stripe || !elements} type="submit" className="flex-[2] bg-black text-white font-bold uppercase rounded-none hover:bg-gray-800">
                        {isLoading ? "Processing..." : `Pay ₹${price}`}
                    </Button>
                </div>
            </div>
        </form>
    );
}
