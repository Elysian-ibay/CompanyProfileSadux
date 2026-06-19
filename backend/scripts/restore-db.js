/**
 * Database Restore Script
 * Restores data from a backup JSON file
 *
 * Usage: node scripts/restore-db.js [backup_file.json]
 * If no file specified, uses the latest backup in backups/ folder
 */

const db = require('../models');
const fs = require('fs');
const path = require('path');

const backupDir = path.join(__dirname, '..', 'backups');

const restore = async () => {
    try {
        let backupFile = process.argv[2];

        // If no file specified, find the latest backup
        if (!backupFile) {
            if (!fs.existsSync(backupDir)) {
                console.error('No backups/ directory found. Run backup-db.js first.');
                process.exit(1);
            }
            const files = fs.readdirSync(backupDir)
                .filter(f => f.endsWith('.json'))
                .sort()
                .reverse();

            if (files.length === 0) {
                console.error('No backup files found in backups/');
                process.exit(1);
            }
            backupFile = path.join(backupDir, files[0]);
            console.log(`Using latest backup: ${files[0]}`);
        }

        // Read backup
        const backupData = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
        console.log(`Backup from: ${backupData.metadata.timestamp}`);
        console.log(`Database: ${backupData.metadata.database}`);
        console.log('');

        // Connect & sync tables
        await db.sequelize.sync({ alter: true });
        console.log('Database synced.');

        const { data } = backupData;

        // Restore in order (respect dependencies)
        const modelMap = [
            ['User', data.users],
            ['GeneralSetting', data.generalSettings],
            ['LandingPageContent', data.landingPageContents],
            ['Product', data.products],
            ['Feature', data.features],
            ['Statistic', data.statistics],
            ['Testimonial', data.testimonials],
            ['Faq', data.faqs],
            // Visitors skipped by default (analytics data, usually not needed)
        ];

        for (const [modelName, rows] of modelMap) {
            if (!rows || rows.length === 0) {
                console.log(`  ${modelName}: skipped (no data)`);
                continue;
            }

            const existing = await db[modelName].count();
            if (existing > 0) {
                console.log(`  ${modelName}: skipped (${existing} rows already exist)`);
                continue;
            }

            await db[modelName].bulkCreate(rows, { ignoreDuplicates: true });
            console.log(`  ${modelName}: restored ${rows.length} rows`);
        }

        console.log('');
        console.log('=== Restore Complete ===');
        process.exit(0);
    } catch (error) {
        console.error('Restore failed:', error.message);
        process.exit(1);
    }
};

restore();
