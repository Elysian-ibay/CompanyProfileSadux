const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GeneralSetting = sequelize.define('GeneralSetting', {
    site_title: {
        type: DataTypes.STRING,
        defaultValue: 'SaduX - Company Profile'
    },
    site_name: {
        type: DataTypes.STRING,
        defaultValue: 'SaduX Technology'
    },
    contact_phone: {
        type: DataTypes.STRING,
        defaultValue: '6281234567890'
    },
    contact_email: {
        type: DataTypes.STRING,
        defaultValue: 'hello@sadux.com'
    },
    address: {
        type: DataTypes.STRING,
        defaultValue: 'Indonesia'
    },
    footer_copyright: {
        type: DataTypes.STRING,
        defaultValue: '© 2025 Sadulur Teknologi Indonesia.'
    },
    footer_description: {
        type: DataTypes.TEXT,
        defaultValue: 'Sadulur Teknologi Indonesia. Empowering businesses through innovative integrated management ecosystems.'
    },
    footer_columns: {
        type: DataTypes.JSON, // [{ title, items: [{ label, url }] }]
        defaultValue: [
            { title: 'Products', items: [
                { label: 'Tournament System', url: '#' },
                { label: 'HRIS Enterprise', url: '#' },
                { label: 'POS Integrated', url: '#' },
                { label: 'Web CMS', url: '#' }
            ] },
            { title: 'Company', items: [
                { label: 'About Us', url: '#' },
                { label: 'Careers', url: '#' },
                { label: 'Blog', url: '#' },
                { label: 'Contact', url: '#' }
            ] }
        ]
    },
    social_links: {
        type: DataTypes.JSON, // [{ platform, url }] — platform: instagram|twitter|facebook|linkedin|youtube|tiktok|website
        defaultValue: [
            { platform: 'instagram', url: '#' },
            { platform: 'twitter', url: '#' },
            { platform: 'facebook', url: '#' }
        ]
    },
    footer_powered_by: {
        type: DataTypes.STRING,
        defaultValue: 'SaduX'
    },
    footer_powered_by_url: {
        type: DataTypes.STRING,
        defaultValue: '#'
    },
    site_logo: {
        type: DataTypes.STRING, // Supabase Storage URL (navbar/footer logo)
        allowNull: true
    },
    site_favicon: {
        type: DataTypes.STRING, // Supabase Storage URL (browser tab icon, PNG)
        allowNull: true
    }
});

module.exports = GeneralSetting;
