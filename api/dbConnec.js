const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

// PostgreSQL connection setup using pooler URL
const pool = new Pool({
    connectionString: process.env.DB_URL,
    ssl: {
        rejectUnauthorized: false, // Required for Supabase
    },
});

pool.connect((err) => {
    if (err) {
        console.error('Database connection error:', err.stack);
    } else {
        console.log('Connected to the database through pooling!');
    }
});

module.exports = pool;
