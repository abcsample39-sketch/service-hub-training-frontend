import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface OnboardingState {
    // Step 1: Business Details
    businessName: string;
    address: string;
    experience: number;
    bio: string;

    // Step 2: Services
    selectedServices: string[]; // List of Service Category IDs or names

    // Actions
    setBusinessDetails: (details: Partial<OnboardingState>) => void;
    toggleService: (service: string) => void;
    reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
    persist(
        (set) => ({
            businessName: '',
            address: '',
            experience: 0,
            bio: '',
            selectedServices: [],

            setBusinessDetails: (details) => set((state) => ({ ...state, ...details })),

            toggleService: (service) =>
                set((state) => {
                    const exists = state.selectedServices.includes(service);
                    return {
                        selectedServices: exists
                            ? state.selectedServices.filter((s) => s !== service)
                            : [...state.selectedServices, service],
                    };
                }),

            reset: () => set({ businessName: '', address: '', experience: 0, bio: '', selectedServices: [] }),
        }),
        {
            name: 'provider-onboarding-storage',
        }
    )
);
