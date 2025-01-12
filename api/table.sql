-- Table: users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Table: journeys 
CREATE TABLE journeys (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    is_public BOOLEAN NOT NULL DEFAULT TRUE,
    user_id INT,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table: chapters
CREATE TABLE chapters (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    video_link VARCHAR(255) NOT NULL,
    external_link VARCHAR(255),
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    chapter_no INT NOT NULL,
    journey_id INT,
    CONSTRAINT fk_journey FOREIGN KEY (journey_id) REFERENCES journeys(id) ON DELETE CASCADE
);

-- Table: forked_journeys
CREATE TABLE forked_journeys (
    id SERIAL PRIMARY KEY,
    user_id INT,
    original_journey_id INT,
    CONSTRAINT fk_user_fork FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_original_journey FOREIGN KEY (original_journey_id) REFERENCES journeys(id) ON DELETE CASCADE
);

-- Table: notes
CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    chapter_id INT NOT NULL,
    journey_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_chapter FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE,
    CONSTRAINT fk_journey_note FOREIGN KEY (journey_id) REFERENCES journeys(id) ON DELETE CASCADE
);

-- Trigger for auto-updating "updated_at" column in notes table
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON notes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();
