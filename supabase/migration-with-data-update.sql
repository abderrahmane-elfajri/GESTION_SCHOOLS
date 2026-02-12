-- Migration: Add student fields and update program types
-- This migration updates existing data before changing constraints

-- Step 1: Drop old program constraint FIRST
ALTER TABLE students DROP CONSTRAINT IF EXISTS students_program_check;

-- Step 2: Update ALL existing program values to new types (including typos)
UPDATE students
SET program = 'coiffure'
WHERE program NOT IN ('coiffure', 'coiffure_visagiste', 'esthetique');

-- Optional: Update specific mappings if you want to preserve some logic
UPDATE students SET program = 'coiffure' WHERE program IN ('men', 'coifoure', 'coiffeur');
UPDATE students SET program = 'coiffure_visagiste' WHERE program IN ('women', 'visagiste');
UPDATE students SET program = 'esthetique' WHERE program IN ('mixed', 'esthetique', 'esthétique');

-- Step 3: Add new columns
ALTER TABLE students ADD COLUMN IF NOT EXISTS cin TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS code_massar TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS niveau_scolaire TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS derniere_annee_scolaire TEXT;

-- Step 4: Add new program constraint with new values
ALTER TABLE students ADD CONSTRAINT students_program_check 
  CHECK (program IN ('coiffure', 'coiffure_visagiste', 'esthetique'));

-- Step 5: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_cin ON students(cin);
CREATE INDEX IF NOT EXISTS idx_students_niveau_scolaire ON students(niveau_scolaire);

-- Step 6: Add unique constraint for code_massar (optional but recommended)
CREATE UNIQUE INDEX IF NOT EXISTS idx_students_code_massar_unique ON students(code_massar) WHERE code_massar IS NOT NULL;

-- Step 7: Performance indexes (if not already created)
CREATE INDEX IF NOT EXISTS idx_students_school_id ON students(school_id);
CREATE INDEX IF NOT EXISTS idx_students_created_at ON students(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_student_id ON payments(student_id);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_certificates_student_id ON certificates(student_id);
CREATE INDEX IF NOT EXISTS idx_profiles_school_id ON profiles(school_id);
