-- 1. The Master Track Table
CREATE TABLE IF NOT EXISTS unified_tracks (
    id TEXT PRIMARY KEY,              -- UUID
    title TEXT NOT NULL,
    artist_name TEXT NOT NULL,
    album_name TEXT,
    duration_ms INTEGER,
    display_image_url TEXT,
    in_library BOOLEAN DEFAULT 0,     -- "True" Library vs "Cache"
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_accessed_at DATETIME
);

-- 2. The Provider Links (The "Physical" Sources)
CREATE TABLE IF NOT EXISTS provider_links (
    unified_id TEXT NOT NULL,
    provider TEXT NOT NULL,           -- 'spotify', 'apple', 'local'
    external_id TEXT NOT NULL,        -- The ID used for playback
    catalog_id TEXT,                  -- The ID used for matching (ISRC/Catalog)
    
    FOREIGN KEY(unified_id) REFERENCES unified_tracks(id) ON DELETE CASCADE,
    PRIMARY KEY (unified_id, provider)
);

-- 3. Settings / Key-Value Store (For Auth Tokens)
CREATE TABLE IF NOT EXISTS kv_store (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);
