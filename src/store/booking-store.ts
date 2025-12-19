import { create } from 'zustand';

interface BookingState {
    step: number;
    serviceId: string | null;
    providerId: string | null;
    selectedDate: Date | null;
    selectedTimeSlot: string | null;
    customerDetails: {
        name: string;
        email: string;
        phone: string;
        address: string;
    } | null;
    isSuccess: boolean;
}

interface BookingActions {
    setStep: (step: number) => void;
    setServiceId: (id: string) => void;
    setProviderId: (id: string) => void;
    setDate: (date: Date | null) => void;
    setTimeSlot: (time: string | null) => void;
    setCustomerDetails: (details: BookingState['customerDetails']) => void;
    setSuccess: (success: boolean) => void;
    reset: () => void;
}

const initialState: BookingState = {
    step: 1,
    serviceId: null,
    providerId: null,
    selectedDate: null,
    selectedTimeSlot: null,
    customerDetails: null,
    isSuccess: false,
};

export const useBookingStore = create<BookingState & BookingActions>((set) => ({
    ...initialState,
    setStep: (step) => set({ step }),
    setServiceId: (serviceId) => set({ serviceId }),
    setProviderId: (providerId) => set({ providerId }),
    setDate: (selectedDate) => set({ selectedDate }),
    setTimeSlot: (selectedTimeSlot) => set({ selectedTimeSlot }),
    setCustomerDetails: (customerDetails) => set({ customerDetails }),
    setSuccess: (isSuccess) => set({ isSuccess }),
    reset: () => set(initialState),
}));
