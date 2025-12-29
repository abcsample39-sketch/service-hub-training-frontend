'use client';

import { useState } from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { useAuth } from "@/context/AuthContext";
import { LogOut, User, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
    const { user, signInWithGoogle, logout } = useAuth();
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/services", label: "Services" },
        ...(user ? [{ href: "/dashboard", label: "My Bookings" }] : []),
    ];

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname?.startsWith(href);
    };

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

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

                {/* Center: Desktop Navigation */}
                <nav className="hidden md:flex flex-1 items-center justify-center gap-1 text-sm font-medium">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "px-4 py-2 rounded-sm transition-colors",
                                isActive(link.href)
                                    ? "bg-black text-white"
                                    : "text-gray-600 hover:text-black hover:bg-gray-100"
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Right: Buttons */}
                <div className="flex flex-1 items-center justify-end gap-3">
                    {user ? (
                        <div className="hidden md:flex items-center gap-3">
                            <Link href="/profile" className="flex items-center gap-2 font-bold hover:underline">
                                <User className="w-4 h-4" />
                                <span className="hidden sm:inline">{user.name || 'User'}</span>
                            </Link>
                            <Button onClick={logout} variant="outline" size="sm" className="border-black text-black hover:bg-gray-100 rounded-sm">
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </Button>
                        </div>
                    ) : (
                        <div className="hidden md:flex items-center gap-3">
                            <Link href="/login">
                                <Button variant="ghost" className="hover:bg-gray-100">
                                    Login
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button className="bg-black text-white hover:bg-black/90 rounded-sm px-6">
                                    Register
                                </Button>
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 border-2 border-black rounded-sm hover:bg-gray-100"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t-2 border-black bg-white">
                    <nav className="flex flex-col p-4 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={closeMobileMenu}
                                className={cn(
                                    "px-4 py-3 rounded-sm transition-colors font-bold uppercase text-sm",
                                    isActive(link.href)
                                        ? "bg-black text-white"
                                        : "text-gray-600 hover:text-black hover:bg-gray-100"
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}

                        <div className="border-t border-gray-200 pt-4 mt-2 space-y-2">
                            <Link
                                href="/provider/dashboard"
                                onClick={closeMobileMenu}
                                className="block px-4 py-3 text-xs font-bold uppercase border-2 border-black rounded-sm hover:bg-gray-100 text-center"
                            >
                                Provider Portal
                            </Link>

                            {user ? (
                                <>
                                    <Link
                                        href="/profile"
                                        onClick={closeMobileMenu}
                                        className="flex items-center gap-2 px-4 py-3 font-bold hover:bg-gray-100 rounded-sm"
                                    >
                                        <User className="w-4 h-4" />
                                        {user.name || 'User'}
                                    </Link>
                                    <Button
                                        onClick={() => { logout(); closeMobileMenu(); }}
                                        variant="outline"
                                        className="w-full border-black text-black hover:bg-gray-100 rounded-sm"
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    onClick={() => { signInWithGoogle(); closeMobileMenu(); }}
                                    className="w-full bg-black text-white hover:bg-black/90 rounded-sm"
                                >
                                    Login with Google
                                </Button>
                            )}

                            <Link
                                href="/admin/applications"
                                onClick={closeMobileMenu}
                                className="block px-4 py-3 text-xs font-bold uppercase bg-black text-white rounded-sm hover:bg-black/80 text-center"
                            >
                                Admin Panel
                            </Link>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
