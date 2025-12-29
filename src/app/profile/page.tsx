'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, MapPin, Plus, Mail, Phone } from 'lucide-react';
import { authFetch } from '@/lib/api';
import type { Address } from '@/types';

export default function ProfilePage() {
    const { user, loading: authLoading, logout } = useAuth();
    const router = useRouter();

    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newAddress, setNewAddress] = useState({ label: '', address: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
            return;
        }

        const fetchAddresses = async () => {
            try {
                const data = await authFetch<Address[]>('users/addresses');
                setAddresses(data);
            } catch (err) {
                console.error('Failed to fetch addresses', err);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchAddresses();
    }, [user, authLoading, router]);

    const handleAddAddress = async () => {
        if (!newAddress.label || !newAddress.address) return;

        try {
            const saved = await authFetch<Address>('users/addresses', {
                method: 'POST',
                body: JSON.stringify(newAddress),
            });
            setAddresses([...addresses, saved]);
            setNewAddress({ label: '', address: '' });
            setIsAdding(false);
        } catch (err) {
            console.error('Failed to save address', err);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin w-8 h-8 border-4 border-black border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-black uppercase mb-8">My Profile</h1>

            {/* User Info Card */}
            <div className="border-4 border-black bg-white p-8 mb-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-start gap-6">
                    <div className="w-20 h-20 bg-gray-200 border-4 border-black flex items-center justify-center">
                        {user.photoURL ? (
                            <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-10 h-10 text-gray-400" />
                        )}
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-black uppercase mb-2">
                            {user.displayName || 'User'}
                        </h2>
                        <div className="space-y-2 text-gray-600">
                            {user.email && (
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    <span className="font-medium">{user.email}</span>
                                </div>
                            )}
                            {user.phoneNumber && (
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    <span className="font-medium">{user.phoneNumber}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <Button
                        onClick={logout}
                        variant="outline"
                        className="border-2 border-black font-bold uppercase"
                    >
                        Logout
                    </Button>
                </div>
            </div>

            {/* Addresses Section */}
            <div className="border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex justify-between items-center mb-6 border-b-2 border-black pb-4">
                    <h3 className="text-xl font-black uppercase">Saved Addresses</h3>
                    <Button
                        onClick={() => setIsAdding(!isAdding)}
                        className="bg-black text-white font-bold uppercase text-xs"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add New
                    </Button>
                </div>

                {/* Add Address Form */}
                {isAdding && (
                    <div className="border-2 border-black p-6 mb-6 bg-gray-50">
                        <h4 className="font-bold uppercase mb-4">New Address</h4>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="label" className="text-xs font-bold uppercase">
                                    Label (Home, Work, etc.)
                                </Label>
                                <Input
                                    id="label"
                                    value={newAddress.label}
                                    onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                                    placeholder="Home"
                                    className="mt-1 border-black rounded-none"
                                />
                            </div>
                            <div>
                                <Label htmlFor="address" className="text-xs font-bold uppercase">
                                    Full Address
                                </Label>
                                <Input
                                    id="address"
                                    value={newAddress.address}
                                    onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                                    placeholder="123 Main St, City, State, ZIP"
                                    className="mt-1 border-black rounded-none"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    onClick={handleAddAddress}
                                    className="bg-black text-white font-bold uppercase"
                                >
                                    Save Address
                                </Button>
                                <Button
                                    onClick={() => setIsAdding(false)}
                                    variant="outline"
                                    className="border-black font-bold uppercase"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Address List */}
                <div className="space-y-4">
                    {addresses.length === 0 && !isAdding && (
                        <p className="text-gray-500 font-medium italic">No addresses saved yet.</p>
                    )}
                    {addresses.map((addr) => (
                        <div
                            key={addr.id}
                            className="flex justify-between items-start p-4 border-2 border-gray-100 hover:border-black transition-colors group"
                        >
                            <div className="flex gap-3">
                                <MapPin className="w-5 h-5 mt-1" />
                                <div>
                                    <div className="font-bold uppercase text-sm mb-1">{addr.label}</div>
                                    <div className="text-gray-600">{addr.address}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
