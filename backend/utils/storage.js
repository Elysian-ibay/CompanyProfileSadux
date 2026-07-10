const path = require('path');
const supabase = require('../config/supabase');

const BUCKET = process.env.SUPABASE_BUCKET || 'uploads';

// Ensure the storage bucket exists (run once per cold start). Requires service role key.
let bucketReady = false;
async function ensureBucket() {
    if (bucketReady || !supabase) return;
    try {
        const { data: buckets } = await supabase.storage.listBuckets();
        const exists = buckets && buckets.some((b) => b.name === BUCKET);
        if (!exists) {
            await supabase.storage.createBucket(BUCKET, { public: true });
            console.log(`[storage] Created public bucket "${BUCKET}"`);
        }
        bucketReady = true;
    } catch (err) {
        // Non-fatal: bucket may already exist or perms differ; upload will surface real errors.
        console.warn('[storage] ensureBucket warning:', err.message);
    }
}

/**
 * Upload an in-memory file (from multer memoryStorage) to Supabase Storage.
 * Returns the public URL of the uploaded object.
 * @param {Express.Multer.File} file - req.file (must have .buffer)
 * @param {string} folder - subfolder inside the bucket (e.g. 'products')
 * @returns {Promise<string>} public URL
 */
async function uploadFile(file, folder = 'products') {
    if (!supabase) {
        throw new Error('Supabase Storage is not configured (SUPABASE_URL / SUPABASE_SERVICE_KEY missing).');
    }
    await ensureBucket();

    const ext = path.extname(file.originalname) || '';
    const safeBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '');
    const filename = `${folder}/${safeBase}-${Date.now()}${ext}`;

    const { error } = await supabase.storage
        .from(BUCKET)
        .upload(filename, file.buffer, {
            contentType: file.mimetype,
            upsert: false,
        });

    if (error) throw error;

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename);
    return data.publicUrl;
}

module.exports = { uploadFile, ensureBucket, BUCKET };
