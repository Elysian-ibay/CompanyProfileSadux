import React, { useState } from 'react';
import GalaxyBackground from '../components/GalaxyBackground';
import { motion } from 'framer-motion';
import { User, Lock, ArrowRight, LayoutDashboard, Database, Info } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/api';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await api.post('/auth/login', { username, password });
            localStorage.setItem('token', res.data.accessToken);
            localStorage.setItem('user', JSON.stringify(res.data));

            if (res.data.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    const fillDemo = () => {
        setUsername('admin');
        setPassword('admin123');
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
            <GalaxyBackground />

            {/* Back Button */}
            <Link to="/" className="absolute top-8 left-8 text-white/50 hover:text-white transition-colors flex items-center gap-2 z-20 group">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-all">
                    <ArrowRight className="w-5 h-5 rotate-180" />
                </div>
                <span className="text-sm font-medium">Back to Home</span>
            </Link>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.5)]"
            >
                <div className="text-center mb-8">
                    <div className="mx-auto w-12 h-12 mb-4 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <Lock className="text-white w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-gray-400">
                        Welcome Back
                    </h2>
                    <p className="text-gray-400 mt-2 text-sm">Masuk untuk mengelola bisnis Anda</p>
                </div>

                {error && <div className="bg-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm text-center border border-red-500/20">{error}</div>}

                <div onClick={fillDemo} className="bg-blue-900/20 border border-blue-500/30 p-3 rounded-xl mb-6 cursor-pointer hover:bg-blue-900/30 transition-colors flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-blue-200 text-sm font-medium">Demo Account Available</p>
                        <p className="text-blue-300/70 text-xs">Click here to auto-fill admin credentials</p>
                    </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Username</label>
                        <div className="relative group">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors w-5 h-5" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-10 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors w-5 h-5" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-10 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                            />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 transition-all duration-300 flex items-center justify-center gap-2 group active:scale-[0.98]">
                        Login
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                {/* <div className="mt-8 text-center text-sm text-gray-400">
                    Belum punya akun?{' '}
                    <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors hover:underline">
                        Daftar Sekarang
                    </Link>
                </div> */}
            </motion.div>
        </div>
    );
};

export default LoginPage;
