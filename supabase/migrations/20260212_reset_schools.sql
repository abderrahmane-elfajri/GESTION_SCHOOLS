-- Reset schools table with only 3 schools
-- Add new columns if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='schools' AND column_name='director'
    ) THEN
        ALTER TABLE schools ADD COLUMN director TEXT;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='schools' AND column_name='address'
    ) THEN
        ALTER TABLE schools ADD COLUMN address TEXT;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='schools' AND column_name='phone'
    ) THEN
        ALTER TABLE schools ADD COLUMN phone TEXT;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='schools' AND column_name='authorization'
    ) THEN
        ALTER TABLE schools ADD COLUMN "authorization" TEXT;
    END IF;
END $$;

-- Get IDs of schools that will be kept
CREATE TEMP TABLE schools_to_keep AS 
SELECT id FROM schools WHERE code IN ('EPDI', 'EPD', 'ERN');

-- Migrate students from schools that will be deleted to the first kept school
UPDATE students 
SET school_id = (SELECT id FROM schools WHERE code = 'EPDI' LIMIT 1)
WHERE school_id NOT IN (SELECT id FROM schools_to_keep) 
  AND school_id IS NOT NULL;

-- Migrate profiles from schools that will be deleted to the first kept school  
UPDATE profiles 
SET school_id = (SELECT id FROM schools WHERE code = 'EPDI' LIMIT 1)
WHERE school_id NOT IN (SELECT id FROM schools_to_keep) 
  AND school_id IS NOT NULL;

-- Delete schools that are not in the list
DELETE FROM schools WHERE code NOT IN ('EPDI', 'EPD', 'ERN');

-- Upsert the 3 schools with complete information
INSERT INTO schools (name, code, director, address, phone, "authorization") VALUES
('Ecole la Palme D''or Internationale', 'EPDI', 'KABIRA BAAZA', 'lotissement Dandoune N°154 Sidi maarouf', '0661887729', '3/08/1/2012 DU 25/12/2012'),
('Ecole la Palme D''or', 'EPD', 'KABIRA FRAME', 'lotissement Dandoune N°154 Sidi maarouf', '0661887729', '3/08/1/2012 DU 25/12/2012'),
('Ecole ROSA NISRINE', 'ERN', 'SAID DIYAFI', 'lotissement Dandoune N°154 Sidi maarouf', '0661887729', '3/08/1/2012 DU 25/12/2012')
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  director = EXCLUDED.director,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  "authorization" = EXCLUDED."authorization";

-- Clean up temp table
DROP TABLE schools_to_keep;
