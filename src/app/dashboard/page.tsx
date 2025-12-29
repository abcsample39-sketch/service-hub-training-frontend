'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useChatStore } from '@/store/chat-store';
import { ChatOverlay } from '@/components/chat/ChatOverlay';
import { format } from 'date-fns';
import { MessageSquare, Calendar, Clock, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { API_URL } from '@/lib/api';

import { useAuth } from '@/context/AuthContext';

export default function CustomerDashboard() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
    const [bookings, setBookings] = useState<any[]>([]);
    const { openChat } = useChatStore();

    useEffect(() => {
        if (user?.id) {
            fetch(`${API_URL}/bookings/customer/${user.id}`)
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        setBookings(data);
                    } else {
                        console.error('API did not return an array:', data);
                        setBookings([]);
                    }
                })
                .catch(err => console.error(err));
        }
    }, [user?.id]);

    const openBookingChat = (booking: any) => {
        if (user?.id) {
            openChat(booking.id, { id: user.id, name: user.name || 'Current User' });
        }
    };

    const filteredBookings = Array.isArray(bookings) ? bookings.filter(b => {
        if (activeTab === 'upcoming') return ['Pending', 'Accepted', 'InProgress'].includes(b.status);
        if (activeTab === 'completed') return ['Completed'].includes(b.status);
        if (activeTab === 'cancelled') return ['Cancelled', 'Rejected'].includes(b.status);
        return false;
    }) : [];

    return (
        <div className="min-h-screen bg-gray-50 text-black font-sans pb-20">
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-black mb-1">My Bookings</h1>
                        <p className="text-gray-500 font-bold">Track and manage your service bookings</p>
                    </div>
                    <Button className="bg-black text-white font-bold uppercase border-2 border-black hover:bg-gray-800 px-6 py-6">
                        Book New Service
                    </Button>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-4 border-4 border-black bg-white mb-8">
                    <div className="p-6 border-r-2 border-black text-center">
                        <div className="text-3xl font-black">{bookings.length}</div>
                        <div className="text-xs text-gray-500 font-bold uppercase">Total Bookings</div>
                    </div>
                    <div className="p-6 border-r-2 border-black text-center">
                        <div className="text-3xl font-black">{bookings.filter(b => ['Pending', 'Accepted', 'InProgress'].includes(b.status)).length}</div>
                        <div className="text-xs text-gray-500 font-bold uppercase">Upcoming</div>
                    </div>
                    <div className="p-6 border-r-2 border-black text-center">
                        <div className="text-3xl font-black">{bookings.filter(b => b.status === 'Completed').length}</div>
                        <div className="text-xs text-gray-500 font-bold uppercase">Completed</div>
                    </div>
                    <div className="p-6 text-center">
                        <div className="text-3xl font-black">{bookings.filter(b => ['Cancelled', 'Rejected'].includes(b.status)).length}</div>
                        <div className="text-xs text-gray-500 font-bold uppercase">Cancelled</div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex mb-6">
                    {['upcoming', 'completed', 'cancelled'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as 'upcoming' | 'completed' | 'cancelled')}
                            className={`px-8 py-3 border-2 border-black mr-[-2px] font-black uppercase text-sm ${activeTab === tab ? 'bg-black text-white z-10' : 'bg-white text-black hover:bg-gray-100'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredBookings.map(booking => (
                        <div key={booking.id} className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <div className="flex justify-between items-start mb-4 border-b-2 border-gray-100 pb-4">
                                <div>
                                    <div className="text-xs font-bold text-gray-400 mb-1">#{booking.id.slice(0, 4)}</div>
                                    <h3 className="text-xl font-black uppercase">{booking.service?.name}</h3>
                                </div>
                                <Badge variant="outline" className="border-2 border-black rounded-full px-3 uppercase font-bold">
                                    {booking.status}
                                </Badge>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-5 h-5 text-gray-400" />
                                    <span className="font-bold">{format(new Date(booking.date), 'EEEE d MMMM, yyyy')}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Clock className="w-5 h-5 text-gray-400" />
                                    <span className="font-bold">{format(new Date(booking.date), 'h:mm a')}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <MapPin className="w-5 h-5 text-gray-400" />
                                    <span className="font-medium text-gray-600 truncate">{booking.address}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t-2 border-black">
                                <div className="text-xl font-black">₹{booking.service?.price}</div>
                                <div className="flex gap-2">
                                    {booking.status === 'Pending' && (
                                        <Button variant="outline" className="border-2 border-black font-bold uppercase hover:bg-red-50 text-red-500 hover:text-red-600">
                                            Cancel
                                        </Button>
                                    )}
                                    <Button onClick={() => openBookingChat(booking)} variant="outline" className="border-2 border-black font-bold uppercase hover:bg-gray-50">
                                        <MessageSquare className="w-4 h-4 mr-2" /> Chat
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Global Chat Overlay */}
            <ChatOverlay />
        </div>
    );
}
