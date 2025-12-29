'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface BookingScheduleProps {
    date: string;
    setDate: (date: string) => void;
    selectedTime: string;
    setSelectedTime: (time: string) => void;
    onContinue: () => void;
    onBack: () => void;
}

export function BookingSchedule({ date, setDate, selectedTime, setSelectedTime, onContinue, onBack }: BookingScheduleProps) {
    const timeSlots = [
        '9:00 AM', '10:00 AM', '11:00 AM',
        '12:00 PM', '2:00 PM', '3:00 PM',
        '4:00 PM', '5:00 PM', '6:00 PM'
    ];

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase">Select Date</label>
                <div className="relative">
                    <input
                        type="date"
                        className="w-full border-2 border-black p-2 pl-3 text-sm font-medium rounded-none focus:outline-none focus:ring-0"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold uppercase">Select Time Slot</label>
                <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => (
                        <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={cn(
                                "border-2 border-black py-2 text-xs font-bold transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none",
                                selectedTime === time
                                    ? "bg-black text-white"
                                    : "bg-white text-black hover:bg-gray-50"
                            )}
                        >
                            {time}
                        </button>
                    ))}
                </div>
            </div>

            <div className="pt-4 mt-4 border-t border-gray-100">
                <Button
                    className={cn(
                        "w-full font-bold uppercase rounded-none transition-colors",
                        !date || !selectedTime
                            ? "bg-gray-400 text-white cursor-not-allowed"
                            : "bg-black text-white hover:bg-gray-800"
                    )}
                    disabled={!date || !selectedTime}
                    onClick={onContinue}
                >
                    Continue
                </Button>
                <button
                    onClick={onBack}
                    className="w-full text-center text-xs text-gray-500 font-bold mt-3 hover:underline"
                >
                    ← Change Provider
                </button>
            </div>
        </div>
    );
}
