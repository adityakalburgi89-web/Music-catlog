-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create saved_albums table
CREATE TABLE IF NOT EXISTS saved_albums (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    itunes_collection_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    artist VARCHAR(255) NOT NULL,
    genre VARCHAR(100) NOT NULL,
    release_date DATE,
    track_count INT NOT NULL DEFAULT 0,
    price NUMERIC(6, 2) DEFAULT 0.00,
    artwork_url VARCHAR(500),
    rating INT CHECK (rating >= 1 AND rating <= 5),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_itunes_collection UNIQUE (user_id, itunes_collection_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_saved_albums_user_id ON saved_albums(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_albums_genre ON saved_albums(user_id, genre);
CREATE INDEX IF NOT EXISTS idx_saved_albums_release_date ON saved_albums(user_id, release_date);
