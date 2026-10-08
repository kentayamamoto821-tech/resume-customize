-- The candidate profile is the app's user record: rename profiles -> users.
ALTER TABLE profiles RENAME TO users;
ALTER SEQUENCE profiles_id_seq RENAME TO users_id_seq;
ALTER INDEX profiles_pkey RENAME TO users_pkey;

ALTER TABLE users ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE users ADD CONSTRAINT users_email_key UNIQUE (email);

ALTER TABLE experiences RENAME COLUMN profile_id TO user_id;
ALTER TABLE experiences RENAME CONSTRAINT experiences_profile_id_fkey TO experiences_user_id_fkey;

ALTER TABLE educations RENAME COLUMN profile_id TO user_id;
ALTER TABLE educations RENAME CONSTRAINT educations_profile_id_fkey TO educations_user_id_fkey;

ALTER TABLE resumes RENAME COLUMN profile_id TO user_id;
ALTER TABLE resumes RENAME CONSTRAINT resumes_profile_id_fkey TO resumes_user_id_fkey;

CREATE INDEX experiences_user_id_idx ON experiences (user_id);
CREATE INDEX educations_user_id_idx ON educations (user_id);
CREATE INDEX resumes_user_id_idx ON resumes (user_id);
