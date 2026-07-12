const db = require('../models');
const GeneralSetting = db.GeneralSetting;
const { uploadFile } = require('../utils/storage');

// Shared helper: upload a branding image to Supabase Storage and store its URL
// in the given GeneralSetting field (site_logo / site_favicon).
async function uploadBranding(req, res, field) {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
        const url = await uploadFile(req.file, 'branding');
        let settings = await GeneralSetting.findOne();
        if (!settings) settings = await GeneralSetting.create({});
        await settings.update({ [field]: url });
        res.status(200).json({ url, settings });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.uploadLogo = (req, res) => uploadBranding(req, res, 'site_logo');
exports.uploadFavicon = (req, res) => uploadBranding(req, res, 'site_favicon');

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

// ── Clients (Pengguna SaduX) ──────────────────────────────────────────────────
exports.getClients = async (req, res) => {
    try {
        const clients = await db.Client.findAll({ order: [['order', 'ASC'], ['id', 'ASC']] });
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createClient = async (req, res) => {
    try {
        const client = await db.Client.create(req.body);
        res.status(201).json(client);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateClient = async (req, res) => {
    try {
        const client = await db.Client.findByPk(req.params.id);
        if (!client) return res.status(404).json({ message: 'Not found' });
        await client.update(req.body);
        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteClient = async (req, res) => {
    try {
        const client = await db.Client.findByPk(req.params.id);
        if (client) await client.destroy();
        res.status(200).json({ message: 'Deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.uploadClientLogo = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
        const url = await uploadFile(req.file, 'clients');
        const client = await db.Client.findByPk(req.params.id);
        if (!client) return res.status(404).json({ message: 'Client not found' });
        await client.update({ logo: url });
        res.status(200).json({ url, client });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

