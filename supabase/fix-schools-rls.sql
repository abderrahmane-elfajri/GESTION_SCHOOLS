-- Fix schools table RLS to allow read access for authenticated users
-- This is needed for joins to work properly

-- Enable RLS on schools table
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read schools
-- This is safe because schools are reference data that all users need to see
CREATE POLICY "schools_read_all" ON public.schools
  FOR SELECT
  TO authenticated
  USING (true);

-- Only admins can insert/update/delete schools
CREATE POLICY "schools_admin_full" ON public.schools
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
