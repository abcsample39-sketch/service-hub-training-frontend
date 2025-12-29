'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { useRouter } from 'next/navigation';
import { User as AppUser } from '../types';
import { API_URL } from '../lib/api';

interface AuthContextType {
    user: AppUser | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signInWithGoogle: async () => { },
    login: async () => { },
    logout: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<AppUser | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check for custom auth token first
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            try {
                setUser(JSON.parse(storedUser));
                setLoading(false);
                return; // Skip firebase check if custom auth exists
            } catch (e) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }

        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const appUser: AppUser = {
                    id: currentUser.uid,
                    name: currentUser.displayName || '',
                    email: currentUser.email || '',
                    role: 'Customer', // Default role; should be synced with backend
                };
                setUser(appUser);
            } else {
                // Only set null if we didn't find a custom token (already handled above)
                if (!localStorage.getItem('token')) {
                    setUser(null);
                }
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Login failed');
            }

            const data = await res.json();
            // data = { access_token, user: { id, name, email, role } }

            localStorage.setItem('token', data.access_token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);

            // Redirect based on role
            if (data.user.role === 'Admin') router.push('/admin');
            else if (data.user.role === 'Provider') router.push('/provider/dashboard');
            else router.push('/dashboard');

        } catch (error) {
            console.error("Login Error:", error);
            throw error;
        }
    };

    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            router.push('/profile');
        } catch (error) {
            console.error("Error signing in with Google", error);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth); // Sign out of Firebase
            localStorage.removeItem('token'); // Clear custom token
            localStorage.removeItem('user');
            setUser(null);
            router.push('/');
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, signInWithGoogle, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
