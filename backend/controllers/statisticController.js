const db = require('../models');
const Statistic = db.Statistic;

exports.getAll = async (req, res) => {
    try {
        const data = await Statistic.findAll({ order: [['order', 'ASC']] });
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.create = async (req, res) => {
    try {
        const item = await Statistic.create(req.body);
        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const item = await Statistic.findByPk(req.params.id);
        if (!item) return res.status(404).json({ message: "Not found" });
        await item.update(req.body);
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const item = await Statistic.findByPk(req.params.id);
        if (item) await item.destroy();
        res.status(200).json({ message: "Deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
