import React, { useEffect, useState, useRef } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import GalaxyBackground from '../components/GalaxyBackground';
import { Package, LogOut, LayoutDashboard, Settings, User, Sparkles, ChevronDown } from 'lucide-react';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }

        // Close dropdown when clicking outside
        function handleClickOutside(event) {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const sidebarItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
        { icon: Package, label: 'Products', path: '/admin/products' },
        { icon: Sparkles, label: 'Content', path: '/admin/content' },
    ];

    return (
        <div className="flex h-screen overflow-hidden text-white bg-black selection:bg-purple-500/30 font-sans">
            {/* Background - slightly dimmed for admin focus */}
            <div className="fixed inset-0 z-0 opacity-40">
                <GalaxyBackground />
            </div>

            {/* Sidebar */}
            <aside className="relative z-10 w-64 border-r border-white/10 bg-black/40 backdrop-blur-md flex flex-col">
                <div className="p-6 border-b border-white/10">
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-600">
                        SaduX Admin
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
                                ${location.pathname === item.path
                                    ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-white border border-purple-500/30'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${location.pathname === item.path ? 'text-purple-400' : 'text-gray-500 group-hover:text-white'}`} />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="relative z-10 flex-1 overflow-y-auto">
                <header className="h-20 border-b border-white/10 bg-black/20 backdrop-blur-sm flex items-center justify-between px-8">
                    <h2 className="text-xl font-semibold text-gray-200">
                        {location.pathname === '/admin' ? 'Dashboard Overview' :
                            location.pathname.split('/').pop().charAt(0).toUpperCase() + location.pathname.split('/').pop().slice(1)}
                    </h2>

                    {/* User Profile Dropdown */}
                    <div className="relative" ref={profileRef}>
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-3 hover:bg-white/5 p-2 rounded-xl transition-colors outline-none"
                        >
                            <div className="text-right hidden sm:block">
                                <div className="text-sm font-bold text-white">Administrator</div>
                                <div className="text-xs text-gray-400">Super Admin</div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 p-[1px]">
                                <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                                    {/* Placeholder Avatar */}
                                    <User className="w-5 h-5 text-gray-300" />
                                </div>
                            </div>
                            <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {isProfileOpen && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl py-2 animate-in fade-in zoom-in-95 duration-200 z-50">
                                <div className="px-4 py-2 border-b border-white/10 mb-1 sm:hidden">
                                    <div className="text-sm font-bold text-white">Administrator</div>
                                    <div className="text-xs text-gray-400">Super Admin</div>
                                </div>
                                <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white flex items-center gap-2 transition-colors">
                                    <Settings size={16} />
                                    Settings
                                </button>
                                <div className="h-px bg-white/10 my-1" />
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center gap-2 transition-colors"
                                >
                                    <LogOut size={16} />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </header>
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
