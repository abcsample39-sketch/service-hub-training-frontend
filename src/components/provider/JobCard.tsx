'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Clock, User, Phone, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

interface JobCardProps {
    booking: {
        id: string;
        status: string;
        date: string | Date;
        customerName?: string;
        customerAddress?: string;
        customerPhone?: string;
        service?: { name: string; price: string };
        price?: string;
    };
    onAction: (action: string, bookingId: string) => void;
}

export function JobCard({ booking, onAction }: JobCardProps) {
    const { status, date, customerName, customerAddress, customerPhone, service, price } = booking;

    // Status Badge Logic
    const getStatusColor = (s: string) => {
        switch (s) {
            case 'Pending': return 'bg-yellow-300 text-black border-black';
            case 'Accepted': return 'bg-blue-300 text-black border-black';
            case 'InProgress': return 'bg-purple-300 text-black border-black';
            case 'Completed': return 'bg-green-300 text-black border-black';
            case 'Rejected': return 'bg-red-300 text-black border-black';
            case 'Cancelled': return 'bg-gray-300 text-black border-black';
            default: return 'bg-white text-black border-black';
        }
    };

    return (
        <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-6 transition-all hover:translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex justify-between items-start mb-4 border-b-2 border-black pb-4">
                <div>
                    <div className="text-xs font-bold text-gray-500 uppercase mb-1">#{booking.id.slice(0, 4)}</div>
                    <h3 className="text-xl font-black uppercase">{service?.name || 'Service'}</h3>
                </div>
                <Badge className={`rounded-full border-2 font-bold px-3 uppercase ${getStatusColor(status)}`}>
                    {status}
                </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5" />
                        <span className="font-bold">{format(new Date(date), 'EEEE d MMMM, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5" />
                        <span className="font-bold">{format(new Date(date), 'h:mm a')}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5" />
                        <span className="font-medium">{customerAddress || 'No Address Provided'}</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <User className="w-5 h-5" />
                        <span className="font-medium">{customerName || 'Customer'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5" />
                        <span className="font-medium">{customerPhone || 'No Phone'}</span>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t-2 border-black">
                <div className="text-2xl font-black">
                    ₹{price || service?.price || '0'}
                </div>

                <div className="flex gap-3">
                    <Button variant="outline" className="font-bold border-2 border-black hover:bg-gray-100 uppercase">
                        <MessageSquare className="w-4 h-4 mr-2" /> Chat
                    </Button>

                    {status === 'Pending' && (
                        <>
                            <Button
                                onClick={() => onAction('Rejected', booking.id)}
                                variant="destructive"
                                className="font-bold border-2 border-black uppercase text-white hover:bg-red-600 bg-red-500"
                            >
                                Reject
                            </Button>
                            <Button
                                onClick={() => onAction('Accepted', booking.id)}
                                className="font-bold border-2 border-black uppercase bg-black text-white hover:bg-gray-800"
                            >
                                Accept
                            </Button>
                        </>
                    )}

                    {status === 'Accepted' && (
                        <Button
                            onClick={() => onAction('InProgress', booking.id)}
                            className="font-bold border-2 border-black uppercase bg-black text-white hover:bg-gray-800"
                        >
                            Start Work
                        </Button>
                    )}

                    {status === 'InProgress' && (
                        <Button
                            onClick={() => onAction('Completed', booking.id)}
                            className="font-bold border-2 border-black uppercase bg-black text-white hover:bg-gray-800"
                        >
                            Mark Complete
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
