CREATE TABLE IF NOT EXISTS contacts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);
