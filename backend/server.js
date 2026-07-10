const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const db = require('./models');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS: restrict to allowed origins in production (comma-separated CLIENT_ORIGIN),
// allow all when not configured (local dev).
// Normalize allowed origins (trim + drop trailing slash) so minor typos in
// CLIENT_ORIGIN don't break CORS. Unset => allow all (local dev).
const allowedOrigins = process.env.CLIENT_ORIGIN
    ? process.env.CLIENT_ORIGIN.split(',').map((o) => o.trim().replace(/\/$/, '')).filter(Boolean)
    : null;

app.use(cors({
    origin: (origin, cb) => {
        // Allow same-origin / server-to-server (no Origin header), and allow all when unconfigured.
        if (!origin || !allowedOrigins || allowedOrigins.length === 0) return cb(null, true);
        const clean = origin.replace(/\/$/, '');
        return cb(null, allowedOrigins.includes(clean));
    },
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Folder for Uploads (legacy / local only — production uploads use Supabase Storage)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check / root
app.get('/', (req, res) => {
    res.send('API SaduX Company Profile is running...');
});

// Import Routes
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const contentRoutes = require('./routes/contentRoutes');
const analyticsController = require('./controllers/analyticsController');
const { verifyToken, isAdmin } = require('./middleware/auth');

// Analytics Routes (Inline for simplicity or move to file)
const router = express.Router();
router.post('/visit', analyticsController.trackVisit); // public: visitor tracking
router.get('/dashboard', verifyToken, isAdmin, analyticsController.getDashboardStats); // admin only
app.use('/api/analytics', router);

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/features', require('./routes/featureRoutes'));
app.use('/api/stats', require('./routes/statisticRoutes'));
app.use('/api/cms', require('./routes/cmsRoutes'));
// User routes disabled as per request
// app.use('/api/users', require('./routes/userRoutes'));

// On Vercel (serverless) we DON'T call app.listen() or auto-sync the schema —
// the function is invoked per-request and the DB is migrated separately
// (`npm run db:migrate`). We only start a long-running server for local dev.
if (!process.env.VERCEL) {
    const dbSyncOptions = process.env.NODE_ENV === 'production' ? { force: false } : { alter: true };
    db.sequelize.sync(dbSyncOptions)
        .then(() => {
            console.log('Database connected and synced');
            app.listen(PORT, () => {
                console.log(`Server running on http://localhost:${PORT}`);
            });
        })
        .catch((err) => {
            console.error('Failed to sync database:', err);
        });
}

// Export the Express app so Vercel's @vercel/node builder can use it as the handler.
module.exports = app;
