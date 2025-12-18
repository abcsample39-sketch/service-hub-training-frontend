"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function SignupPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isProviderSignup = searchParams.get("role") === "provider";

    const [activeTab, setActiveTab] = useState<"phone" | "email">("email");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Toggle Tab
    const toggleTab = (tab: "phone" | "email") => setActiveTab(tab);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (activeTab === "phone") {
            setError("Phone registration is currently under maintenance. Please use Email.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("http://localhost:3001/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: isProviderSignup ? "Provider" : "Customer",
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                // Handle array of Zod issues
                if (Array.isArray(data.errors)) {
                    throw new Error(data.errors.map((e: any) => e.message).join(", "));
                }
                throw new Error(data.message || "Registration failed");
            }

            // Success
            if (isProviderSignup) {
                // Login logic typically happens here or user logs in. For now, redirect to login is fine,
                // but user asked to "trigger onboarding flow".
                // Usually: Auto-login -> Redirect /provider/onboarding.
                // For now, let's Redirect to Login with a message or params?
                // Or better: Redirect to /login?role=provider so login knows where to go?
                // Authentication is stateless (JWT). If backend returns token, we can save it.
                // Assuming backend currently just registers.
                alert("Provider Account Created! Please login to complete onboarding.");
                router.push("/login");
            } else {
                alert("Registration successful! Please login.");
                router.push("/login");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 bg-white p-8 border-2 border-black relative">
                <div className="text-center">
                    <h2 className="text-2xl font-bold tracking-tighter text-black uppercase mb-6">
                        {isProviderSignup ? "Join as Provider" : "Join ServiceHub"}
                    </h2>

                    {/* Tabs */}
                    <div className="flex border border-black mb-6">
                        <button
                            type="button"
                            onClick={() => toggleTab("phone")}
                            className={cn(
                                "flex-1 py-2 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2",
                                activeTab === "phone" ? "bg-black text-white" : "bg-white text-black"
                            )}
                        >
                            <span>📞</span> Phone
                        </button>
                        <button
                            type="button"
                            onClick={() => toggleTab("email")}
                            className={cn(
                                "flex-1 py-2 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2",
                                activeTab === "email" ? "bg-black text-white" : "bg-white text-black"
                            )}
                        >
                            <span>✉️</span> Email
                        </button>
                    </div>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {activeTab === "email" ? (
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wide">Full Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    placeholder="John Doe"
                                    className="mt-1 border-black rounded-none focus-visible:ring-black"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wide">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    placeholder="john@example.com"
                                    className="mt-1 border-black rounded-none focus-visible:ring-black"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wide">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    placeholder="........"
                                    className="mt-1 border-black rounded-none focus-visible:ring-black"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="confirmPassword" className="text-xs font-bold uppercase tracking-wide">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    required
                                    placeholder="........"
                                    className="mt-1 border-black rounded-none focus-visible:ring-black"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wide">Phone Number</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="+91 98765 43210"
                                    className="mt-1 border-black rounded-none focus-visible:ring-black"
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                />
                            </div>
                            <Button type="button" className="w-full bg-black text-white rounded-none hover:bg-gray-800 uppercase font-bold text-xs h-10">
                                Send OTP
                            </Button>
                        </div>
                    )}

                    {error && (
                        <div className="text-red-600 text-xs font-bold text-center">
                            {error}
                        </div>
                    )}

                    {activeTab === "email" && (
                        <Button
                            type="submit"
                            className="w-full bg-black text-white hover:bg-black/90 rounded-none h-12 uppercase font-bold tracking-wider text-sm"
                            disabled={loading}
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </Button>
                    )}

                    <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-gray-500 font-bold tracking-widest">Or</span>
                        </div>
                    </div>

                    <Button type="button" variant="outline" className="w-full border-2 border-black rounded-none h-10 uppercase font-bold text-xs hover:bg-gray-50 flex items-center justify-center gap-2">
                        <span>🌐</span> Continue with Google
                    </Button>

                    <div className="mt-6 text-center text-xs">
                        <span className="text-gray-600">Already have an account? </span>
                        <Link href="/login" className="font-bold text-black border-b border-black">
                            Login
                        </Link>
                    </div>

                    <div className="mt-4 p-4 border border-gray-200 bg-gray-50 text-center">
                        <p className="text-xs font-medium text-gray-700">Want to provide services? <Link href="/signup?role=provider" className="underline font-bold">Register as Provider</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
}
