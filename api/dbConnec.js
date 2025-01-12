// dbConnec.js

const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

// PostgreSQL connection setup
const pool = new Pool({
    host: process.env.HOST,         // e.g., db.eeonxfszsjuguzrkozmx.supabase.co
    user: process.env.USER,         // e.g., postgres
    password: process.env.PASS,     // Your password
    database: process.env.DB,       // e.g., postgres
    port: process.env.PORTPG || 5432, // Default PostgreSQL port
    ssl: {
        rejectUnauthorized: false,  // Necessary for Supabase
    },
});

module.exports = pool;
