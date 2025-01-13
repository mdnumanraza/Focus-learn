// dbConnec.js

const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASS,
    database: process.env.DB,
    port: process.env.PORTPG || 5432,
    ssl: {
        rejectUnauthorized: false,
    },
});

pool.connect((err) => {
    if (err) {
        console.error('Database connection error:', err.stack);
    } else {
        console.log('Connected to database!');
    }
});

module.exports = pool;

