import React, { useState, useEffect } from 'react';
import { Save, Loader2, Plus, Trash2, GripVertical, MessageSquare, HelpCircle, Settings as SettingsIcon } from 'lucide-react';
import api, { imageUrl } from '../../lib/api';
import { THEME_LIST } from '../../lib/themes';

const ContentManager = () => {
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('hero'); // hero, features, stats, teaser, settings, testimonials, faq

    // Main Content State
    const [content, setContent] = useState({
        hero_title: '',
        hero_subtitle: '',
        hero_description: '',
        feature_title: '',
        cta_title: '',
        cta_description: '',
        stats_visible: true,
        teaser_title: '',
        teaser_description: '',
        teaser_features: [],
        background_style: 'galaxy',
        hero_button_primary_text: '',
        hero_button_primary_link: '',
        hero_button_secondary_text: '',
        hero_button_secondary_link: ''
    });

    // Lists State
    const [features, setFeatures] = useState([]);
    const [stats, setStats] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [faqs, setFaqs] = useState([]);
    const [settings, setSettings] = useState({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [contentRes, featuresRes, statsRes, settingsRes, testiRes, faqRes] = await Promise.all([
                api.get('/content'),
                api.get('/features'),
                api.get('/stats'),
                api.get('/cms/settings'),
                api.get('/cms/testimonials'),
                api.get('/cms/faqs')
            ]);
            setContent(contentRes.data);
            setFeatures(featuresRes.data);
            setStats(statsRes.data);
            setSettings(settingsRes.data);
            setTestimonials(testiRes.data);
            setFaqs(faqRes.data);
        } catch (error) {
            console.error('Failed to fetch data', error);
        }
    };

    const handleContentChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setContent({ ...content, [e.target.name]: value });
    };

    const handleSettingsChange = (e) => {
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    // Upload logo / favicon to Supabase Storage via backend, then refresh settings.
    const [brandingBusy, setBrandingBusy] = useState('');
    const uploadBranding = async (endpoint, file) => {
        if (!file) return;
        setBrandingBusy(endpoint);
        try {
            const fd = new FormData();
            fd.append('image', file);
            const res = await api.post(`/cms/${endpoint}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            setSettings(res.data.settings);
        } catch (e) {
            alert(e.response?.data?.message || 'Upload gagal');
        } finally {
            setBrandingBusy('');
        }
    };

    const handleSaveContent = async () => {
        setLoading(true);
        try {
            await api.put('/content', content);
            alert('Content saved!');
        } catch (error) {
            alert('Error saving content');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSettings = async () => {
        setLoading(true);
        try {
            await api.put('/cms/settings', settings);
            alert('Settings saved!');
        } catch (error) {
            alert('Error saving settings');
        } finally {
            setLoading(false);
        }
    };

    // --- Features Logic ---
    const handleFeatureChange = (index, field, value) => {
        const newFeatures = [...features];
        newFeatures[index][field] = value;
        setFeatures(newFeatures);
    };

    const addFeature = () => {
        setFeatures([...features, { icon_name: 'Star', title: '', description: '', order: features.length + 1 }]);
    };

    const removeFeature = async (id, index) => {
        if (id) {
            await api.delete(`/features/${id}`);
        }
        const newFeatures = features.filter((_, i) => i !== index);
        setFeatures(newFeatures);
    };

    const saveFeatures = async () => {
        setLoading(true);
        try {
            for (const feature of features) {
                if (feature.id) {
                    await api.put(`/features/${feature.id}`, feature);
                } else {
                    await api.post('/features', feature);
                }
            }
            alert('Features saved!');
            fetchData();
        } catch (error) {
            alert('Error saving features');
        } finally {
            setLoading(false);
        }
    };

    // --- Stats Logic ---
    const handleStatChange = (index, field, value) => {
        const newStats = [...stats];
        newStats[index][field] = value;
        setStats(newStats);
    };

    const addStat = () => {
        setStats([...stats, { value: '', label: '', order: stats.length + 1 }]);
    };

    const removeStat = async (id, index) => {
        if (id) {
            await api.delete(`/stats/${id}`);
        }
        const newStats = stats.filter((_, i) => i !== index);
        setStats(newStats);
    };

    const saveStats = async () => {
        setLoading(true);
        try {
            for (const stat of stats) {
                if (stat.id) {
                    await api.put(`/stats/${stat.id}`, stat);
                } else {
                    await api.post('/stats', stat);
                }
            }
            alert('Stats saved!');
            fetchData();
        } catch (error) {
            alert('Error saving stats');
        } finally {
            setLoading(false);
        }
    };

    // --- Testimonials Logic ---
    const handleTestiChange = (index, field, value) => {
        const newData = [...testimonials];
        newData[index][field] = value;
        setTestimonials(newData);
    };
    const addTesti = () => {
        setTestimonials([...testimonials, { name: '', role: '', comment: '', rating: 5 }]);
    };
    const removeTesti = async (id, index) => {
        if (id) await api.delete(`/cms/testimonials/${id}`);
        setTestimonials(testimonials.filter((_, i) => i !== index));
    };
    const saveTesti = async () => {
        setLoading(true);
        try {
            for (const item of testimonials) {
                if (item.id) await api.put(`/cms/testimonials/${item.id}`, item);
                else await api.post('/cms/testimonials', item);
            }
            alert('Testimonials saved!'); fetchData();
        } catch (error) { alert('Error'); } finally { setLoading(false); }
    };

    // --- FAQ Logic ---
    const handleFaqChange = (index, field, value) => {
        const newData = [...faqs];
        newData[index][field] = value;
        setFaqs(newData);
    };
    const addFaq = () => {
        setFaqs([...faqs, { question: '', answer: '', order: faqs.length + 1 }]);
    };
    const removeFaq = async (id, index) => {
        if (id) await api.delete(`/cms/faqs/${id}`);
        setFaqs(faqs.filter((_, i) => i !== index));
    };
    const saveFaq = async () => {
        setLoading(true);
        try {
            for (const item of faqs) {
                if (item.id) await api.put(`/cms/faqs/${item.id}`, item);
                else await api.post('/cms/faqs', item);
            }
            alert('FAQ saved!'); fetchData();
        } catch (error) { alert('Error'); } finally { setLoading(false); }
    };


    const toggleSectionStyle = (section) => {
        const current = content.theme_settings?.sections?.[section] || {};
        const newSettings = {
            ...content.theme_settings,
            sections: {
                ...content.theme_settings?.sections,
                [section]: {
                    ...current,
                    enabled: !current.enabled // Toggle custom styling for this section
                }
            }
        };
        setContent({ ...content, theme_settings: newSettings });
    };

    const handleSectionStyleChange = (section, field, value) => {
        const newSettings = {
            ...content.theme_settings,
            sections: {
                ...content.theme_settings?.sections,
                [section]: {
                    ...content.theme_settings?.sections?.[section],
                    [field]: value
                }
            }
        };
        setContent({ ...content, theme_settings: newSettings });
    };

    const renderSectionStyler = (sectionKey, title) => {
        const styles = content.theme_settings?.sections?.[sectionKey] || {};
        const isEnabled = styles.enabled;

        return (
            <div className="bg-black/40 border border-white/10 rounded-xl p-4 mt-6">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-gray-300 flex items-center gap-2">
                        <SettingsIcon size={16} /> {title} Custom Styles
                    </h4>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={isEnabled || false} onChange={() => toggleSectionStyle(sectionKey)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                </div>

                {isEnabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                        {/* Typography */}
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Font Family</label>
                            <select
                                value={styles.fontFamily || ""}
                                onChange={(e) => handleSectionStyleChange(sectionKey, 'fontFamily', e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-sm"
                            >
                                <option value="">Default (Global)</option>
                                {['Inter', 'Roboto', 'Playfair Display', 'Poppins', 'Montserrat', 'Open Sans', 'Outfit', 'Space Grotesk'].map(f => (
                                    <option key={f} value={f}>{f}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Title Size</label>
                            <select
                                value={styles.titleSize || ""}
                                onChange={(e) => handleSectionStyleChange(sectionKey, 'titleSize', e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-sm"
                            >
                                <option value="">Default</option>
                                <option value="text-3xl">Small (3xl)</option>
                                <option value="text-4xl">Medium (4xl)</option>
                                <option value="text-5xl">Large (5xl)</option>
                                <option value="text-6xl">X-Large (6xl)</option>
                                <option value="text-8xl">Huge (8xl)</option>
                            </select>
                        </div>

                        {/* Colors */}
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Text Color</label>
                            <div className="flex gap-2">
                                <input
                                    type="color"
                                    value={styles.textColor || '#ffffff'}
                                    onChange={(e) => handleSectionStyleChange(sectionKey, 'textColor', e.target.value)}
                                    className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={styles.textColor || ''}
                                    placeholder="Hex / Default"
                                    onChange={(e) => handleSectionStyleChange(sectionKey, 'textColor', e.target.value)}
                                    className="flex-1 bg-black/20 border border-white/10 rounded-lg p-2 text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Accent/Title Color</label>
                            <div className="flex gap-2">
                                <input
                                    type="color"
                                    value={styles.accentColor || '#ffffff'}
                                    onChange={(e) => handleSectionStyleChange(sectionKey, 'accentColor', e.target.value)}
                                    className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={styles.accentColor || ''}
                                    placeholder="Hex / Default"
                                    onChange={(e) => handleSectionStyleChange(sectionKey, 'accentColor', e.target.value)}
                                    className="flex-1 bg-black/20 border border-white/10 rounded-lg p-2 text-sm"
                                />
                            </div>
                        </div>

                        {/* Background */}
                        <div className="md:col-span-2">
                            <label className="block text-xs text-gray-500 mb-1">Section Background (CSS)</label>
                            <input
                                type="text"
                                value={styles.background || ''}
                                placeholder="e.g. #000000 or linear-gradient(...)"
                                onChange={(e) => handleSectionStyleChange(sectionKey, 'background', e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-sm font-mono"
                            />
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const tabs = [
        { id: 'hero', label: 'Hero' },
        { id: 'features', label: 'Features' },
        { id: 'stats', label: 'Stats' },
        { id: 'teaser', label: 'Teaser' },
        { id: 'testimonials', label: 'Testimonials' },
        { id: 'faq', label: 'FAQ' },
        { id: 'background', label: 'Backgrounds' },
        { id: 'appearance', label: 'Appearance' },
        { id: 'settings', label: 'Settings' },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                Landing Page Manager
            </h2>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 p-1 bg-white/5 rounded-xl border border-white/10 w-fit">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                            ? 'bg-purple-600 text-white shadow-lg'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm relative min-h-[400px]">

                {/* BACKGROUND TAB */}
                {activeTab === 'background' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {['galaxy', 'starry_night', 'clouds', 'sunny_clouds', 'sunset_vibes', 'neon_grid', 'floating_bubbles', 'geometric_shapes', 'soft_gradient', 'aurora', 'minimal_dark', 'snowfall', 'fireflies', 'digital_rain', 'shooting_stars', 'gradient_waves'].map((bgId) => (
                                <button
                                    key={bgId}
                                    onClick={() => setContent({ ...content, background_style: bgId })}
                                    className={`relative p-4 rounded-xl border transition-all text-left ${content.background_style === bgId
                                        ? 'border-purple-500 bg-purple-500/10'
                                        : 'border-white/10 bg-black/20 hover:border-white/30'
                                        }`}
                                >
                                    <div className={`w-full h-24 rounded-lg mb-3 ${bgId === 'galaxy' ? 'bg-black' :
                                        bgId === 'starry_night' ? 'bg-[#0f172a]' :
                                            bgId === 'clouds' ? 'bg-gradient-to-b from-purple-900 to-orange-400' :
                                                bgId === 'sunny_clouds' ? 'bg-gradient-to-b from-sky-400 to-blue-300' :
                                                    bgId === 'sunset_vibes' ? 'bg-gradient-to-b from-indigo-900 to-orange-500' :
                                                        bgId === 'neon_grid' ? 'bg-gray-900' :
                                                            bgId === 'floating_bubbles' ? 'bg-blue-900' :
                                                                bgId === 'geometric_shapes' ? 'bg-slate-900' :
                                                                    bgId === 'soft_gradient' ? 'bg-gradient-to-tr from-[#240b36] to-[#c31432]' :
                                                                        bgId === 'aurora' ? 'bg-black' :
                                                                            bgId === 'snowfall' ? 'bg-[#0b1120]' :
                                                                                bgId === 'fireflies' ? 'bg-[#051a12]' :
                                                                                    bgId === 'digital_rain' ? 'bg-black text-green-500' :
                                                                                        bgId === 'shooting_stars' ? 'bg-[#020617]' :
                                                                                            bgId === 'gradient_waves' ? 'bg-gradient-to-r from-pink-500 to-yellow-500' :
                                                                                                'bg-neutral-900'
                                        }`}></div>
                                    <span className="capitalize text-sm font-medium text-gray-300">{bgId.replace('_', ' ')}</span>
                                </button>
                            ))}
                        </div>
                        <button onClick={handleSaveContent} disabled={loading} className="w-full py-3 bg-purple-600 rounded-xl font-bold hover:bg-purple-500 transition-colors">
                            {loading ? 'Saving...' : 'Save Background Choice'}
                        </button>
                    </div>
                )}

                {/* HERO TAB */}
                {activeTab === 'hero' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid gap-6">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Hero Badge Text <span className="text-gray-600">(kosongkan untuk sembunyikan)</span></label>
                                <input
                                    name="hero_badge_text"
                                    value={content.hero_badge_text || ''}
                                    onChange={handleContentChange}
                                    placeholder="e.g. Premier Tech Ecosystem Management"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:border-purple-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Main Title</label>
                                <input
                                    name="hero_title"
                                    value={content.hero_title || ''}
                                    onChange={handleContentChange}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:border-purple-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Subtitle (Gradient Text)</label>
                                <input
                                    name="hero_subtitle"
                                    value={content.hero_subtitle || ''}
                                    onChange={handleContentChange}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:border-purple-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Hero Description</label>
                                <textarea
                                    name="hero_description"
                                    value={content.hero_description || ''}
                                    onChange={handleContentChange}
                                    rows="3"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:border-purple-500 focus:outline-none"
                                ></textarea>
                            </div>
                            <div className="border-t border-white/10 pt-6 mt-2">
                                {/* Hero Buttons */}
                                <h3 className="text-lg font-semibold mb-4 text-purple-300">Hero Buttons</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Primary Button Text</label>
                                        <input
                                            name="hero_button_primary_text"
                                            value={content.hero_button_primary_text || ''}
                                            onChange={handleContentChange}
                                            placeholder="e.g. Explore Ecosystem"
                                            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:border-purple-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Primary Button Link</label>
                                        <input
                                            name="hero_button_primary_link"
                                            value={content.hero_button_primary_link || ''}
                                            onChange={handleContentChange}
                                            placeholder="e.g. #ecosystem"
                                            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:border-purple-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Secondary Button Text</label>
                                        <input
                                            name="hero_button_secondary_text"
                                            value={content.hero_button_secondary_text || ''}
                                            onChange={handleContentChange}
                                            placeholder="e.g. Watch Video"
                                            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:border-purple-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Secondary Button Link</label>
                                        <input
                                            name="hero_button_secondary_link"
                                            value={content.hero_button_secondary_link || ''}
                                            onChange={handleContentChange}
                                            placeholder="e.g. https://youtube.com/..."
                                            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:border-purple-500 focus:outline-none"
                                        />
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold mb-4 text-purple-300">Call To Action (Footer)</h3>
                                <div className="grid gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">CTA Title</label>
                                        <input
                                            name="cta_title"
                                            value={content.cta_title || ''}
                                            onChange={handleContentChange}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:border-purple-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">CTA Description</label>
                                        <textarea
                                            name="cta_description"
                                            value={content.cta_description || ''}
                                            onChange={handleContentChange}
                                            rows="2"
                                            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:border-purple-500 focus:outline-none"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button onClick={handleSaveContent} disabled={loading} className="w-full py-3 bg-purple-600 rounded-xl font-bold hover:bg-purple-500 transition-colors">
                            {loading ? 'Saving...' : 'Save Hero & CTA'}
                        </button>
                        {renderSectionStyler('hero', 'Hero Section')}
                    </div>
                )}

                {/* FEATURES TAB */}
                {activeTab === 'features' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="mb-4">
                            <label className="block text-sm text-gray-400 mb-2">Section Title</label>
                            <input
                                name="feature_title"
                                value={content.feature_title || ''}
                                onChange={handleContentChange}
                                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:border-purple-500 focus:outline-none mb-2"
                            />
                            <button onClick={handleSaveContent} className="text-xs text-purple-400 hover:text-purple-300">Save Title Only</button>
                        </div>

                        <div className="space-y-4">
                            {features.map((feature, index) => (
                                <div key={index} className="flex gap-4 items-start bg-black/20 p-4 rounded-xl border border-white/5">
                                    <div className="mt-2 text-gray-500 cursor-move"><GripVertical size={20} /></div>
                                    <div className="grid gap-3 flex-1">
                                        <div className="grid grid-cols-2 gap-4">
                                            <input
                                                placeholder="Icon Name (e.g. Star)"
                                                value={feature.icon_name}
                                                onChange={(e) => handleFeatureChange(index, 'icon_name', e.target.value)}
                                                className="bg-black/40 border border-white/10 rounded-lg p-2 text-sm"
                                            />
                                            <input
                                                placeholder="Title"
                                                value={feature.title}
                                                onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                                                className="bg-black/40 border border-white/10 rounded-lg p-2 text-sm font-bold"
                                            />
                                        </div>
                                        <textarea
                                            placeholder="Description"
                                            value={feature.description}
                                            onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                                            rows="2"
                                            className="bg-black/40 border border-white/10 rounded-lg p-2 text-sm w-full"
                                        />
                                    </div>
                                    <button onClick={() => removeFeature(feature.id, index)} className="text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-colors">
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-4">
                            <button onClick={addFeature} className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-600 rounded-xl text-sm hover:border-white hover:text-white transition-colors text-gray-400">
                                <Plus size={16} /> Add Feature
                            </button>
                            <button onClick={saveFeatures} disabled={loading} className="flex-1 py-2 bg-purple-600 rounded-xl font-bold hover:bg-purple-500 transition-colors">
                                {loading ? 'Saving...' : 'Save All Features List'}
                            </button>
                        </div>
                        {renderSectionStyler('features', 'Features Section')}
                    </div>
                )}

                {/* STATS TAB */}
                {activeTab === 'stats' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-3 mb-6">
                            <input
                                type="checkbox"
                                name="stats_visible"
                                checked={content.stats_visible}
                                onChange={handleContentChange}
                                className="w-5 h-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500 bg-gray-700"
                            />
                            <span className="text-gray-300 font-medium">Show Stats Section</span>
                            <button onClick={handleSaveContent} className="text-xs text-purple-400 ml-2">Save Visibility</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {stats.map((stat, index) => (
                                <div key={index} className="flex gap-3 items-center bg-black/20 p-4 rounded-xl border border-white/5 relative group">
                                    <button onClick={() => removeStat(stat.id, index)} className="absolute top-2 right-2 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Trash2 size={16} />
                                    </button>
                                    <div className="grid gap-2 w-full">
                                        <input
                                            placeholder="Value (e.g. 10k+)"
                                            value={stat.value}
                                            onChange={(e) => handleStatChange(index, 'value', e.target.value)}
                                            className="bg-black/40 border border-white/10 rounded-lg p-2 text-lg font-bold text-center text-purple-400"
                                        />
                                        <input
                                            placeholder="Label (e.g. Clients)"
                                            value={stat.label}
                                            onChange={(e) => handleStatChange(index, 'label', e.target.value)}
                                            className="bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-center"
                                        />
                                    </div>
                                </div>
                            ))}

                            <button onClick={addStat} className="flex flex-col items-center justify-center gap-2 h-full min-h-[120px] border border-dashed border-gray-600 rounded-xl text-sm hover:border-white hover:text-white transition-colors text-gray-400 cursor-pointer">
                                <Plus size={24} />
                                <span>Add Statistic</span>
                            </button>
                        </div>

                        <button onClick={saveStats} disabled={loading} className="w-full py-3 bg-purple-600 rounded-xl font-bold hover:bg-purple-500 transition-colors">
                            {loading ? 'Saving...' : 'Save Statistics'}
                        </button>
                        {renderSectionStyler('stats', 'Stats Section')}
                    </div>
                )}

                {/* TEASER TAB */}
                {activeTab === 'teaser' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid gap-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Tag Badge</label>
                                    <input
                                        name="teaser_tag"
                                        value={content.teaser_tag || ''}
                                        onChange={handleContentChange}
                                        placeholder="e.g. Enterprise Solutions"
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:border-purple-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Button Text</label>
                                    <input
                                        name="teaser_button_text"
                                        value={content.teaser_button_text || ''}
                                        onChange={handleContentChange}
                                        placeholder="e.g. Consult Now"
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:border-purple-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Title</label>
                                <input
                                    name="teaser_title"
                                    value={content.teaser_title || ''}
                                    onChange={handleContentChange}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:border-purple-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Description</label>
                                <textarea
                                    name="teaser_description"
                                    value={content.teaser_description || ''}
                                    onChange={handleContentChange}
                                    rows="3"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:border-purple-500 focus:outline-none"
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Features List</label>
                                <div className="space-y-3">
                                    {(Array.isArray(content.teaser_features) ? content.teaser_features : typeof content.teaser_features === 'string' ? JSON.parse(content.teaser_features || '[]') : []).map((feature, idx) => (
                                        <div key={idx} className="flex gap-2">
                                            <input
                                                value={feature}
                                                onChange={(e) => {
                                                    const currentFeatures = Array.isArray(content.teaser_features) ? content.teaser_features : typeof content.teaser_features === 'string' ? JSON.parse(content.teaser_features || '[]') : [];
                                                    const newFeatures = [...currentFeatures];
                                                    newFeatures[idx] = e.target.value;
                                                    setContent({ ...content, teaser_features: newFeatures });
                                                }}
                                                className="flex-1 bg-black/40 border border-white/10 rounded-lg p-2 text-sm"
                                            />
                                            <button
                                                onClick={() => {
                                                    const currentFeatures = Array.isArray(content.teaser_features) ? content.teaser_features : typeof content.teaser_features === 'string' ? JSON.parse(content.teaser_features || '[]') : [];
                                                    const newFeatures = currentFeatures.filter((_, i) => i !== idx);
                                                    setContent({ ...content, teaser_features: newFeatures });
                                                }}
                                                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => {
                                            const currentFeatures = Array.isArray(content.teaser_features) ? content.teaser_features : typeof content.teaser_features === 'string' ? JSON.parse(content.teaser_features || '[]') : [];
                                            setContent({ ...content, teaser_features: [...currentFeatures, 'New Feature'] });
                                        }}
                                        className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
                                    >
                                        <Plus size={14} /> Add Teaser Feature
                                    </button>
                                </div>
                            </div>
                        </div>
                        <button onClick={handleSaveContent} disabled={loading} className="w-full py-3 bg-purple-600 rounded-xl font-bold hover:bg-purple-500 transition-colors">
                            {loading ? 'Saving...' : 'Save Teaser Section'}
                        </button>
                        {renderSectionStyler('teaser', 'Teaser Section')}
                    </div>
                )}

                {/* TESTIMONIALS TAB */}
                {activeTab === 'testimonials' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid gap-4">
                            {testimonials.map((item, index) => (
                                <div key={index} className="bg-black/20 p-4 rounded-xl border border-white/5 relative group">
                                    <button onClick={() => removeTesti(item.id, index)} className="absolute top-2 right-2 text-red-400 hover:bg-red-500/10 p-1.5 rounded-lg transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                    <div className="grid grid-cols-2 gap-4 mb-2">
                                        <input placeholder="Name" value={item.name} onChange={e => handleTestiChange(index, 'name', e.target.value)} className="bg-black/40 border border-white/10 rounded-lg p-2" />
                                        <input placeholder="Role (e.g. Student)" value={item.role} onChange={e => handleTestiChange(index, 'role', e.target.value)} className="bg-black/40 border border-white/10 rounded-lg p-2" />
                                    </div>
                                    <textarea placeholder="Comment" value={item.comment} onChange={e => handleTestiChange(index, 'comment', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2 mb-2" rows="2" />
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-400">Rating:</span>
                                        <input type="number" min="1" max="5" value={item.rating} onChange={e => handleTestiChange(index, 'rating', e.target.value)} className="w-16 bg-black/40 border border-white/10 rounded-lg p-1" />
                                    </div>
                                </div>
                            ))}
                            <button onClick={addTesti} className="py-3 border border-dashed border-gray-600 rounded-xl text-gray-400 hover:text-white">+ Add Testimonial</button>
                        </div>
                        <button onClick={saveTesti} disabled={loading} className="w-full py-3 bg-purple-600 rounded-xl font-bold hover:bg-purple-500 transition-colors">
                            {loading ? 'Saving...' : 'Save Testimonials'}
                        </button>
                        {renderSectionStyler('testimonials', 'Testimonials Section')}
                    </div>
                )}

                {/* FAQ TAB */}
                {activeTab === 'faq' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid gap-4">
                            {faqs.map((item, index) => (
                                <div key={index} className="bg-black/20 p-4 rounded-xl border border-white/5 relative group">
                                    <button onClick={() => removeFaq(item.id, index)} className="absolute top-2 right-2 text-red-400 hover:bg-red-500/10 p-1.5 rounded-lg transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                    <input placeholder="Question" value={item.question} onChange={e => handleFaqChange(index, 'question', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2 mb-2 font-medium" />
                                    <textarea placeholder="Answer" value={item.answer} onChange={e => handleFaqChange(index, 'answer', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2" rows="2" />
                                </div>
                            ))}
                            <button onClick={addFaq} className="py-3 border border-dashed border-gray-600 rounded-xl text-gray-400 hover:text-white">+ Add FAQ</button>
                        </div>
                        <button onClick={saveFaq} disabled={loading} className="w-full py-3 bg-purple-600 rounded-xl font-bold hover:bg-purple-500 transition-colors">
                            {loading ? 'Saving...' : 'Save FAQs'}
                        </button>
                        {renderSectionStyler('faq', 'FAQ Section')}
                    </div>
                )}


                {/* APPEARANCE TAB */}
                {activeTab === 'appearance' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                        {/* 0. Preset Themes */}
                        <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
                            <h3 className="text-lg font-bold mb-4 text-emerald-300 flex items-center gap-2">
                                <span className="p-1 bg-emerald-500/20 rounded">🎨</span> Preset Themes
                            </h3>
                            <div className="grid md:grid-cols-3 gap-4">
                                {THEME_LIST.map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => setContent({
                                            ...content,
                                            active_theme: t.id,
                                            background_style: t.background_style,
                                            accent_color: t.theme_settings.accent || content.accent_color,
                                            // preserve any per-section custom styling the user set
                                            theme_settings: { ...t.theme_settings, sections: content.theme_settings?.sections }
                                        })}
                                        className={`p-4 rounded-xl border text-left transition-all ${content.active_theme === t.id ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/10 bg-black/40 hover:border-white/30'}`}
                                    >
                                        <div className="font-bold text-white mb-1 flex items-center gap-2">
                                            {t.label}
                                            {t.id === 'retro' && <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-400/20 text-yellow-300 border border-yellow-400/30">DEFAULT</span>}
                                        </div>
                                        <div className="text-xs text-gray-400 mb-3">{t.description}</div>
                                        <div className="flex gap-2">
                                            {t.swatches.map((c, i) => (
                                                <div key={i} className="w-6 h-6 rounded border border-white/10" style={{ background: c }}></div>
                                            ))}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 1. Global Typography */}
                        <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
                            <h3 className="text-lg font-bold mb-4 text-purple-300 flex items-center gap-2">
                                <span className="p-1 bg-purple-500/20 rounded">Ag</span> Typography
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Primary Font (Headings)</label>
                                    <select
                                        value={content.theme_settings?.font_heading || 'Inter'}
                                        onChange={(e) => setContent({ ...content, theme_settings: { ...content.theme_settings, font_heading: e.target.value } })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:border-purple-500 focus:outline-none"
                                    >
                                        {['Inter', 'Roboto', 'Playfair Display', 'Poppins', 'Montserrat', 'Open Sans', 'Outfit', 'Space Grotesk'].map(f => (
                                            <option key={f} value={f}>{f}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Secondary Font (Body)</label>
                                    <select
                                        value={content.theme_settings?.font_body || 'Inter'}
                                        onChange={(e) => setContent({ ...content, theme_settings: { ...content.theme_settings, font_body: e.target.value } })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:border-purple-500 focus:outline-none"
                                    >
                                        {['Inter', 'Roboto', 'Lato', 'Open Sans'].map(f => (
                                            <option key={f} value={f}>{f}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* 2. Buttons Styling */}
                        <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
                            <h3 className="text-lg font-bold mb-4 text-blue-300 flex items-center gap-2">
                                <span className="p-1 bg-blue-500/20 rounded">⬜</span> Buttons & Gradients
                            </h3>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Button Shape</label>
                                    <div className="flex bg-black/40 p-1 rounded-xl border border-white/10">
                                        {['rounded-none', 'rounded-xl', 'rounded-full'].map(shape => (
                                            <button
                                                key={shape}
                                                onClick={() => setContent({ ...content, theme_settings: { ...content.theme_settings, button_style: shape } })}
                                                className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${content.theme_settings?.button_style === shape ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                                            >
                                                {shape.replace('rounded-', '')}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Gradient Start</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color"
                                            value={content.theme_settings?.button_gradient_start || '#2563eb'}
                                            onChange={(e) => setContent({ ...content, theme_settings: { ...content.theme_settings, button_gradient_start: e.target.value } })}
                                            className="w-10 h-10 rounded-lg bg-transparent border-0 cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={content.theme_settings?.button_gradient_start || ''}
                                            onChange={(e) => setContent({ ...content, theme_settings: { ...content.theme_settings, button_gradient_start: e.target.value } })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 text-sm focus:border-blue-500 outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Gradient End</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color"
                                            value={content.theme_settings?.button_gradient_end || '#06b6d4'}
                                            onChange={(e) => setContent({ ...content, theme_settings: { ...content.theme_settings, button_gradient_end: e.target.value } })}
                                            className="w-10 h-10 rounded-lg bg-transparent border-0 cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={content.theme_settings?.button_gradient_end || ''}
                                            onChange={(e) => setContent({ ...content, theme_settings: { ...content.theme_settings, button_gradient_end: e.target.value } })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 text-sm focus:border-cyan-500 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 p-4 bg-black/40 rounded-xl border border-white/5 flex items-center justify-center gap-4">
                                <span className="text-gray-500 text-sm">Preview:</span>
                                <button
                                    className={`px-6 py-2 font-bold text-white shadow-lg transition-transform hover:scale-105 ${content.theme_settings?.button_style || 'rounded-full'}`}
                                    style={{ background: `linear-gradient(to right, ${content.theme_settings?.button_gradient_start || '#2563eb'}, ${content.theme_settings?.button_gradient_end || '#06b6d4'})` }}
                                >
                                    Primary Button
                                </button>
                            </div>
                        </div>

                        {/* 3. Cards Styling */}
                        <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
                            <h3 className="text-lg font-bold mb-4 text-pink-300 flex items-center gap-2">
                                <span className="p-1 bg-pink-500/20 rounded">▣</span> Cards & Glassmorphism
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Background Opacity (%)</label>
                                    <input
                                        type="range" min="0" max="100"
                                        value={(content.theme_settings?.card_bg_opacity || 0.05) * 100}
                                        onChange={(e) => setContent({ ...content, theme_settings: { ...content.theme_settings, card_bg_opacity: e.target.value / 100 } })}
                                        className="w-full accent-pink-500"
                                    />
                                    <div className="text-right text-xs text-gray-400 mt-1">{Math.round((content.theme_settings?.card_bg_opacity || 0.05) * 100)}%</div>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Blur Amount</label>
                                    <div className="flex bg-black/40 p-1 rounded-xl border border-white/10">
                                        {['none', 'sm', 'md', 'xl'].map(blur => (
                                            <button
                                                key={blur}
                                                onClick={() => setContent({ ...content, theme_settings: { ...content.theme_settings, card_blur: blur } })}
                                                className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${content.theme_settings?.card_blur === blur ? 'bg-pink-600 text-white' : 'text-gray-400 hover:text-white'}`}
                                            >
                                                {blur.toUpperCase()}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Border Color</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={content.theme_settings?.card_border_color || 'rgba(255,255,255,0.1)'}
                                            onChange={(e) => setContent({ ...content, theme_settings: { ...content.theme_settings, card_border_color: e.target.value } })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm focus:border-pink-500 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 p-8 bg-black/40 rounded-xl border border-white/5 flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"></div>
                                <div
                                    className={`relative z-10 w-64 h-32 p-4 text-white border transition-all`}
                                    style={{
                                        backgroundColor: `rgba(255,255,255,${content.theme_settings?.card_bg_opacity || 0.05})`,
                                        borderColor: content.theme_settings?.card_border_color || 'rgba(255,255,255,0.1)',
                                        backdropFilter: `blur(${content.theme_settings?.card_blur === 'none' ? 0 : (content.theme_settings?.card_blur === 'sm' ? '4px' : (content.theme_settings?.card_blur === 'md' ? '12px' : '24px'))})`,
                                        borderRadius: '1rem'
                                    }}
                                >
                                    <h4 className="font-bold mb-2">Card Preview</h4>
                                    <p className="text-sm opacity-70">This is how your cards will look.</p>
                                </div>
                            </div>
                        </div>

                        <button onClick={handleSaveContent} disabled={loading} className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold hover:scale-[1.01] transition-transform">
                            {loading ? 'Saving Layout...' : 'Save Appearance Settings'}
                        </button>
                    </div>
                )}

                {/* SETTINGS TAB */}
                {activeTab === 'settings' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid gap-6">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Site Title</label>
                                <input name="site_title" value={settings.site_title || ''} onChange={handleSettingsChange} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:border-purple-500 focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Company Name</label>
                                <input name="site_name" value={settings.site_name || ''} onChange={handleSettingsChange} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:border-purple-500 focus:outline-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Phone Contact</label>
                                    <input name="contact_phone" value={settings.contact_phone || ''} onChange={handleSettingsChange} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:border-purple-500 focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Email Contact</label>
                                    <input name="contact_email" value={settings.contact_email || ''} onChange={handleSettingsChange} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:border-purple-500 focus:outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Address</label>
                                <input name="address" value={settings.address || ''} onChange={handleSettingsChange} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:border-purple-500 focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Footer Copyright</label>
                                <input name="footer_copyright" value={settings.footer_copyright || ''} onChange={handleSettingsChange} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:border-purple-500 focus:outline-none" />
                            </div>

                            {/* Branding: Logo & Favicon (uploaded to Supabase Storage) */}
                            <div className="border-t border-white/10 pt-6 mt-2">
                                <h3 className="text-lg font-semibold mb-1 text-purple-300">Branding</h3>
                                <p className="text-xs text-gray-500 mb-4">Logo tampil di navbar &amp; footer. Favicon adalah ikon di tab browser. Tersimpan otomatis saat di-upload.</p>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Logo */}
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Logo Situs <span className="text-gray-600">(PNG/JPG/WEBP, maks 5MB)</span></label>
                                        <div className="flex items-center gap-4">
                                            <div className="w-20 h-20 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                                                {settings.site_logo
                                                    ? <img src={imageUrl(settings.site_logo)} alt="logo" className="w-full h-full object-contain" />
                                                    : <span className="text-xs text-gray-600">No logo</span>}
                                            </div>
                                            <label className="cursor-pointer text-sm px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 transition-colors">
                                                {brandingBusy === 'logo' ? 'Uploading…' : 'Upload Logo'}
                                                <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden"
                                                    onChange={(e) => uploadBranding('logo', e.target.files[0])} />
                                            </label>
                                        </div>
                                    </div>
                                    {/* Favicon */}
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Favicon (ikon tab) <span className="text-gray-600">(PNG saja, maks 500KB)</span></label>
                                        <div className="flex items-center gap-4">
                                            <div className="w-20 h-20 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                                                {settings.site_favicon
                                                    ? <img src={imageUrl(settings.site_favicon)} alt="favicon" className="w-10 h-10 object-contain" />
                                                    : <span className="text-xs text-gray-600">No icon</span>}
                                            </div>
                                            <label className="cursor-pointer text-sm px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 transition-colors">
                                                {brandingBusy === 'favicon' ? 'Uploading…' : 'Upload Favicon'}
                                                <input type="file" accept="image/png" className="hidden"
                                                    onChange={(e) => uploadBranding('favicon', e.target.files[0])} />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button onClick={handleSaveSettings} disabled={loading} className="w-full py-3 bg-purple-600 rounded-xl font-bold hover:bg-purple-500 transition-colors">
                            {loading ? 'Saving...' : 'Save General Settings'}
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ContentManager;
