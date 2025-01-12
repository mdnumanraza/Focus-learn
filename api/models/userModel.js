const db = require('../dbConnec');

// Create a new user
exports.createUser = async (data) => {
    const query = `
        INSERT INTO users (username, email, password) 
        VALUES ($1, $2, $3) 
        RETURNING id;
    `;
    const values = [data.username, data.email, data.password];
    const result = await db.query(query, values);
    return result.rows[0].id; // Return the inserted user ID
};

// Find a user by email
exports.findUserByEmail = async (email) => {
    const query = 'SELECT * FROM users WHERE email = $1;';
    const result = await db.query(query, [email]);
    return result.rows[0]; // Return the first matching user
};

// Find a user by ID
exports.findUserById = async (id) => {
    const query = 'SELECT * FROM users WHERE id = $1;';
    const result = await db.query(query, [id]);
    return result.rows[0]; // Return the user with the given ID
};

// Find all users
exports.findAllUsers = async () => {
    const query = 'SELECT * FROM users;';
    const result = await db.query(query);
    return result.rows; // Return all users
};
