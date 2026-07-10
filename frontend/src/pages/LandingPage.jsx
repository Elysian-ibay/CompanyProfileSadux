import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DynamicBackground from '../components/DynamicBackground';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trophy, Users, ShoppingBag, Globe, Sparkles, MessageCircle, ArrowRight, Play, CheckCircle2, HelpCircle, Briefcase, Zap, ShieldCheck, Activity, Star } from 'lucide-react';
import api, { imageUrl } from '../lib/api';

// Product data placeholder (Fallback jika API tidak tersedia)
const productFallback = [
    { id: 1, name: "Tournament Management System", price: "Contact Sales", image: "", tag: "Esports", description: "A complete platform for organizing, managing, and broadcasting esports tournaments." },
    { id: 2, name: "SaduX HRIS", price: "Subscription", image: "", tag: "Enterprise", description: "Human Resource Information System tailored for modern companies." },
    { id: 3, name: "SaduX POS + HR", price: "Bundle", image: "", tag: "Retail", description: "The ultimate retail solution. Combine your sales data with employee performance metrics." },
    { id: 4, name: "SaduX CMS", price: "License", image: "", tag: "Web", description: "Flexible Landing Page CMS to manage your company profile and marketing content." }
];

const FeatureCard = ({ icon: Icon, title, desc }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group hover:border-blue-500/30"
    >
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-500/20 to-cyan-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Icon className="text-cyan-400 w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </motion.div>
);

