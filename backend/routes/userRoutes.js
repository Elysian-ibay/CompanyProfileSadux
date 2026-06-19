const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Add auth middleware here if we had it exported, for now we assume global protection or basic usage
// Ideally: router.get('/', verifyToken, isAdmin, userController.getAllUsers);

router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
