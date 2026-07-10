require('dotenv').config();

const dialect = process.env.DB_DIALECT || 'postgres';

// Supabase/PostgreSQL: the `postgres` database already exists — nothing to create.
// This step only applies to a local MySQL (XAMPP) setup.
if (dialect !== 'mysql') {
    console.log(`DB_DIALECT="${dialect}" — skipping CREATE DATABASE (database is managed by the provider, e.g. Supabase).`);
    console.log('Run "npm run db:migrate" to create the tables.');
    process.exit(0);
}

const mysql = require('mysql2/promise');
const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = process.env;

async function createDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASS
        });

        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
        console.log(`Database '${DB_NAME}' created or already exists.`);

        await connection.end();
    } catch (error) {
        console.error('Error creating database:', error);
        process.exit(1);
    }
}

createDatabase();
