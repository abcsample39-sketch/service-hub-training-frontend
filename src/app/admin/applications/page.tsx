'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check, X, FileText, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { getToken } from '@/lib/auth';

type ApplicationStatus = 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED'; // Updated casing to match backend enum

interface Application {
    id: string;
    businessName: string;
    email: string;
    phone: string;
    experience: number;
    address: string;
    appliedDate: string;
    services: string[];
    status: ApplicationStatus;
    rejectionReason?: string;
}

interface BackendApplication {
    id: string;
    businessName?: string;
    user: {
        name: string;
        email: string;
        phoneNumber?: string;
    };
    experience?: number;
    address?: string;
    status: ApplicationStatus;
    rejectionReason?: string;
}

export default function AdminApplicationsPage() {
    const [applications, setApplications] = useState<Application[]>([]);

    const fetchApplications = async () => {
        const token = getToken();
        if (!token) return;

        try {
            const res = await fetch("http://localhost:3001/admin/applications", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                // Map backend response to UI Application interface
                const mappedApps: Application[] = data.map((item: BackendApplication) => ({
                    id: item.id,
                    businessName: item.businessName || item.user.name, // Fallback
                    email: item.user.email,
                    phone: item.user.phoneNumber || 'N/A',
                    experience: item.experience || 0,
                    address: item.address || '',
                    appliedDate: new Date().toLocaleDateString(), // TODO: add createdAt to profile
                    services: [], // TODO: fetch services
                    status: item.status,
                    rejectionReason: item.rejectionReason
                }));
                setApplications(mappedApps);
            }
        } catch (error) {
            console.error("Failed to fetch applications", error);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const handleStatusUpdate = async (id: string, newStatus: ApplicationStatus) => {
        const token = getToken();
        if (!token) return;

        try {
            const res = await fetch(`http://localhost:3001/admin/applications/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                // Update UI optimistically or refetch
                setApplications(apps => apps.map(app =>
                    app.id === id ? { ...app, status: newStatus } : app
                ));
            }
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold uppercase tracking-tight">Provider Applications</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {applications.map((app) => (
                    <div key={app.id} className="bg-white border-2 border-black p-0 flex flex-col relative">
                        {/* Card Header */}
                        <div className="flex items-start justify-between p-6 border-b border-gray-100">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-xl">
                                    {app.businessName.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{app.businessName}</h3>
                                    <p className="text-xs text-gray-400 font-medium">Applied: {app.appliedDate}</p>
                                </div>
                            </div>

                            {app.status !== 'PENDING_APPROVAL' && (
                                <div className={cn(
                                    "px-3 py-1 text-xs font-bold uppercase tracking-wider text-white",
                                    app.status === 'APPROVED' ? "bg-black" : "bg-red-500"
                                )}>
                                    {app.status}
                                </div>
                            )}
                            {app.status === 'PENDING_APPROVAL' && (
                                <div className="px-3 py-1 text-xs font-bold uppercase tracking-wider border border-gray-300 text-gray-500">
                                    Pending
                                </div>
                            )}
                        </div>

                        {/* Card Body */}
                        <div className="p-6 space-y-4 flex-grow">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <Mail className="w-4 h-4" />
                                    <span className="truncate">{app.email}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <Phone className="w-4 h-4" />
                                    <span>{app.phone}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <Clock className="w-4 h-4" />
                                    <span>{app.experience} years experience</span>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <MapPin className="w-4 h-4" />
                                    <span className="truncate">{app.address}</span>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-bold uppercase text-gray-400 mb-2">Services:</p>
                                <div className="flex flex-wrap gap-2">
                                    {app.services.map(service => (
                                        <span key={service} className="px-2 py-1 border border-black text-xs font-bold uppercase bg-white">
                                            {service}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {app.status === 'REJECTED' && app.rejectionReason && (
                                <div className="bg-red-50 border border-red-100 p-3 text-red-600 text-sm mt-4">
                                    <span className="font-bold uppercase text-xs block mb-1">Rejection Reason:</span>
                                    {app.rejectionReason}
                                </div>
                            )}
                        </div>

                        {/* Card Actions */}
                        <div className="p-4 border-t-2 border-black bg-gray-50 flex items-center justify-between gap-3">
                            <Button variant="outline" className="flex-1 border-black rounded-none uppercase font-bold text-xs h-10 hover:bg-gray-200">
                                <FileText className="w-4 h-4 mr-2" /> More Details
                            </Button>

                            {app.status === 'PENDING_APPROVAL' && (
                                <>
                                    <Button
                                        onClick={() => handleStatusUpdate(app.id, 'APPROVED')}
                                        className="flex-1 bg-black text-white hover:bg-gray-800 rounded-none uppercase font-bold text-xs h-10"
                                    >
                                        <Check className="w-4 h-4 mr-2" /> Approve
                                    </Button>
                                    <Button
                                        onClick={() => handleStatusUpdate(app.id, 'REJECTED')}
                                        variant="outline"
                                        className="flex-1 border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-none uppercase font-bold text-xs h-10"
                                    >
                                        <X className="w-4 h-4 mr-2" /> Reject
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div >
    );
}
