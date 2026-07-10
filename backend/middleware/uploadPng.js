const multer = require('multer');
const path = require('path');

// Favicon uploader: PNG only, max 500KB, kept in memory (streamed to Supabase Storage).
const uploadPng = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 500 * 1024 }, // 500KB
    fileFilter: function (req, file, cb) {
        const isPng = path.extname(file.originalname).toLowerCase() === '.png' && file.mimetype === 'image/png';
        if (isPng) return cb(null, true);
        cb(new Error('Favicon harus berformat PNG'));
    }
});

module.exports = uploadPng;
