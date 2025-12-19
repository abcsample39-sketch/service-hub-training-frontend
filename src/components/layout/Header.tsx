'use client';
import Link from "next/link";
import { Button } from "../ui/button";
import { useAuth } from "@/context/AuthContext";
import { LogOut, User } from "lucide-react";

export function Header() {
    const { user, signInWithGoogle, logout } = useAuth();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
            <div className="container mx-auto flex h-16 items-center px-4">
                {/* Left: Logo */}
                <div className="flex flex-1 items-center justify-start">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl text-black">
                        <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-black text-white">S</div>
                        <span className="hidden sm:inline-block">ServiceHub</span>
                    </Link>
                </div>

                {/* Center: Navigation */}
                <nav className="hidden md:flex flex-1 items-center justify-center gap-8 text-sm font-medium">
                    <Link href="/" className="bg-black text-white px-4 py-2 rounded-sm transition-colors hover:bg-black/80">
                        Home
                    </Link>
                    <Link href="/services" className="text-gray-600 transition-colors hover:text-black">
                        Services
                    </Link>
                    <Link href="/bookings" className="text-gray-600 transition-colors hover:text-black">
                        My Bookings
                    </Link>
                </nav>

                {/* Right: Buttons */}
                <div className="flex flex-1 items-center justify-end gap-4">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <Link href="/profile" className="flex items-center gap-2 font-bold hover:underline">
                                <User className="w-4 h-4" />
                                <span className="hidden sm:inline">{user.displayName || 'User'}</span>
                            </Link>
                            <Button onClick={logout} variant="outline" size="sm" className="border-black text-black hover:bg-gray-100 rounded-sm">
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </Button>
                        </div>
                    ) : (
                        <Button onClick={signInWithGoogle} className="bg-black text-white hover:bg-black/90 rounded-sm px-6">
                            Login with Google
                        </Button>
                    )}

                    <Link href="/admin/applications" className="text-xs font-bold uppercase border-2 border-black px-2 py-1 rounded hover:bg-gray-100 hidden lg:block">
                        Admin
                    </Link>
                </div>
            </div>
        </header>
    );
}
