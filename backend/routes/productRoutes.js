const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middleware/upload');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/', productController.getAllProducts);
router.post('/', verifyToken, isAdmin, upload.single('image'), productController.createProduct);
router.put('/:id', verifyToken, isAdmin, upload.single('image'), productController.updateProduct);
router.post('/:id/click', productController.incrementClick); // public: visitor click tracking
router.delete('/:id', verifyToken, isAdmin, productController.deleteProduct);

module.exports = router;
