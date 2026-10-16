-- Imported files (PDFs). The bytes live in the row so the app needs no file storage.
CREATE TABLE documents (
  id         SERIAL PRIMARY KEY,
  file_name  TEXT NOT NULL,
  mime_type  TEXT NOT NULL,
  size_bytes INTEGER NOT NULL CHECK (size_bytes > 0),
  content    BYTEA NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX documents_created_at_idx ON documents (created_at DESC);
