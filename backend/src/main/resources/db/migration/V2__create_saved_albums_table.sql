CREATE TABLE IF NOT EXISTS saved_albums (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    apple_catalog_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    artist_name VARCHAR(255) NOT NULL,
    genre VARCHAR(100) NOT NULL,
    release_date DATE,
    track_count INT NOT NULL DEFAULT 0,
    artwork_url VARCHAR(500),
    collection_price NUMERIC(6, 2) DEFAULT 0.00,
    user_rating INT CHECK (user_rating >= 1 AND user_rating <= 5),
    user_notes VARCHAR(1000),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_apple_catalog UNIQUE (user_id, apple_catalog_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_albums_user_id ON saved_albums(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_albums_genre ON saved_albums(user_id, genre);
CREATE INDEX IF NOT EXISTS idx_saved_albums_release_date ON saved_albums(user_id, release_date);