const LandingPage = () => {
    const [content, setContent] = React.useState(null);
    const [products, setProducts] = React.useState([]);
    const [features, setFeatures] = React.useState([]);
    const [stats, setStats] = React.useState([]);
    const [testimonials, setTestimonials] = React.useState([]);
    const [faqs, setFaqs] = React.useState([]);
    const [settings, setSettings] = React.useState({});

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch All Data
                const [contentRes, productRes, featureRes, statsRes, testiRes, faqRes, settingsRes] = await Promise.all([
                    api.get('/content'),
                    api.get('/products'),
                    api.get('/features'),
                    api.get('/stats'),
                    api.get('/cms/testimonials'),
                    api.get('/cms/faqs'),
                    api.get('/cms/settings')
                ]);

                if (contentRes.data) setContent(contentRes.data);
                setProducts(productRes.data);
                setFeatures(featureRes.data);
                setStats(statsRes.data);
                setTestimonials(testiRes.data);
                setFaqs(faqRes.data);
                setSettings(settingsRes.data);

                if (settingsRes.data?.site_title) document.title = settingsRes.data.site_title;

            } catch (error) {
                console.error("Failed to fetch landing data", error);
            }
        };


        // Track Visit
        const trackVisit = async () => {
            try {
                await api.post('/analytics/visit');
            } catch (e) {
                // ignore
            }
        };

        fetchData();
        trackVisit();
    }, []);

    // Default Fallback (sesuai seed data)
    const heroTitle = content?.hero_title || "Sadulur Teknologi Indonesia";
    const heroSubtitle = content?.hero_subtitle || "Innovate. Integrate. Inspire.";
    const heroDesc = content?.hero_description || "Transforming businesses with cutting-edge management ecosystems. From Esports Tournaments to HR and POS solutions, SaduX empowers your digital journey.";
    const featureTitle = content?.feature_title || "Our Ecosystem";

    // Dynamic Styles for Font and Color
    const fontToUrl = (font) => {
        if (!font) return '';
        return `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, '+')}:wght@300;400;600;700;800&display=swap`;
    };

    const containerStyle = {
        fontFamily: content?.theme_settings?.font_heading ? `"${content.theme_settings.font_heading}", sans-serif` : (content?.font_family ? `"${content.font_family}", sans-serif` : 'inherit'),
        '--primary-color': content?.accent_color || '#06b6d4',
        '--btn-gradient-start': content?.theme_settings?.button_gradient_start || '#2563eb',
        '--btn-gradient-end': content?.theme_settings?.button_gradient_end || '#06b6d4'
    };

    // Helper for Card Styles
    const cardStyle = {
        backgroundColor: `rgba(255, 255, 255, ${content?.theme_settings?.card_bg_opacity || 0.05})`,
        borderColor: content?.theme_settings?.card_border_color || 'rgba(255, 255, 255, 0.1)',
        backdropFilter: `blur(${content?.theme_settings?.card_blur === 'none' ? '0' : (content?.theme_settings?.card_blur === 'xl' ? '24px' : (content?.theme_settings?.card_blur === 'md' ? '12px' : '4px'))})`
    };

    // Helper for Section Styles
    const getSectionStyle = (sectionKey) => {
        const config = content?.theme_settings?.sections?.[sectionKey];
        if (!config || !config.enabled) return {};

        return {
            fontFamily: config.fontFamily ? `"${config.fontFamily}", sans-serif` : undefined,
            color: config.textColor || undefined,
            background: config.background || undefined,
            // If background is set, we might want to override default utility classes like bg-black/20
            // But we'll let existing classes exist and just let inline style override properties.
        };
    };

    const getTitleStyle = (sectionKey) => {
        const config = content?.theme_settings?.sections?.[sectionKey];
        if (!config || !config.enabled) return {};

        return {
            color: config.accentColor || undefined,
            // Font size handling might need a class replacement or just ignore if standard provided
        };
    };

    const getTitleSizeClass = (sectionKey, defaultSize) => {
        const config = content?.theme_settings?.sections?.[sectionKey];
        if (config?.enabled && config?.titleSize) return config.titleSize;
        return defaultSize;
    };

    return (
        <div style={containerStyle} className="relative min-h-screen text-white overflow-x-hidden selection:bg-[var(--primary-color)]/30">
            {content?.theme_settings?.font_heading && (
                <link rel="stylesheet" href={fontToUrl(content.theme_settings.font_heading)} />
            )}
            {content?.theme_settings?.font_body && content.theme_settings.font_body !== content.theme_settings.font_heading && (
                <link rel="stylesheet" href={fontToUrl(content.theme_settings.font_body)} />
            )}
            {/* Load custom section fonts if any */}
            {content?.theme_settings?.sections && Object.values(content.theme_settings.sections).map((s, i) => (
                s.enabled && s.fontFamily && <link key={i} rel="stylesheet" href={fontToUrl(s.fontFamily)} />
            ))}

            <DynamicBackground style={content?.background_style} />
            <Navbar />

            {/* Hero Section */}
            <section className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 pt-20"
                style={{
                    fontFamily: content?.theme_settings?.font_body ? `"${content.theme_settings.font_body}", sans-serif` : 'inherit',
                    ...getSectionStyle('hero')
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-5xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-[var(--primary-color)]/30 bg-[var(--primary-color)]/10 backdrop-blur-md text-sm font-medium hover:bg-[var(--primary-color)]/20 transition-colors cursor-default" style={{ color: 'var(--primary-color)' }}>
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: 'var(--primary-color)' }}></span>
                            <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: 'var(--primary-color)' }}></span>
                        </span>
                        Premier Tech Ecosystem Management
                    </div>

                    <h1 className={`${getTitleSizeClass('hero', 'text-4xl md:text-6xl')} font-extrabold tracking-tight mb-8 leading-tight`}
                        style={{
                            fontFamily: content?.theme_settings?.font_heading ? `"${content.theme_settings.font_heading}", sans-serif` : 'inherit',
                            ...getTitleStyle('hero')
                        }}>
                        {content?.hero_title || "Sadulur Teknologi Indonesia"} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-[var(--primary-color)] to-teal-400 hover:drop-shadow-[0_0_30px_rgba(34,211,238,0.6)] transition-all duration-300 cursor-default"
                            style={{ color: content?.theme_settings?.sections?.hero?.enabled ? 'inherit' : undefined, WebkitTextFillColor: content?.theme_settings?.sections?.hero?.enabled ? 'initial' : undefined }}>
                            {content?.hero_subtitle || "Innovate. Integrate. Inspire."}
                        </span>
                    </h1>

                    <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: getSectionStyle('hero').color ? undefined : '' }}>
                        {heroDesc}
                    </p>

                    <div className="flex flex-wrap justify-center gap-5">
                        <a href={content?.hero_button_primary_link || "#ecosystem"}>
                            <button className={`group relative px-8 py-4 font-bold text-lg hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(6,182,212,0.5)] overflow-hidden text-white ${content?.theme_settings?.button_style || 'rounded-full'}`}
                                style={{ background: `linear-gradient(to right, var(--btn-gradient-start), var(--btn-gradient-end))` }}>
                                <span className="relative z-10 flex items-center gap-2">
                                    {content?.hero_button_primary_text || "Explore Ecosystem"}
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </button>
                        </a>
                        <a href={content?.hero_button_secondary_link || "#"}>
                            <button className={`px-8 py-4 border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 font-medium text-lg flex items-center gap-2 ${content?.theme_settings?.button_style || 'rounded-full'}`}>
                                <Play className="w-4 h-4 fill-current" />
                                {content?.hero_button_secondary_text || "Tonton Video"}
                            </button>
                        </a>
                    </div>
                </motion.div>

                {/* Floating Elements */}
                <motion.div
                    animate={{ y: [0, -30, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 left-[10%] w-64 h-64 bg-cyan-600/20 rounded-full blur-[100px] -z-10"
                />
                <motion.div
                    animate={{ y: [0, 40, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-1/3 right-[10%] w-80 h-80 bg-blue-600/20 rounded-full blur-[100px] -z-10"
                />
            </section>

            {/* Ecosystem Section (Replaces Collection) */}
            <section id="ecosystem" className="relative z-10 py-24 px-4 bg-black/20 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 mb-4"
                                style={{ fontFamily: content?.theme_settings?.font_heading ? `"${content.theme_settings.font_heading}", sans-serif` : 'inherit' }}>
                                Our Ecosystem
                            </h2>
                            <p className="text-gray-400">Integrated solutions for your enterprise needs.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {(products.length > 0 ? products : productFallback).map((product) => (
                            <div key={product.id} className={`group relative overflow-hidden transition-all duration-500 flex flex-col md:flex-row border`}
                                style={{ ...cardStyle, borderRadius: '1.5rem' }}>
                                {product.tag && (
                                    <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/10">
                                        {product.tag}
                                    </div>
                                )}
                                <div className={`aspect-video md:w-1/2 relative overflow-hidden bg-gray-900 group`}>
                                    {product.image ? (
                                        <img src={imageUrl(product.image)} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-black">
                                            <span className="text-4xl opacity-50">⚡</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-8 md:w-1/2 flex flex-col justify-center">
                                    <h3 className="text-2xl font-bold mb-2 text-white" style={{ fontFamily: content?.theme_settings?.font_heading ? `"${content.theme_settings.font_heading}", sans-serif` : 'inherit' }}>{product.name}</h3>
                                    <p className="text-gray-400 mb-6 text-sm flex-grow">{product.description}</p>

                                    <div className="flex items-center justify-between">
                                        <span className="text-cyan-400 font-medium">{product.price}</span>
                                        {product.link && (
                                            <a
                                                href={product.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={async () => {
                                                    try {
                                                        await api.post(`/products/${product.id}/click`);
                                                    } catch (err) {
                                                        console.error("Tracking failed", err);
                                                    }
                                                }}
                                            >
                                                <button className={`px-6 py-2 bg-white/10 hover:bg-cyan-600/20 text-white border border-white/10 hover:border-cyan-500/50 transition-all flex items-center gap-2 ${content?.theme_settings?.button_style || 'rounded-xl'}`}>
                                                    Visit <ArrowRight size={16} />
                                                </button>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="about" className="relative z-10 py-24 px-4" style={getSectionStyle('features')}>
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className={`${getTitleSizeClass('features', 'text-3xl md:text-4xl')} font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400`}
                            style={{
                                fontFamily: content?.theme_settings?.font_heading ? `"${content.theme_settings.font_heading}", sans-serif` : 'inherit',
                                ...getTitleStyle('features'),
                                WebkitTextFillColor: content?.theme_settings?.sections?.features?.enabled ? 'initial' : undefined
                            }}>
                            {featureTitle}
                        </h2>
                        <div className="h-1 w-20 bg-gradient-to-r from-cyan-500 to-blue-600 mx-auto rounded-full" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, idx) => {
                            // Map icon name to Lucide Icon component
                            const IconComponent = {
                                Trophy: Trophy,
                                Users: Users,
                                ShoppingBag: ShoppingBag,
                                Globe: Globe,
                                Star: Star,
                                Shield: ShieldCheck,
                                Heart: Activity,
                                Truck: Zap,
                            }[feature.icon_name] || Star; // Default to Star

                            return (
                                <motion.div
                                    key={feature.id || idx}
                                    whileHover={{ y: -5 }}
                                    className="p-6 border transition-all duration-300 group hover:border-blue-500/30"
                                    style={{ ...cardStyle, borderRadius: '1rem' }}
                                >
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-500/20 to-cyan-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <IconComponent className="text-cyan-400 w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 text-white" style={{ fontFamily: content?.theme_settings?.font_heading ? `"${content.theme_settings.font_heading}", sans-serif` : 'inherit' }}>{feature.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Stats Section (Dynamic) */}
            {content?.stats_visible !== false && (
                <section className="relative z-10 py-20 px-4 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border-y border-white/5" style={getSectionStyle('stats')}>
                    <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {stats.map((stat, idx) => (
                            <div key={idx}>
                                <div className={`${getTitleSizeClass('stats', 'text-4xl md:text-5xl')} font-bold text-white mb-2`} style={getTitleStyle('stats')}>{stat.value}</div>
                                <div className="text-gray-400" style={{ color: getSectionStyle('stats').color ? undefined : '' }}>{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Testimonials Section */}
            {testimonials.length > 0 && (
                <section className="relative z-10 py-24 px-4 bg-black/20" style={getSectionStyle('testimonials')}>
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className={`${getTitleSizeClass('testimonials', 'text-3xl md:text-5xl')} font-bold mb-4 text-white`} style={getTitleStyle('testimonials')}>Clients & Partners</h2>
                            <p className="text-gray-400" style={{ color: getSectionStyle('testimonials').color ? undefined : '' }}>Trusted by leading organizations.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {testimonials.map((item, idx) => (
                                <div key={idx} className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
                                    <div className="flex items-center gap-1 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={16} className={i < item.rating ? "fill-yellow-500 text-yellow-500" : "text-gray-600"} />
                                        ))}
                                    </div>
                                    <p className="text-gray-300 mb-6 italic">"{item.comment}"</p>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center font-bold text-white">
                                            {item.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold">{item.name}</h4>
                                            <p className="text-sm text-gray-500">{item.role}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* FAQ Section */}
            {faqs.length > 0 && (
                <section className="relative z-10 py-24 px-4" style={getSectionStyle('faq')}>
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className={`${getTitleSizeClass('faq', 'text-3xl md:text-4xl')} font-bold mb-4 text-white`} style={getTitleStyle('faq')}>Common Questions</h2>
                        </div>
                        <div className="space-y-4">
                            {faqs.map((item, idx) => (
                                <details key={idx} className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                                    <summary className="flex cursor-pointer items-center justify-between gap-1.5 p-6 text-white font-medium hover:bg-white/5 transition-colors">
                                        <span className="flex items-center gap-3">
                                            <HelpCircle className="text-cyan-400" />
                                            {item.question}
                                        </span>
                                        <span className="shrink-0 rounded-full bg-white/10 p-1.5 text-gray-300 sm:p-3 group-open:-rotate-180 transition-transform">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="size-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </span>
                                    </summary>
                                    <div className="px-6 pb-6 text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                                        <p>{item.answer}</p>
                                    </div>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Product Teaser Section (Partially Dynamic - Texts) */}
            <section className="relative z-10 py-24 px-4 overflow-hidden" style={getSectionStyle('teaser')}>
                <div className="max-w-7xl mx-auto bg-gradient-to-br from-blue-900/40 to-cyan-900/40 rounded-[3rem] p-12 md:p-24 border border-white/10 relative" style={{ background: content?.theme_settings?.sections?.teaser?.enabled ? 'none' : undefined }}>
                    {/* Decorative blobs */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]" />

                    <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-white/10 backdrop-blur-md text-sm font-medium text-white border border-white/10">
                                {content?.teaser_tag || "Enterprise Solutions"}
                            </div>
                            <h2 className={`${getTitleSizeClass('teaser', 'text-4xl md:text-6xl')} font-bold mb-6 leading-tight`} style={getTitleStyle('teaser')}>{content?.teaser_title || "Build Your Digital Future"}</h2>
                            <p className="text-gray-300 text-lg mb-8 leading-relaxed" style={{ color: getSectionStyle('teaser').color ? undefined : '' }}>
                                {content?.teaser_description || "Need a custom solution? SaduX provides tailored software development to meet your specific business requirements."}
                            </p>
                            <ul className="space-y-4 mb-10">
                                {(Array.isArray(content?.teaser_features) ? content.teaser_features : (typeof content?.teaser_features === 'string' ? JSON.parse(content.teaser_features || '[]') : [
                                    "Custom Software Development",
                                    "Enterprise Resource Planning",
                                    "Cloud Infrastructure Management",
                                    "24/7 Technical Support"
                                ])).map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-4 text-gray-300 group hover:text-white transition-colors">
                                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <button className="px-10 py-4 rounded-full bg-white text-blue-900 font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg shadow-white/10 hover:shadow-white/20">
                                {content?.teaser_button_text || "Consult Now"}
                            </button>
                        </div>
                        <div className="relative">
                            {/* Product Showcase Visual */}
                            <div className="relative z-10 w-full aspect-[4/5] rounded-[2rem] bg-gradient-to-b from-white/10 to-transparent border border-white/20 backdrop-blur-md flex items-center justify-center overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-transparent to-blue-500/20 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
                                <div className="text-center p-8 transform group-hover:scale-105 transition-transform duration-500">
                                    <Sparkles className="w-32 h-32 text-cyan-300 mx-auto mb-6 opacity-80" />
                                    <span className="text-2xl text-cyan-200 font-bold tracking-widest block mb-2">SADUX</span>
                                    <span className="text-sm text-cyan-200/60 uppercase tracking-[0.2em]">Technology</span>
                                </div>

                                {/* Floating badges */}
                                <div className="absolute top-8 right-8 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold border border-white/10">
                                    SECURE
                                </div>
                            </div>

                            {/* Background decorative elements */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/30 rounded-full blur-3xl -z-10" />
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/30 rounded-full blur-3xl -z-10" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="relative z-10 py-24 px-4 text-center">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">{content?.cta_title || "Ready to Transform Your Business?"}</h2>
                    <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                        {content?.cta_description || "Join the SaduX network and experience the next generation of management software."}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/register">
                            <button className="px-12 py-4 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-lg hover:scale-105 transition-transform duration-300 shadow-[0_0_30px_rgba(6,182,212,0.4)] w-full sm:w-auto">
                                Get Started
                            </button>
                        </Link>
                        <button className="px-12 py-4 rounded-full border border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all font-bold text-lg w-full sm:w-auto">
                            Contact Sales
                        </button>
                    </div>
                </div>
            </section>

            <section id="contact">
                <Footer />
            </section>
        </div>
    );
};

export default LandingPage;
