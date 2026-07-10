const express = require('express');
const router = express.Router();
const cmsController = require('../controllers/cmsController');
const db = require('../models');
const { verifyToken, isAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');       // images, 5MB
const uploadPng = require('../middleware/uploadPng');  // PNG only, 500KB

// Wrap a multer middleware so limit/type errors return clean JSON (not HTML 500).
const handleUpload = (mw, tooBigMsg) => (req, res, next) => {
    mw.single('image')(req, res, (err) => {
        if (err) {
            const msg = err.code === 'LIMIT_FILE_SIZE' ? tooBigMsg : (err.message || 'Upload gagal');
            return res.status(400).json({ message: msg });
        }
        next();
    });
};

// General Settings
router.get('/settings', cmsController.getSettings);
router.put('/settings', verifyToken, isAdmin, cmsController.updateSettings);

// Branding uploads (Supabase Storage)
router.post('/logo', verifyToken, isAdmin, handleUpload(upload, 'Ukuran logo maksimal 5MB'), cmsController.uploadLogo);
router.post('/favicon', verifyToken, isAdmin, handleUpload(uploadPng, 'Ukuran favicon maksimal 500KB'), cmsController.uploadFavicon);

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
