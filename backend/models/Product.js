const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.STRING, // Store as string for flexibility "Rp 150.000" or DECIMAL if calc needed
        allowNull: false
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
