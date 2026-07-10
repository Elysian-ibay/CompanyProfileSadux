import React, { useState, useEffect } from 'react';
import { Instagram, Twitter, Facebook, Linkedin, Youtube, Globe } from 'lucide-react';
import api, { imageUrl } from '../lib/api';

const SOCIAL_ICONS = {
    instagram: Instagram,
    twitter: Twitter,
    facebook: Facebook,
    linkedin: Linkedin,
    youtube: Youtube,
    website: Globe,
};

const DEFAULT_COLUMNS = [
    { title: 'Products', items: [{ label: 'Tournament System', url: '#' }, { label: 'HRIS Enterprise', url: '#' }, { label: 'POS Integrated', url: '#' }, { label: 'Web CMS', url: '#' }] },
    { title: 'Company', items: [{ label: 'About Us', url: '#' }, { label: 'Careers', url: '#' }, { label: 'Blog', url: '#' }, { label: 'Contact', url: '#' }] },
];
const DEFAULT_SOCIALS = [{ platform: 'instagram', url: '#' }, { platform: 'twitter', url: '#' }, { platform: 'facebook', url: '#' }];

const Footer = () => {
    const [settings, setSettings] = useState({});
    useEffect(() => {
        api.get('/cms/settings').then((res) => setSettings(res.data)).catch(() => {});
    }, []);

    const columns = Array.isArray(settings.footer_columns) && settings.footer_columns.length ? settings.footer_columns : DEFAULT_COLUMNS;
    const socials = Array.isArray(settings.social_links) && settings.social_links.length ? settings.social_links : DEFAULT_SOCIALS;
    const description = settings.footer_description || 'Sadulur Teknologi Indonesia. Empowering businesses through innovative integrated management ecosystems.';

    return (
        <footer className="site-footer relative z-10 bg-black/60 backdrop-blur-xl border-t border-white/10 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            {settings.site_logo && (
                                <img src={imageUrl(settings.site_logo)} alt={settings.site_name || 'Logo'} className="h-10 w-auto object-contain" />
                            )}
                            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-600">
                                SaduX
                            </h3>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
                    </div>

                    {/* Link columns */}
                    {columns.map((col, ci) => (
                        <div key={ci}>
                            <h4 className="text-white font-semibold mb-4">{col.title}</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                {(col.items || []).map((item, ii) => (
                                    <li key={ii}>
                                        <a href={item.url || '#'} className="hover:text-cyan-400 cursor-pointer transition-colors">{item.label}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Socials */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Follow Us</h4>
                        <div className="flex flex-wrap gap-4">
                            {socials.map((s, i) => {
                                const Icon = SOCIAL_ICONS[s.platform] || Globe;
                                return (
                                    <a key={i} href={s.url || '#'} target="_blank" rel="noreferrer"
                                        className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-cyan-500/20 hover:text-cyan-400 transition-all cursor-pointer">
                                        <Icon className="w-5 h-5" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        {settings.footer_copyright || '© 2025 Sadulur Teknologi Indonesia. All rights reserved.'}
                    </p>

                    <div className="flex items-center gap-2 text-sm text-gray-400 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                        <span>Powered by</span>
                        <a href={settings.footer_powered_by_url || '#'} className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors font-medium">
                            <Globe className="w-4 h-4" />
                            {settings.footer_powered_by || 'SaduX'}
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
