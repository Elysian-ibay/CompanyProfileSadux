const db = require('../models');
const LandingPageContent = db.LandingPageContent;

exports.getContent = async (req, res) => {
    try {
        let content = await LandingPageContent.findOne();
        if (!content) {
            // Create default if not exists
            content = await LandingPageContent.create({});
        }
        res.status(200).json(content);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateContent = async (req, res) => {
    try {
        const {
            hero_title,
            hero_subtitle,
            hero_description,
            feature_title,
            cta_title,
            cta_description
        } = req.body;

        let content = await LandingPageContent.findOne();
        if (!content) {
            content = await LandingPageContent.create(req.body);
        } else {
            await content.update(req.body);
        }

        res.status(200).json(content);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
