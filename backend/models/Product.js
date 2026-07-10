const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.STRING, // Label/tier price, e.g. "FREE", "Subscription"
        allowNull: false
    },
    price_monthly: {
        type: DataTypes.STRING, // e.g. "Rp 150.000" (per bulan) — optional
        allowNull: true
    },
    price_yearly: {
        type: DataTypes.STRING, // e.g. "Rp 1.500.000" (per tahun) — optional
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    image: {
        type: DataTypes.STRING, // Path to image
        allowNull: true
    },
    link: {
        type: DataTypes.STRING,
        allowNull: true
    },
    tag: {
        type: DataTypes.STRING,
        allowNull: true
    },
    click_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    order: {
        type: DataTypes.INTEGER,
        defaultValue: 0 // display order (ASC) — set via drag-and-drop in admin
    }
});

module.exports = Product;
