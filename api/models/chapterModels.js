const db = require('../dbConnec');

// Create a new chapter
exports.createChapter = async (data) => {
    const query = `
        INSERT INTO chapters (title, description, video_link, chapter_no, journey_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id;
    `;
    const values = [data.title, data.description, data.video_link, data.chapter_no, data.journey_id];
    const result = await db.query(query, values);
    return result.rows[0].id; // Return the inserted chapter ID
};

// Get all chapters for a specific journey
exports.getChaptersByJourneyId = async (journeyId) => {
    const query = `
        SELECT * FROM chapters
        WHERE journey_id = $1
        ORDER BY chapter_no ASC;
    `;
    const result = await db.query(query, [journeyId]);
    return result.rows; // Return the chapters
};

// Get a chapter by its ID
exports.getChapterById = async (id) => {
    const query = `
        SELECT * FROM chapters
        WHERE id = $1;
    `;
    const result = await db.query(query, [id]);
    return result.rows[0]; // Return the chapter
};

// Update a chapter
exports.updateChapter = async (id, data) => {
    const query = `
        UPDATE chapters
        SET title = $1, description = $2, video_link = $3, chapter_no = $4
        WHERE id = $5
        RETURNING id;
    `;
    const values = [data.title, data.description, data.video_link, data.chapter_no, id];
    const result = await db.query(query, values);
    return result.rowCount > 0; // Return true if the chapter was updated
};

// Mark a chapter as complete or incomplete
exports.updateChapterComplete = async (id, data) => {
    const query = `
        UPDATE chapters
        SET is_completed = $1
        WHERE id = $2
        RETURNING id;
    `;
    const values = [data.is_completed, id];
    const result = await db.query(query, values);
    return result.rowCount > 0; // Return true if the chapter's completion status was updated
};

// Delete a chapter
exports.deleteChapter = async (id) => {
    const query = `
        DELETE FROM chapters
        WHERE id = $1
        RETURNING id;
    `;
    const result = await db.query(query, [id]);
    return result.rowCount > 0; // Return true if the chapter was deleted
};
