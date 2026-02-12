-- Fix RLS recursion by adding security definer to helper functions
-- This prevents infinite loops when checking policies on profiles table

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  );
$$;

create or replace function public.current_school_id()
returns uuid
language sql
stable
security definer
as $$
  select p.school_id
  from public.profiles p
  where p.id = auth.uid();
$$;
