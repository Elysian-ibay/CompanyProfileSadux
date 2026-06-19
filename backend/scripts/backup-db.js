/**
 * Database Backup Script
 * Exports semua data dari database ke file JSON
 *
 * Usage: node scripts/backup-db.js
 * Output: backend/backups/backup_YYYY-MM-DD_HH-mm-ss.json
 */

const db = require('../models');
const fs = require('fs');
const path = require('path');

const backupDir = path.join(__dirname, '..', 'backups');

const backup = async () => {
    try {
        // Connect
        await db.sequelize.authenticate();
        console.log('Connected to database:', process.env.DB_NAME);

        // Ensure backup directory exists
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }

        // Fetch all data from all tables
        console.log('Fetching data from all tables...');
        const [
            users,
            products,
            content,
            features,
            statistics,
            testimonials,
            faqs,
            settings,
            visitors
        ] = await Promise.all([
            db.User.findAll({ raw: true }),
            db.Product.findAll({ raw: true }),
            db.LandingPageContent.findAll({ raw: true }),
            db.Feature.findAll({ order: [['order', 'ASC']], raw: true }),
            db.Statistic.findAll({ order: [['order', 'ASC']], raw: true }),
            db.Testimonial.findAll({ raw: true }),
            db.Faq.findAll({ order: [['order', 'ASC']], raw: true }),
            db.GeneralSetting.findAll({ raw: true }),
            db.Visitor.findAll({ raw: true })
        ]);

        const backupData = {
            metadata: {
                database: process.env.DB_NAME,
                timestamp: new Date().toISOString(),
                tables: {
                    users: users.length,
                    products: products.length,
                    landingPageContents: content.length,
                    features: features.length,
                    statistics: statistics.length,
                    testimonials: testimonials.length,
                    faqs: faqs.length,
                    generalSettings: settings.length,
                    visitors: visitors.length
                }
            },
            data: {
                users,
                products,
                landingPageContents: content,
                features,
                statistics,
                testimonials,
                faqs,
                generalSettings: settings,
                visitors
            }
        };

        // Generate filename with timestamp
        const now = new Date();
        const timestamp = now.toISOString().replace(/[T:]/g, '-').split('.')[0];
        const filename = `backup_${timestamp}.json`;
        const filepath = path.join(backupDir, filename);

        // Write backup file
        fs.writeFileSync(filepath, JSON.stringify(backupData, null, 2), 'utf8');

        console.log('');
        console.log('=== Backup Complete ===');
        console.log(`File: ${filepath}`);
        console.log(`Size: ${(fs.statSync(filepath).size / 1024).toFixed(1)} KB`);
        console.log('');
        console.log('Table counts:');
        Object.entries(backupData.metadata.tables).forEach(([table, count]) => {
            console.log(`  ${table}: ${count} rows`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Backup failed:', error.message);
        process.exit(1);
    }
};

backup();
