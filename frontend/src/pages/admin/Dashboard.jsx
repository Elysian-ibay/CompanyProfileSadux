import React, { useState, useEffect } from 'react';
import { Package, Users, MousePointer, TrendingUp, Sparkles, User, Link as LinkIcon } from 'lucide-react';
import api from '../../lib/api';

const StatCard = ({ title, value, icon: Icon, color, subtext }) => (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${color} flex items-center justify-center opacity-80`}>
                <Icon className="text-white w-6 h-6" />
            </div>
            {subtext && (
                <span className="text-green-400 text-sm font-medium flex items-center gap-1 bg-green-500/10 px-2 py-1 rounded-lg border border-green-500/20">
                    {subtext}
                </span>
            )}
        </div>
        <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold text-white">{value}</p>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        visitors: 0,
        products: 0,
        clicks: 0,
        topProducts: []
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await api.get('/analytics/dashboard');
            setStats(res.data);
        } catch (error) {
            console.error("Failed to fetch dashboard stats", error);
        }
    };

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Visitors (Unique)"
                    value={stats.visitors}
                    icon={Users}
                    color="from-blue-500 to-cyan-600"
                    subtext="Traffic"
                />
                <StatCard
                    title="Total Product Clicks"
                    value={stats.clicks}
                    icon={MousePointer}
                    color="from-pink-500 to-rose-600"
                    subtext="Engagement"
                />
                <StatCard
                    title="Active Products"
                    value={stats.products}
                    icon={Package}
                    color="from-purple-500 to-indigo-600"
                />
            </div>

            {/* Top Products Table */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <TrendingUp className="text-cyan-400" />
                    Top Performing Products
                </h3>
                {stats.topProducts && stats.topProducts.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/10 text-gray-400">
                                    <th className="py-4">Product Name</th>
                                    <th className="py-4">Category</th>
                                    <th className="py-4 text-right">Clicks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.topProducts.map((product) => (
                                    <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="py-4 font-medium">{product.name}</td>
                                        <td className="py-4 text-sm text-gray-400">{product.tag || 'General'}</td>
                                        <td className="py-4 text-right">
                                            <span className="inline-flex items-center gap-1 bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-bold">
                                                {product.click_count} <MousePointer size={10} />
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        <Package className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p>No activity yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
