-- Simple migration to add schools with all info
-- Add columns
ALTER TABLE schools ADD COLUMN IF NOT EXISTS director TEXT;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS "authorization" TEXT;

-- Insert schools with correct data
INSERT INTO schools (name, code, director, address, phone, "authorization") VALUES
('Ecole la Palme D''or Internationale', 'EPDI', 'KEBIRA BAAZA', 'lotissement Dandoune N°154 Sidi maarouf', '0667622925', '3/08/1/2012 DU 25/12/2012'),
('Ecole la Palme D''or', 'EPD', 'KABIRA LE FRAME', 'lotissement Haddioui N°503 Sidi maarouf', '0661887729', '3/08/1/2002 DU 28/02/2002'),
('Ecole ROSA NISRINE', 'ERN', 'SAID DIYAFI', '40 rue 48 oulfa Hay Hassani', '0668798131', '3/08/2/2001 DU 15/02/2001')
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  director = EXCLUDED.director,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  "authorization" = EXCLUDED."authorization";
