const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const db = require('./models');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Folder for Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.get('/', (req, res) => {
    res.send('API SaduX Company Profile is running...');
});

// Import Routes
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const contentRoutes = require('./routes/contentRoutes');
const analyticsController = require('./controllers/analyticsController');

// Analytics Routes (Inline for simplicity or move to file)
const router = express.Router();
router.post('/visit', analyticsController.trackVisit);
router.get('/dashboard', analyticsController.getDashboardStats);
app.use('/api/analytics', router);

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/features', require('./routes/featureRoutes'));
app.use('/api/stats', require('./routes/statisticRoutes'));
app.use('/api/cms', require('./routes/cmsRoutes'));
// User routes disabled as per request
// app.use('/api/users', require('./routes/userRoutes'));

// Database Sync & Server Start
const dbSyncOptions = process.env.NODE_ENV === 'production' ? { force: false } : { alter: true }; // Use alter in dev to update columns
db.sequelize.sync(dbSyncOptions) // Set force: true to drop and re-create tables (dev only)
    .then(() => {
        console.log('Database connected and synced');
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Failed to sync database:', err);
    });
