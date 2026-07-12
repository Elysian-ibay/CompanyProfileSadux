const db = require('../models');
const Product = db.Product;
const { uploadFile } = require('../utils/storage');

// Get all products (ordered by display order, then id)
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll({ order: [['order', 'ASC'], ['id', 'ASC']] });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Reorder products — body: { ids: [id1, id2, ...] } in the desired order
exports.reorderProducts = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids)) {
            return res.status(400).json({ message: 'ids must be an array' });
        }
        await Promise.all(
            ids.map((id, index) => Product.update({ order: index }, { where: { id } }))
        );
        const products = await Product.findAll({ order: [['order', 'ASC'], ['id', 'ASC']] });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const parsePlatform = (raw) => {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    try { return JSON.parse(raw); } catch { return []; }
};

// Create a new product
exports.createProduct = async (req, res) => {
    try {
        const { name, price, pricing_type, price_monthly, price_yearly, description, tag, link, platform } = req.body;
        let imagePath = null;

        if (req.file) {
            imagePath = await uploadFile(req.file, 'products'); // Supabase public URL
        }

        const product = await Product.create({
            name,
            price,
            pricing_type: pricing_type || 'monthly',
            price_monthly,
            price_yearly,
            description,
            tag,
            link,
            platform: parsePlatform(platform),
            image: imagePath
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Update a product
exports.updateProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, price, pricing_type, price_monthly, price_yearly, description, tag, link, platform } = req.body;
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        let imagePath = product.image;
        if (req.file) {
            imagePath = await uploadFile(req.file, 'products'); // Supabase public URL
        }

        await product.update({
            name,
            price,
            pricing_type: pricing_type || product.pricing_type || 'monthly',
            price_monthly,
            price_yearly,
            description,
            tag,
            link,
            platform: parsePlatform(platform),
            image: imagePath
        });

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        await product.destroy();
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Increment Product Click (Async)
exports.incrementClick = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findByPk(id);
        if (product) {
            await product.increment('click_count');
            res.status(200).json({ message: 'Click counted' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
