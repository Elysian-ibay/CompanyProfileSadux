import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InstallPWA = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsVisible(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        }
        setDeferredPrompt(null);
        setIsVisible(false);
    };

    const handleClose = () => {
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed top-4 right-4 z-[9999] max-w-sm w-full"
                >
                    <div className="bg-stone-900/90 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-xl flex items-center gap-4">
                        <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl shadow-lg shadow-purple-500/20">
                            <Smartphone className="text-white w-6 h-6" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <h3 className="text-white font-bold text-sm truncate">Install MyBoneka</h3>
                            <p className="text-white/60 text-xs truncate">Akses lebih cepat & offline</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleInstallClick}
                                className="px-3 py-2 bg-white text-purple-900 font-bold text-xs rounded-lg hover:bg-gray-100 transition-colors shadow-sm whitespace-nowrap"
                            >
                                Install
                            </button>
                            <button
                                onClick={handleClose}
                                className="p-1.5 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default InstallPWA;
