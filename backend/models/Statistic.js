const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Statistic = sequelize.define('Statistic', {
    value: {
        type: DataTypes.STRING, // e.g., '10k+'
        allowNull: false
    },
    label: {
        type: DataTypes.STRING, // e.g., 'Pelanggan Puas'
        allowNull: false
    },
    order: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
});

module.exports = Statistic;
