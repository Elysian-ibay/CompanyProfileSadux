const express = require('express');
const router = express.Router();
const cmsController = require('../controllers/cmsController');
const db = require('../models');
const { verifyToken, isAdmin } = require('../middleware/auth');

// General Settings
router.get('/settings', cmsController.getSettings);
router.put('/settings', verifyToken, isAdmin, cmsController.updateSettings);

// Testimonials
const testimonialCtrl = cmsController.createGenericController(db.Testimonial);
router.get('/testimonials', testimonialCtrl.getAll);
router.post('/testimonials', verifyToken, isAdmin, testimonialCtrl.create);
router.put('/testimonials/:id', verifyToken, isAdmin, testimonialCtrl.update);
router.delete('/testimonials/:id', verifyToken, isAdmin, testimonialCtrl.delete);

// FAQ
const faqCtrl = cmsController.createGenericController(db.Faq);
router.get('/faqs', faqCtrl.getAll);
router.post('/faqs', verifyToken, isAdmin, faqCtrl.create);
router.put('/faqs/:id', verifyToken, isAdmin, faqCtrl.update);
router.delete('/faqs/:id', verifyToken, isAdmin, faqCtrl.delete);

module.exports = router;
