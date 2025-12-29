import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { apiFetch, authFetch } from '@/lib/api';
import { X, Check } from 'lucide-react';

interface Service {
    id: string;
    name: string;
    description?: string;
    price: string;
    duration: number;
    categoryName?: string;
}

interface AddServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function AddServiceModal({ isOpen, onClose, onSuccess }: AddServiceModalProps) {
    const [loading, setLoading] = useState(false);
    const [availableServices, setAvailableServices] = useState<Service[]>([]);
    const [selectedServiceId, setSelectedServiceId] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchServices();
        }
    }, [isOpen]);

    const fetchServices = async () => {
        try {
            const data = await apiFetch<Service[]>('services');
            setAvailableServices(data);
            if (data.length > 0) setSelectedServiceId(data[0].id);
        } catch (error) {
            console.error('Failed to fetch services', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await authFetch('providers/services', {
                method: 'POST',
                body: JSON.stringify({ serviceId: selectedServiceId }),
            });
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error adding service:', error);
            alert('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-md">
                <div className="flex justify-between items-center p-6 border-b-4 border-black bg-yellow-300">
                    <h2 className="text-2xl font-black uppercase">Subscribe to Service</h2>
                    <button onClick={onClose} className="hover:bg-black/10 p-1 rounded">
                        <X className="w-6 h-6 border-2 border-black bg-white" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-4">
                        <Label htmlFor="service" className="font-bold uppercase text-lg">Select a Service to Offer</Label>
                        <p className="text-sm text-gray-500 font-bold -mt-2">Choose from the catalog of verified services.</p>

                        <div className="grid gap-3 max-h-[300px] overflow-y-auto pr-2">
                            {availableServices.map(service => (
                                <div
                                    key={service.id}
                                    className={`
                                        cursor-pointer p-4 border-4 transition-all
                                        ${selectedServiceId === service.id
                                            ? 'border-black bg-yellow-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                                            : 'border-gray-200 hover:border-black hover:bg-gray-50'
                                        }
                                    `}
                                    onClick={() => setSelectedServiceId(service.id)}
                                >
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-black uppercase">{service.name}</h3>
                                        {selectedServiceId === service.id && <Check className="w-5 h-5" />}
                                    </div>
                                    <div className="flex justify-between mt-2 text-sm font-bold text-gray-500">
                                        <span>{service.categoryName || 'General'}</span>
                                        <span>₹{service.price}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-2">
                        <Button
                            type="submit"
                            disabled={loading || !selectedServiceId}
                            className="w-full bg-black text-white hover:bg-black/80 border-4 border-black rounded-none h-12 text-lg font-black uppercase shadow-[4px_4px_0px_0px_rgba(128,128,128,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
                        >
                            {loading ? 'Adding...' : 'Add to My Services'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
