'use client';

import { useBookingStore } from '@/store/booking-store';
import { Button } from '@/components/ui/button';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { useState } from 'react';

const TIME_SLOTS = [
    '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '02:00 PM', '03:00 PM',
    '04:00 PM', '05:00 PM', '06:00 PM'
];

export default function StepSchedule() {
    const { selectedDate, selectedTimeSlot, setDate, setTimeSlot, setStep } = useBookingStore();

    // Custom styles for DayPicker to match Neo-brutalist theme
    const css = `
        .rdp { --rdp-cell-size: 40px; --rdp-accent-color: #000; --rdp-background-color: #e0e0e0; margin: 0; }
        .rdp-button:hover:not([disabled]) { border: 2px solid black; background-color: transparent; color: black; font-weight: bold; }
        .rdp-day_selected { background-color: black !important; color: white !important; font-weight: bold; border: 2px solid black; }
    `;

    const handleContinue = () => {
        if (selectedDate && selectedTimeSlot) {
            setStep(2);
        }
    };

    return (
        <div>
            <style>{css}</style>
            <h3 className="font-black text-xl mb-6 uppercase border-b-2 border-black pb-2">1. Select Date & Time</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <label className="block font-bold text-sm uppercase mb-4 text-gray-500">Select Date</label>
                    <div className="border-2 border-black p-4 inline-block bg-gray-50">
                        <DayPicker
                            mode="single"
                            selected={selectedDate || undefined}
                            onSelect={(date) => setDate(date || null)}
                            disabled={{ before: new Date() }}
                            showOutsideDays
                            modifiersClassNames={{ selected: 'rdp-day_selected' }}
                        />
                    </div>
                </div>

                <div>
                    <label className="block font-bold text-sm uppercase mb-4 text-gray-500">Select Time Slot</label>
                    <div className="grid grid-cols-3 gap-3">
                        {TIME_SLOTS.map(slot => (
                            <button
                                key={slot}
                                onClick={() => setTimeSlot(slot)}
                                className={`
                                    py-3 px-2 text-sm font-bold border-2 transition-all uppercase
                                    ${selectedTimeSlot === slot
                                        ? 'bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0)] translate-x-[2px] translate-y-[2px]'
                                        : 'bg-white text-gray-700 border-black hover:bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]'}
                                `}
                            >
                                {slot}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-8 border-t-2 border-gray-200">
                <Button
                    className="w-full bg-gray-600 text-white font-bold uppercase h-12 hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!selectedDate || !selectedTimeSlot}
                    onClick={handleContinue}
                >
                    Continue to Details
                </Button>
            </div>
        </div>
    );
}
