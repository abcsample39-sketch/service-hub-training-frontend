'use client';
import { useEffect, useState } from 'react';
import { User, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function ProvidersPage() {
    const [providers, setProviders] = useState<any[]>([]);

    const fetchProviders = () => {
        fetch('http://localhost:3001/admin/providers')
            .then(res => res.json())
            .then(data => setProviders(data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchProviders();
    }, []);

    const toggleStatus = async (providerId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'APPROVED' ? 'INACTIVE' : 'APPROVED';
        try {
            const res = await fetch(`http://localhost:3001/admin/providers/${providerId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) fetchProviders();
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h1 className="text-3xl font-black uppercase mb-6">Providers Management</h1>
            <table className="w-full text-left">
                <thead className="border-b-4 border-black">
                    <tr>
                        <th className="py-4 font-black uppercase">Provider</th>
                        <th className="py-4 font-black uppercase">Contact</th>
                        <th className="py-4 font-black uppercase">Rating</th>
                        <th className="py-4 font-black uppercase">Experience</th>
                        <th className="py-4 font-black uppercase">Status</th>
                        <th className="py-4 font-black uppercase text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {providers.map((p) => {
                        const isActive = p.status === 'APPROVED';
                        return (
                            <tr key={p.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                <td className="py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 border-2 border-black flex items-center justify-center bg-gray-50 font-bold shrink-0">
                                            {p.businessName?.[0] || 'P'}
                                        </div>
                                        <div>
                                            <div className="font-bold">{p.businessName || p.user?.name}</div>
                                            <div className="text-xs text-gray-500 font-medium">{p.user?.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 font-medium text-gray-600">{p.user?.phoneNumber || 'N/A'}</td>
                                <td className="py-4">
                                    <div className="flex items-center gap-1 font-bold">
                                        <Star className="w-4 h-4 fill-black" /> {p.rating}
                                    </div>
                                </td>
                                <td className="py-4 font-medium">{p.experience} years</td>
                                <td className="py-4">
                                    <Badge variant="outline" className={`border-2 rounded-full uppercase font-bold text-[10px] ${isActive ? 'bg-green-100 text-green-600 border-green-200' : 'bg-red-100 text-red-600 border-red-200'}`}>
                                        {isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                </td>
                                <td className="py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="outline" size="sm" className="border-2 border-black font-bold uppercase hover:bg-gray-100">
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={() => toggleStatus(p.id, p.status)}
                                            className={`border-2 border-black font-bold uppercase text-white ${isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-black hover:bg-gray-800'}`}
                                        >
                                            {isActive ? 'Deactivate' : 'Activate'}
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
