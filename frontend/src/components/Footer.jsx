import React from 'react';
import { Heart, Instagram, Twitter, Facebook, Globe } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="site-footer relative z-10 bg-black/60 backdrop-blur-xl border-t border-white/10 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-600">
                            SaduX
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Sadulur Teknologi Indonesia. Empowering businesses through innovative integrated management ecosystems.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Products</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li className="hover:text-cyan-400 cursor-pointer transition-colors">Tournament System</li>
                            <li className="hover:text-cyan-400 cursor-pointer transition-colors">HRIS Enterprise</li>
                            <li className="hover:text-cyan-400 cursor-pointer transition-colors">POS Integrated</li>
                            <li className="hover:text-cyan-400 cursor-pointer transition-colors">Web CMS</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Company</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li className="hover:text-cyan-400 cursor-pointer transition-colors">About Us</li>
                            <li className="hover:text-cyan-400 cursor-pointer transition-colors">Careers</li>
                            <li className="hover:text-cyan-400 cursor-pointer transition-colors">Blog</li>
                            <li className="hover:text-cyan-400 cursor-pointer transition-colors">Contact</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Follow Us</h4>
                        <div className="flex space-x-4">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-pink-500/20 hover:text-pink-400 transition-all cursor-pointer">
                                <Instagram className="w-5 h-5" />
                            </div>
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-500/20 hover:text-blue-400 transition-all cursor-pointer">
                                <Twitter className="w-5 h-5" />
                            </div>
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-600/20 hover:text-blue-600 transition-all cursor-pointer">
                                <Facebook className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        &copy; 2025 Sadulur Teknologi Indonesia. All rights reserved.
                    </p>

                    <div className="flex items-center gap-2 text-sm text-gray-400 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                        <span>Powered by</span>
                        <a href="#" className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors font-medium">
                            <Globe className="w-4 h-4" />
                            SaduX
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
