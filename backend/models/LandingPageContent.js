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
        defaultValue: 'none' // retro theme uses page_bg + dotted grid, no animated background
    },
    active_theme: {
        type: DataTypes.STRING,
        defaultValue: 'retro'
    },
    font_family: {
        type: DataTypes.STRING,
        defaultValue: 'Space Grotesk'
    },
    accent_color: {
        type: DataTypes.STRING,
        defaultValue: '#ffd800' // retro yellow
    },
    theme_settings: {
        type: DataTypes.JSON,
        // Default = Retro / Neobrutalist. Mirrors THEMES.retro in
        // frontend/src/lib/themes.js — keep the two in sync.
        defaultValue: {
            mode: 'light',
            font_heading: 'Space Grotesk',
            font_body: 'Space Grotesk',
            accent: '#ffd800',
            page_bg: '#fdf6e3',
            grid_bg: true,
            text_color: '#1a1a1a',
            heading_color: '#111111',
            muted_color: '#4b4b4b',
            button_style: 'rounded-none',
            button_solid: '#ffd800',
            button_text: '#111111',
            card_bg: '#ffffff',
            card_border_color: '#111111',
            card_border_width: '3px',
            card_shadow: '6px 6px 0 #111111',
            card_radius: '0px',
            card_blur: 'none',
            uppercase_headings: true
        }
    }
});

module.exports = LandingPageContent;
