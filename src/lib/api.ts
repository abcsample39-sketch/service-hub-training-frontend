/**
 * API Configuration
 * Centralized API URL management for the application
 */

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Helper function to build API endpoints
 */
export function apiUrl(path: string): string {
    // Remove leading slash if present to avoid double slashes
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${API_URL}/${cleanPath}`;
}

/**
 * Fetch wrapper with common configuration
 */
export async function apiFetch<T>(
    path: string,
    options?: RequestInit
): Promise<T> {
    const url = apiUrl(path);
    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
}

/**
 * Authenticated fetch wrapper
 */
export async function authFetch<T>(
    path: string,
    options?: RequestInit
): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    return apiFetch<T>(path, {
        ...options,
        headers: {
            ...options?.headers,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });
}
