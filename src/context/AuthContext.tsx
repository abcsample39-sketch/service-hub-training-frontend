'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { useRouter } from 'next/navigation';
import { User as AppUser } from '../types';
import { API_URL, apiFetch } from '../lib/api';

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
                    displayName: currentUser.displayName || undefined,
                    photoURL: currentUser.photoURL || undefined,
                    firebaseUid: currentUser.uid,
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
            const data = await apiFetch<{ access_token: string; user: AppUser }>('auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });
            // data = { access_token, user: { id, name, email, role } }

            // Populate displayName from name for consistency
            const userWithDisplay: AppUser = {
                ...data.user,
                displayName: data.user.name,
            };

            localStorage.setItem('token', data.access_token);
            localStorage.setItem('user', JSON.stringify(userWithDisplay));
            setUser(userWithDisplay);

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
            const result = await signInWithPopup(auth, googleProvider);
            const firebaseUser = result.user;
            const token = await firebaseUser.getIdToken();

            // Sync with backend
            const res = await fetch(`${API_URL}/users/sync`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                const data = await res.json();
                // Update local user state with backend data (role etc) and Firebase fields
                const appUser: AppUser = {
                    id: data.id, // Use DB ID
                    name: data.name,
                    email: data.email,
                    role: data.role,
                    displayName: firebaseUser.displayName || data.name,
                    photoURL: firebaseUser.photoURL || undefined,
                    firebaseUid: firebaseUser.uid,
                };
                setUser(appUser);

                // Store for persistence
                localStorage.setItem('user', JSON.stringify(appUser));

                // Route based on role
                if (data.role === 'Admin') router.push('/admin');
                else if (data.role === 'Provider') router.push('/provider/dashboard');
                else router.push('/profile');
            } else {
                console.error("Failed to sync user");
                router.push('/profile'); // Fallback
            }

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
