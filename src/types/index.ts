/**
 * Shared TypeScript Types
 * Centralized type definitions for the application
 */

// ============================================
// User Types
// ============================================

export type UserRole = 'Customer' | 'Provider' | 'Admin';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    phoneNumber?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface AuthUser extends User {
    displayName?: string;
    photoURL?: string;
}

// ============================================
// Service Types
// ============================================

export interface Category {
    id: string;
    name: string;
    description?: string;
}

export interface Service {
    id: string;
    name: string;
    description: string;
    price: string;
    duration: number;
    categoryId: string;
    categoryName?: string;
}

// ============================================
// Provider Types
// ============================================

export interface ProviderProfile {
    id: string;
    userId: string;
    businessName: string;
    bio: string;
    rating: string;
    experience: number;
    address?: string;
    status?: 'Pending' | 'Approved' | 'Rejected';
}

export interface ProviderApplication {
    id: string;
    userId: string;
    businessName: string;
    address: string;
    experience: number;
    services: string[];
    status: 'Pending' | 'Approved' | 'Rejected';
    createdAt: string;
    user?: User;
}

// ============================================
// Booking Types
// ============================================

export type BookingStatus =
    | 'Pending'
    | 'Accepted'
    | 'Rejected'
    | 'InProgress'
    | 'Completed'
    | 'Cancelled';

export interface Booking {
    id: string;
    customerId: string;
    providerId: string;
    serviceId: string;
    date: string;
    time?: string;
    address: string;
    notes?: string;
    status: BookingStatus;
    createdAt?: string;
    updatedAt?: string;
    service?: Service;
    provider?: ProviderProfile;
    customer?: User;
}

// ============================================
// Address Types
// ============================================

export interface Address {
    id: string;
    userId: string;
    label: string;
    address: string;
    isDefault?: boolean;
}

// ============================================
// Chat Types
// ============================================

export interface Message {
    id: string;
    senderId: string;
    bookingId: string;
    message: string;
    createdAt: string;
}

// ============================================
// Admin Dashboard Types
// ============================================

export interface AdminDashboardStats {
    totalBookings: number;
    completedBookings: number;
    activeProviders: number;
    pendingApps: number;
    revenue?: number;
}
