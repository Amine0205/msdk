-- Create users table for simple admin management
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL UNIQUE,
  password text NOT NULL, -- NOTE: plain text for initial setup; replace with hashed passwords in production
  role text DEFAULT 'admin',
  created_at timestamptz DEFAULT now()
);

-- Insert default admin user
INSERT INTO users (username, password, role)
VALUES ('admin', '12345', 'admin')
ON CONFLICT (username) DO NOTHING;