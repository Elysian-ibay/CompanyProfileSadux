const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LandingPageContent = sequelize.define('LandingPageContent', {
    hero_title: {
        type: DataTypes.STRING,
        defaultValue: 'Sadulur Teknologi Indonesia'
    },
    hero_subtitle: {
        type: DataTypes.STRING,
        defaultValue: 'Innovate. Integrate. Inspire.'
    },
    hero_description: {
        type: DataTypes.TEXT,
        defaultValue: 'Transforming businesses with cutting-edge management ecosystems. From Esports Tournaments to HR and POS solutions, SaduX empowers your digital journey.'
    },
    hero_button_primary_text: {
        type: DataTypes.STRING,
        defaultValue: 'Explore Ecosystem'
    },
    hero_button_primary_link: {
        type: DataTypes.STRING,
        defaultValue: '#ecosystem'
    },
    hero_button_secondary_text: {
        type: DataTypes.STRING,
        defaultValue: 'Watch Video'
    },
    hero_button_secondary_link: {
        type: DataTypes.STRING,
        defaultValue: '#'
    },
    feature_title: {
        type: DataTypes.STRING,
        defaultValue: 'Our Ecosystem'
    },
    cta_title: {
        type: DataTypes.STRING,
        defaultValue: 'Ready to Transform Your Business?'
    },
    cta_description: {
        type: DataTypes.TEXT,
        defaultValue: 'Join the SaduX network and experience the next generation of management software.'
    },
    // New Fields
    stats_visible: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    teaser_tag: {
        type: DataTypes.STRING,
        defaultValue: 'Enterprise Solutions'
    },
    teaser_title: {
        type: DataTypes.STRING,
        defaultValue: 'Build Your Digital Future'
    },
    teaser_description: {
        type: DataTypes.TEXT,
        defaultValue: 'Need a custom solution? SaduX provides tailored software development to meet your specific business requirements.'
    },
    teaser_button_text: {
        type: DataTypes.STRING,
        defaultValue: 'Consult Now'
    },
    teaser_image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    teaser_features: {
        type: DataTypes.JSON, // Stores array of strings
        defaultValue: ["Custom Software Development", "Enterprise Resource Planning", "Cloud Infrastructure Management", "24/7 Technical Support"]
    },
    background_style: {
        type: DataTypes.STRING,
        defaultValue: 'galaxy'
    },
    active_theme: {
        type: DataTypes.STRING,
        defaultValue: 'modern_tech'
    },
    font_family: {
        type: DataTypes.STRING,
        defaultValue: 'Inter'
    },
    accent_color: {
        type: DataTypes.STRING,
        defaultValue: '#06b6d4' // Cyan-500
    },
    theme_settings: {
        type: DataTypes.JSON,
        defaultValue: {
            // Global
            font_heading: 'Outfit',
            font_body: 'Inter',

            // Buttons
            button_style: 'rounded-xl', // rounded-md, rounded-full, rounded-none
            button_gradient_start: '#3b82f6', // blue-500
            button_gradient_end: '#8b5cf6',   // violet-500

            // Cards (Features, Products)
            card_bg_opacity: 0.08,
            card_border_color: 'rgba(255,255,255,0.1)',
            card_blur: 'xl', // none, sm, md, lg, xl

            // Sections
            section_hero_bg: 'transparent',
            section_ecosystem_bg: 'rgba(0,0,0,0.2)',
            section_features_bg: 'transparent',
            section_stats_bg: 'linear-gradient(to right, rgba(30,58,138,0.2), rgba(21,94,117,0.2))'
        }
    }
});

module.exports = LandingPageContent;
