-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email
CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);

-- Create access_token table if it doesn't exist
CREATE TABLE IF NOT EXISTS access_token (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT access_token_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create index on token
CREATE INDEX IF NOT EXISTS access_token_token_idx ON access_token(token);

-- Insert test users if they don't exist
INSERT INTO users (email, created_at, updated_at)
VALUES 
    ('kouaangela606@gmail.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('patrorsvbouake@gmail.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('dialloba@gmail.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (email) DO NOTHING;