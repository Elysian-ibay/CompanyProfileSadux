const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Public: obtain a token
router.post('/login', authController.login);

// Protected: change own password
router.post('/change-password', verifyToken, authController.changePassword);

// Protected: creating new (admin) accounts requires an existing admin.
// The very first admin is created by `npm run db:seed`.
router.post('/register', verifyToken, isAdmin, authController.register);

module.exports = router;
