CREATE TABLE IF NOT EXISTS ${tasks} (
    id SERIAL PRIMARY KEY,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT REFERENCES users(id),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL CHECK (end_time > start_time),
    DESCRIPTION TEXT NOT NULL
);