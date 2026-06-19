const db = require('../models');
const Visitor = db.Visitor;
const Product = db.Product;
const { Op } = require('sequelize');

// Track a visit
exports.trackVisit = async (req, res) => {
    try {
        const ip_address = req.ip || req.connection.remoteAddress;
        const user_agent = req.headers['user-agent'];

        // Simple duplicate check effectively done by creating new rows. 
        // For unique visitors count, we can query distinct IPs later.
        await Visitor.create({ ip_address, user_agent });
        res.status(200).send('Visit recorded');
    } catch (error) {
        console.error("Tracking Error:", error);
        res.status(500).send('Error');
    }
};

// Get Dashboard Stats
exports.getDashboardStats = async (req, res) => {
    try {
        // Total Visitors (Unique IPs)
        const totalVisitors = await Visitor.count({
            distinct: true,
            col: 'ip_address'
        });

        const totalProducts = await Product.count();

        // Top Performing Products (by Clicks)
        const topProducts = await Product.findAll({
            order: [['click_count', 'DESC']],
            limit: 5
        });

        // Calculate total clicks
        const totalClicks = await Product.sum('click_count') || 0;

        res.json({
            visitors: totalVisitors,
            products: totalProducts,
            clicks: totalClicks,
            topProducts
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
