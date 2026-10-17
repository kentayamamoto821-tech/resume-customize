-- Step 1 of the profile editor: job title, work experience details, ordering, and
-- per-field "show on resume" settings.
--
-- Visibility maps are JSON objects of { fieldName: boolean }. A missing key means
-- "shown", so '{}' shows everything and fields added later are visible by default.
-- The allowed keys are defined by the shared zod schemas, not the database.

-- users ---------------------------------------------------------------------
ALTER TABLE users
  ADD COLUMN job_title  TEXT,
  ADD COLUMN visibility JSONB NOT NULL DEFAULT '{}'
    CONSTRAINT users_visibility_is_object CHECK (jsonb_typeof(visibility) = 'object');

-- experiences (worked companies) --------------------------------------------
-- Never written by the app before this migration, so changing types is safe.
ALTER TABLE experiences RENAME COLUMN company TO company_name;
ALTER TABLE experiences RENAME COLUMN title TO role_title;

-- Periods are month-precision dates (stored as the 1st of the month);
-- end_date NULL means "Present".
ALTER TABLE experiences
  ALTER COLUMN start_date TYPE DATE USING NULLIF(start_date, '')::date,
  ALTER COLUMN end_date   TYPE DATE USING NULLIF(end_date, '')::date;

ALTER TABLE experiences
  ADD COLUMN company_address TEXT,
  ADD COLUMN sort_order      INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN show_in_resume  BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN visibility      JSONB   NOT NULL DEFAULT '{}',
  ADD CONSTRAINT experiences_visibility_is_object CHECK (jsonb_typeof(visibility) = 'object'),
  ADD CONSTRAINT experiences_start_is_month CHECK (start_date = date_trunc('month', start_date)::date),
  ADD CONSTRAINT experiences_end_is_month CHECK (end_date = date_trunc('month', end_date)::date),
  ADD CONSTRAINT experiences_period_order CHECK (end_date IS NULL OR end_date >= start_date);

-- educations ----------------------------------------------------------------
ALTER TABLE educations
  ADD COLUMN sort_order     INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN show_in_resume BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN visibility     JSONB   NOT NULL DEFAULT '{}',
  ADD CONSTRAINT educations_visibility_is_object CHECK (jsonb_typeof(visibility) = 'object'),
  ADD CONSTRAINT educations_graduation_year_range CHECK (graduation_year BETWEEN 1900 AND 2100);

-- Entries are always read per user in display order.
DROP INDEX experiences_user_id_idx;
DROP INDEX educations_user_id_idx;
CREATE INDEX experiences_user_order_idx ON experiences (user_id, sort_order);
CREATE INDEX educations_user_order_idx ON educations (user_id, sort_order);
