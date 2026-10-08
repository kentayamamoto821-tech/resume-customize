CREATE TABLE profiles (
  id           SERIAL PRIMARY KEY,
  full_name    TEXT NOT NULL,
  phone        TEXT NOT NULL,
  email        TEXT NOT NULL,
  linkedin_url TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE experiences (
  id         SERIAL PRIMARY KEY,
  profile_id INTEGER NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  company    TEXT NOT NULL,
  title      TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date   TEXT,
  highlights TEXT[] NOT NULL DEFAULT '{}'
);

CREATE TABLE educations (
  id              SERIAL PRIMARY KEY,
  profile_id      INTEGER NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  institution     TEXT NOT NULL,
  degree          TEXT NOT NULL,
  field_of_study  TEXT,
  graduation_year INTEGER
);

CREATE TABLE job_descriptions (
  id         SERIAL PRIMARY KEY,
  raw_text   TEXT,
  source_url TEXT,
  keywords   TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE resumes (
  id                 SERIAL PRIMARY KEY,
  profile_id         INTEGER NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  job_description_id INTEGER NOT NULL REFERENCES job_descriptions(id) ON DELETE CASCADE,
  theme              TEXT NOT NULL,
  content            JSONB NOT NULL,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);
