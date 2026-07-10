import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { Menu, X } from 'lucide-react';
import api, { imageUrl } from '../lib/api';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [settings, setSettings] = useState({});
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        api.get('/cms/settings').then((res) => setSettings(res.data)).catch(() => {});
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Ecosystem', path: '#ecosystem' },
        { name: 'About', path: '#about' },
        { name: 'Contact', path: '#contact' },
    ];

    return (
        <>
            <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
                <nav
                    className={cn(
                        "relative flex items-center justify-between transition-all duration-300",
                        "bg-black/40 backdrop-blur-xl border border-white/10",
                        "rounded-full px-6 py-3",
                        scrolled ? "w-full max-w-5xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]" : "w-full max-w-4xl bg-transparent border-transparent backdrop-blur-none"
                    )}
                >
                    {/* Logo + wordmark (keep both when a logo is uploaded) */}
                    <Link to="/" className="mr-8 flex items-center gap-2.5">
                        {settings.site_logo && (
                            <img src={imageUrl(settings.site_logo)} alt={settings.site_name || 'Logo'} className="h-9 w-auto object-contain" />
                        )}
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400">SaduX</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.path}
                                className="text-sm font-medium text-gray-300 hover:text-white transition-colors relative group"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-500 transition-all duration-300 group-hover:w-full" />
                            </a>
                        ))}
                    </div>



                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-white p-1"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </nav>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="mobile-menu fixed inset-0 z-40 bg-black/90 backdrop-blur-lg pt-24 px-8 md:hidden">
                    <div className="flex flex-col gap-6 text-center">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.path}
                                className="mobile-menu-link text-xl font-medium text-gray-300 hover:text-white"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.name}
                            </a>
                        ))}

                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
