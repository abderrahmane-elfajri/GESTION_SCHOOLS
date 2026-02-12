-- Insert initial schools (will skip if they already exist)
INSERT INTO public.schools (name, code)
VALUES 
  ('École de Coiffure Casablanca', 'COIF-CASA'),
  ('École de Coiffure Rabat', 'COIF-RBAT'),
  ('École d''Esthétique Marrakech', 'ESTH-MARR')
ON CONFLICT (code) DO NOTHING;

-- Show all schools
SELECT id, name, code, created_at FROM public.schools ORDER BY name;
