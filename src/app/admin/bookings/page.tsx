'use client';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { API_URL } from '@/lib/api';

interface AdminBooking {
    id: string;
    status: string;
    date: string | Date;
    service?: { name: string; price: string };
    customerName?: string;
    customer?: { name: string };
}

export default function BookingsPage() {
    const [bookings, setBookings] = useState<AdminBooking[]>([]);

    useEffect(() => {
        fetch(`${API_URL}/admin/bookings`)
            .then(res => res.json())
            .then(data => setBookings(data))
            .catch(err => console.error(err));
    }, []);

    const getStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case 'PENDING': return 'bg-orange-100 text-orange-600 border-orange-200';
            case 'ACCEPTED': return 'bg-blue-100 text-blue-600 border-blue-200';
            case 'COMPLETED': return 'bg-green-100 text-green-600 border-green-200';
            case 'INPROGRESS': return 'bg-purple-100 text-purple-600 border-purple-200';
            case 'CANCELLED': return 'bg-red-100 text-red-600 border-red-200';
            default: return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    return (
        <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <table className="w-full text-left">
                <thead className="border-b-4 border-black">
                    <tr>
                        <th className="py-4 font-black uppercase">ID</th>
                        <th className="py-4 font-black uppercase">Service</th>
                        <th className="py-4 font-black uppercase">Customer</th>
                        <th className="py-4 font-black uppercase">Date</th>
                        <th className="py-4 font-black uppercase">Status</th>
                        <th className="py-4 font-black uppercase">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((booking) => (
                        <tr key={booking.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                            <td className="py-4 font-bold text-gray-500">#{booking.id.slice(0, 4)}</td>
                            <td className="py-4 font-bold">{booking.service?.name}</td>
                            <td className="py-4">{booking.customerName || booking.customer?.name}</td>
                            <td className="py-4 font-medium text-gray-600">
                                {new Date(booking.date).toLocaleDateString()}
                            </td>
                            <td className="py-4">
                                <Badge variant="outline" className={`border-2 rounded-full uppercase font-bold text-[10px] ${getStatusColor(booking.status)}`}>
                                    {booking.status}
                                </Badge>
                            </td>
                            <td className="py-4 font-black">₹{booking.service?.price}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
