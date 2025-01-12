const db = require('../dbConnec');

// Create a new note
exports.createNote = async (data) => {
    const query = `
        INSERT INTO notes (content, chapter_id, journey_id)
        VALUES ($1, $2, $3)
        RETURNING id;
    `;
    const values = [data.content, data.chapter_id, data.journey_id];
    const result = await db.query(query, values);
    return result.rows[0].id; // Return the newly created note's ID
};

// Get all notes for a specific chapter
exports.getNotesByChapterId = async (chapterId) => {
    const query = `
        SELECT * FROM notes 
        WHERE chapter_id = $1 
        ORDER BY created_at ASC;
    `;
    const result = await db.query(query, [chapterId]);
    return result.rows; // Return all notes for the chapter
};

// Get all notes for a specific journey
exports.getNotesByJourneyId = async (journeyId) => {
    const query = `
        SELECT * FROM notes 
        WHERE journey_id = $1 
        ORDER BY chapter_id ASC, created_at ASC;
    `;
    const result = await db.query(query, [journeyId]);
    return result.rows; // Return all notes for the journey
};

// Get a single note by ID
exports.getNoteById = async (id) => {
    const query = `
        SELECT * FROM notes 
        WHERE id = $1;
    `;
    const result = await db.query(query, [id]);
    return result.rows[0]; // Return the note
};

// Update a note by ID
exports.updateNote = async (id, data) => {
    const query = `
        UPDATE notes 
        SET content = $1, updated_at = CURRENT_TIMESTAMP 
        WHERE id = $2
        RETURNING id;
    `;
    const values = [data.content, id];
    const result = await db.query(query, values);
    return result.rowCount > 0; // Return true if the note was updated
};

// Delete a note by ID
exports.deleteNote = async (id) => {
    const query = `
        DELETE FROM notes 
        WHERE id = $1
        RETURNING id;
    `;
    const result = await db.query(query, [id]);
    return result.rowCount > 0; // Return true if the note was deleted
};
