const db = require('../models');

const migrate = async () => {
    try {
        await db.sequelize.sync({ alter: true });
        console.log('Database synced successfully (Tables created/updated).');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrate();
