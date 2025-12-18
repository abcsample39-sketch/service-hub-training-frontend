import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-black text-white pt-16 pb-8">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                {/* Brand Section */}
                <div>
                    <div className="flex items-center space-x-2 font-bold text-xl mb-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-white text-black font-bold">S</div>
                        <span>ServiceHub</span>
                    </div>
                    <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
                        Your trusted partner for all home services. Quality work, guaranteed satisfaction.
                    </p>
                </div>

                {/* Services Links */}
                <div>
                    <h3 className="font-bold mb-6 text-sm uppercase tracking-wider">Services</h3>
                    <ul className="space-y-4 text-sm text-gray-400">
                        <li><Link href="#" className="hover:text-white transition-colors">Cleaning</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors">Plumbing</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors">Electrical</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors">Salon & Spa</Link></li>
                    </ul>
                </div>

                {/* Company Links */}
                <div>
                    <h3 className="font-bold mb-6 text-sm uppercase tracking-wider">Company</h3>
                    <ul className="space-y-4 text-sm text-gray-400">
                        <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors">Partner With Us</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
                    </ul>
                </div>

                {/* Legal Links */}
                <div>
                    <h3 className="font-bold mb-6 text-sm uppercase tracking-wider">Legal</h3>
                    <ul className="space-y-4 text-sm text-gray-400">
                        <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors">Refund Policy</Link></li>
                    </ul>
                </div>
            </div>

            {/* Copyright Section */}
            <div className="container mx-auto px-4 pt-8 border-t border-gray-800 text-center">
                <p className="text-xs text-gray-500">
                    © 2024 ServiceHub. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
