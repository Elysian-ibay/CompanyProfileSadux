const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/', contentController.getContent);
router.put('/', verifyToken, isAdmin, contentController.updateContent);

module.exports = router;
