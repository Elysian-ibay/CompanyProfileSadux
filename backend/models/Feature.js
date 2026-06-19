const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Feature = sequelize.define('Feature', {
    icon_name: {
        type: DataTypes.STRING, // e.g., 'Star', 'Truck', 'Shield'
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    order: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
});

module.exports = Feature;
