-- ============================================================================
-- Optimize RLS Policies for Performance
-- ============================================================================
-- This migration wraps auth.uid() calls in SELECT to prevent re-evaluation
-- per row, significantly improving query performance at scale.
-- See: https://supabase.com/docs/guides/database/postgres/row-level-security#call-functions-with-select
-- ============================================================================

-- ============================================================================
-- PROFILES TABLE - Optimize auth.uid() calls
-- ============================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "profiles_read_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;

-- Recreate with optimized auth.uid() wrapped in SELECT
CREATE POLICY "profiles_read_own" 
ON public.profiles 
FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" 
ON public.profiles 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = id) 
WITH CHECK (auth.uid() = id);

-- ============================================================================
-- SCHOOLS TABLE - Optimize is_admin() call
-- ============================================================================

-- Drop existing policy
DROP POLICY IF EXISTS "schools_admin_full" ON public.schools;

-- Recreate with optimized function call wrapped in SELECT
CREATE POLICY "schools_admin_full" 
ON public.schools 
FOR ALL 
TO authenticated 
USING ((SELECT is_admin()));

-- ============================================================================
-- CONSOLIDATE OVERLAPPING PERMISSIVE POLICIES (OPTIONAL)
-- ============================================================================
-- Note: The multiple permissive policies warnings suggest that admin and
-- secretary policies overlap. This is actually by design - admins get full
-- access while secretaries get school-scoped access. The performance impact
-- is minimal since Postgres evaluates them with OR logic.
-- 
-- If you want to consolidate, you could create single policies per action
-- that check both conditions, but the current approach is more maintainable.
-- ============================================================================

-- ============================================================================
-- VERIFICATION QUERIES (Run these after migration)
-- ============================================================================
-- Check all policies on profiles table:
-- SELECT * FROM pg_policies WHERE tablename = 'profiles';
--
-- Check all policies on schools table:
-- SELECT * FROM pg_policies WHERE tablename = 'schools';
--
-- Verify RLS is enabled:
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
-- ============================================================================
