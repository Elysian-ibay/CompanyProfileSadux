const Sequelize = require('sequelize');
require('dotenv').config();

// Dialect is env-driven so the same code works locally (MySQL/XAMPP)
// and in production (PostgreSQL / Supabase). Default: postgres.
const dialect = process.env.DB_DIALECT || 'postgres';

// Enable SSL automatically for postgres (Supabase requires it), or when DB_SSL=true.
const useSSL = process.env.DB_SSL === 'true' || dialect === 'postgres';

const options = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect,
    logging: false,
    // Small pool: Supabase pooler / serverless functions should not hold many connections.
    pool: {
        max: Number(process.env.DB_POOL_MAX || 3),
        min: 0,
        idle: 10000,
        acquire: 30000,
    },
};

if (useSSL) {
    options.dialectOptions = {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    };
}

// Prefer a single connection string (Supabase gives a URI) when provided,
// otherwise fall back to individual DB_* variables (local dev).
const sequelize = process.env.DATABASE_URL
    ? new Sequelize(process.env.DATABASE_URL, options)
    : new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASS,
        options
    );

module.exports = sequelize;
