import Link from "next/link";
import { Button } from "../ui/button";

export function Header() {
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
                    <Button variant="outline" size="sm" className="border-black text-black hover:bg-gray-100 rounded-sm">
                        Provider Portal
                    </Button>
                    <Link href="/admin/applications" className="bg-black text-white hover:bg-black/90 rounded-sm px-8 py-2">
                        Admin
                    </Link>
                </div>
            </div>
        </header>
    );
}
