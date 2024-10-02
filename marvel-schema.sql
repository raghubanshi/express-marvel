CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(25) UNIQUE NOT NULL,
  password TEXT NOT NULL
);

CREATE TABLE characters (
    id SERIAL PRIMARY KEY,
    character_id INTEGER UNIQUE NOT NULL,
    name TEXT NOT NULL,
    image TEXT,
    description Text
);

CREATE TABLE user_characters (
    user_id INTEGER NOT NULL,
    character_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, character_id),  -- Composite primary key
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (character_id) REFERENCES characters(character_id) ON DELETE CASCADE
);
