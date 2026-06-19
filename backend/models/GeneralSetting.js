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
    }
});

module.exports = GeneralSetting;
