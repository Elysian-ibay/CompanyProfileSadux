const express = require('express');
const router = express.Router();
const cmsController = require('../controllers/cmsController');
const db = require('../models');

// General Settings
router.get('/settings', cmsController.getSettings);
router.put('/settings', cmsController.updateSettings);

// Testimonials
const testimonialCtrl = cmsController.createGenericController(db.Testimonial);
router.get('/testimonials', testimonialCtrl.getAll);
router.post('/testimonials', testimonialCtrl.create);
router.put('/testimonials/:id', testimonialCtrl.update);
router.delete('/testimonials/:id', testimonialCtrl.delete);

// FAQ
const faqCtrl = cmsController.createGenericController(db.Faq);
router.get('/faqs', faqCtrl.getAll);
router.post('/faqs', faqCtrl.create);
router.put('/faqs/:id', faqCtrl.update);
router.delete('/faqs/:id', faqCtrl.delete);

module.exports = router;
