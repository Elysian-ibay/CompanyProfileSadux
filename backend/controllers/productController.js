const db = require('../models');
const Product = db.Product;

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new product
exports.createProduct = async (req, res) => {
    try {
        const { name, price, description, tag, link } = req.body;
        let imagePath = null;

        if (req.file) {
            imagePath = `/uploads/${req.file.filename}`; // Save relative path
        }

        const product = await Product.create({
            name,
            price,
            description,
            tag,
            link,
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
        const { name, price, description, tag, link } = req.body;
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        let imagePath = product.image;
        if (req.file) {
            imagePath = `/uploads/${req.file.filename}`;
        }

        await product.update({
            name,
            price,
            description,
            tag,
            link,
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
