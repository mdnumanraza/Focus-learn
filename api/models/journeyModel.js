const db = require('../dbConnec');

// Create a new journey
exports.createJourney = async (data) => {
    const title = data.title || 'Untitled Journey';
    const description = data.description || '';
    const is_public = data.is_public !== undefined ? data.is_public : true;
    const user_id = data.user_id || null;

    const query = `
        INSERT INTO journeys (title, description, is_public, user_id)
        VALUES ($1, $2, $3, $4)
        RETURNING id;
    `;
    const values = [title, description, is_public, user_id];
    const result = await db.query(query, values);
    return result.rows[0].id; // Return the inserted journey ID
};

// Get all journeys for a specific user
exports.getAllJourneys = async (userId) => {
    const query = `SELECT * FROM journeys WHERE user_id = $1;`;
    const result = await db.query(query, [userId]);
    return result.rows; // Return the rows
};

// Get a journey by ID
exports.getJourneyById = async (id) => {
    const query = `SELECT * FROM journeys WHERE id = $1;`;
    const result = await db.query(query, [id]);
    return result.rows[0]; // Return the journey
};

// Update a journey
exports.updateJourney = async (id, data) => {
    const query = `
        UPDATE journeys
        SET title = $1, description = $2, is_public = $3
        WHERE id = $4 AND user_id = $5
        RETURNING id;
    `;
    const values = [data.title, data.description, data.is_public, id, data.user_id];
    const result = await db.query(query, values);
    return result.rowCount > 0; // Return true if the journey was updated
};

// Delete a journey
exports.deleteJourney = async (id, userId) => {
    const query = `DELETE FROM journeys WHERE id = $1 AND user_id = $2 RETURNING id;`;
    const result = await db.query(query, [id, userId]);
    return result.rowCount > 0; // Return true if the journey was deleted
};

// Fork a journey
exports.forkJourney = async (journeyId, userId) => {
    const client = await db.connect();
    try {
        await client.query('BEGIN');

        // Step 1: Get the original journey details
        const journeyQuery = `SELECT * FROM journeys WHERE id = $1;`;
        const journeyResult = await client.query(journeyQuery, [journeyId]);
        if (journeyResult.rowCount === 0) throw new Error('Journey not found');
        const originalJourney = journeyResult.rows[0];

        // Step 2: Create a new journey
        const newJourneyQuery = `
            INSERT INTO journeys (title, description, user_id, is_public)
            VALUES ($1, $2, $3, $4)
            RETURNING id;
        `;
        const newJourneyValues = [originalJourney.title || 'Untitled', originalJourney.description || '', userId, false];
        const newJourneyResult = await client.query(newJourneyQuery, newJourneyValues);
        const newJourneyId = newJourneyResult.rows[0].id;

        // Step 3: Copy chapters
        const chapterQuery = `SELECT * FROM chapters WHERE journey_id = $1;`;
        const chapters = await client.query(chapterQuery, [journeyId]);
        const chapterIdMap = {};

        for (const chapter of chapters.rows) {
            const newChapterQuery = `
                INSERT INTO chapters (title, description, video_link, chapter_no, journey_id)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id;
            `;
            const newChapterValues = [
                chapter.title || 'Untitled',
                chapter.description || '',
                chapter.video_link || '',
                chapter.chapter_no,
                newJourneyId,
            ];
            const newChapterResult = await client.query(newChapterQuery, newChapterValues);
            chapterIdMap[chapter.id] = newChapterResult.rows[0].id;
        }

        // Step 4: Copy notes
        const notesQuery = `SELECT * FROM notes WHERE journey_id = $1;`;
        const notes = await client.query(notesQuery, [journeyId]);

        for (const note of notes.rows) {
            const newChapterId = chapterIdMap[note.chapter_id];
            if (newChapterId) {
                const newNoteQuery = `
                    INSERT INTO notes (content, chapter_id, journey_id)
                    VALUES ($1, $2, $3);
                `;
                const newNoteValues = [note.content, newChapterId, newJourneyId];
                await client.query(newNoteQuery, newNoteValues);
            }
        }

        await client.query('COMMIT');
        return newJourneyId;
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error forking journey:', error);
        throw error;
    } finally {
        client.release();
    }
};

// Get all public journeys
exports.getAllPublicJourneys = async () => {
    const query = `
        SELECT journeys.id, journeys.title, journeys.description, journeys.is_public, users.username
        FROM journeys
        JOIN users ON journeys.user_id = users.id
        WHERE journeys.is_public = TRUE;
    `;
    const result = await db.query(query);
    return result.rows; // Return all public journeys
};
