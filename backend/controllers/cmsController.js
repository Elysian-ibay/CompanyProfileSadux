const db = require('../models');
const GeneralSetting = db.GeneralSetting;

exports.getSettings = async (req, res) => {
    try {
        let settings = await GeneralSetting.findOne();
        if (!settings) {
            settings = await GeneralSetting.create({});
        }
        res.status(200).json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateSettings = async (req, res) => {
    try {
        let settings = await GeneralSetting.findOne();
        if (!settings) {
            settings = await GeneralSetting.create(req.body);
        } else {
            await settings.update(req.body);
        }
        res.status(200).json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Generic CRUD for simple models (Testimonial, Faq) to save file creation time
exports.createGenericController = (Model) => ({
    getAll: async (req, res) => {
        try {
            const data = await Model.findAll({ order: [['createdAt', 'DESC']] });
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    create: async (req, res) => {
        try {
            const item = await Model.create(req.body);
            res.status(201).json(item);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    update: async (req, res) => {
        try {
            const item = await Model.findByPk(req.params.id);
            if (!item) return res.status(404).json({ message: "Not found" });
            await item.update(req.body);
            res.status(200).json(item);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    delete: async (req, res) => {
        try {
            const item = await Model.findByPk(req.params.id);
            if (item) await item.destroy();
            res.status(200).json({ message: "Deleted" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
});
