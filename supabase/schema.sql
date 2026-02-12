-- Extensions nécessaires
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- Tables de référence
create table if not exists public.schools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text not null unique,
  created_at timestamptz not null default timezone('utc', now())
);

-- Table profiles liée à auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('admin', 'secretary')),
  school_id uuid references public.schools (id),
  full_name text,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.profiles
  add constraint profiles_school_presence
  check ((role = 'admin' and school_id is null) or (role = 'secretary' and school_id is not null));

-- Séquence pour les matricules élèves
create sequence if not exists public.student_serial_seq start 1000;

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools (id) on delete restrict,
  serial_code text not null unique default ('ELV-' || lpad(nextval('public.student_serial_seq')::text, 6, '0')),
  full_name text not null,
  birth_date date,
  birth_place text,
  address text,
  phone text,
  father_mother text,
  profession text,
  program text check (program in ('men', 'women', 'mixed')),
  school_year text,
  reg_number text,
  reg_date date,
  created_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists students_reg_number_unique on public.students (school_id, reg_number) where reg_number is not null;
create index if not exists students_school_name_idx on public.students (school_id, full_name);
create index if not exists students_phone_idx on public.students (phone);
create index if not exists students_reg_number_idx on public.students (reg_number);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students (id) on delete cascade,
  year int not null,
  month int not null check (month between 1 and 12),
  paid boolean not null default false,
  paid_at timestamptz,
  amount numeric(10, 2),
  created_at timestamptz not null default timezone('utc', now()),
  constraint payments_unique_month unique (student_id, year, month)
);

create index if not exists payments_student_year_month_idx on public.payments (student_id, year, month);

create sequence if not exists public.certificate_seq start 1;

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students (id) on delete cascade,
  school_id uuid not null references public.schools (id) on delete restrict,
  school_year text,
  certificate_no text not null unique default ('CERT-' || to_char(nextval('public.certificate_seq'), 'FM000000')),
  issued_at timestamptz not null default timezone('utc', now()),
  issued_by uuid references auth.users (id)
);

create index if not exists certificates_student_issued_idx on public.certificates (student_id, issued_at desc);

-- Données initiales pour les écoles
insert into public.schools (id, name, code)
values
  (gen_random_uuid(), 'École Horizon Nord', 'S1'),
  (gen_random_uuid(), 'Institut Lumière Sud', 'S2'),
  (gen_random_uuid(), 'Académie Centre Ville', 'S3')
on conflict (code) do nothing;

-- Fonction pour récupérer le profil de l'utilisateur courant
create or replace function public.current_profile()
returns public.profiles
language sql
stable
as $$
  select p
  from public.profiles p
  where p.id = auth.uid();
$$;

-- Fonction utilitaire pour déterminer s'il s'agit d'un admin
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  );
$$;

-- Fonction utilitaire pour connaître l'école liée au profil courant
create or replace function public.current_school_id()
returns uuid
language sql
stable
as $$
  select p.school_id
  from public.profiles p
  where p.id = auth.uid();
$$;

-- Trigger pour créer un profil lors de l'inscription
begin
-- Activation RLS
alter table public.profiles enable row level security;
alter table public.students enable row level security;
alter table public.payments enable row level security;
alter table public.certificates enable row level security;

-- Profils : les admins voient tout, chacun voit son profil
create policy "admin full access" on public.profiles
  for all using (public.is_admin())
  with check (public.is_admin());

create policy "own profile access" on public.profiles
  for select using (auth.uid() = id);

create policy "update own profile" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Students policies
create policy "students admin full" on public.students
  for all using (public.is_admin())
  with check (public.is_admin());

create policy "students secretary by school" on public.students
  for select using (
    public.is_admin()
    or (
      exists (
        select 1
        from public.profiles p
        where p.id = auth.uid()
          and p.role = 'secretary'
          and p.school_id = public.students.school_id
      )
    )
  );

create policy "students secretary modify" on public.students
  for insert with check (
    public.is_admin()
    or (
      exists (
        select 1
        from public.profiles p
        where p.id = auth.uid()
          and p.role = 'secretary'
          and p.school_id = public.students.school_id
      )
    )
  );

create policy "students secretary update" on public.students
  for update using (
    public.is_admin()
    or (
      exists (
        select 1
        from public.profiles p
        where p.id = auth.uid()
          and p.role = 'secretary'
          and p.school_id = public.students.school_id
      )
    )
  )
  with check (
    public.is_admin()
    or (
      exists (
        select 1
        from public.profiles p
        where p.id = auth.uid()
          and p.role = 'secretary'
          and p.school_id = public.students.school_id
      )
    )
  );

create policy "students secretary delete" on public.students
  for delete using (
    public.is_admin()
    or (
      exists (
        select 1
        from public.profiles p
        where p.id = auth.uid()
          and p.role = 'secretary'
          and p.school_id = public.students.school_id
      )
    )
  );

-- Payments policies (basées sur l'école de l'élève)
create policy "payments admin full" on public.payments
  for all using (public.is_admin())
  with check (public.is_admin());

create policy "payments secretary access" on public.payments
  for select using (
    public.is_admin()
    or (
      exists (
        select 1
        from public.students s
        join public.profiles p on p.school_id = s.school_id
        where p.id = auth.uid()
          and p.role = 'secretary'
          and s.id = public.payments.student_id
      )
    )
  );

create policy "payments secretary modify" on public.payments
  for insert with check (
    public.is_admin()
    or (
      exists (
        select 1
        from public.students s
        join public.profiles p on p.school_id = s.school_id
        where p.id = auth.uid()
          and p.role = 'secretary'
          and s.id = public.payments.student_id
      )
    )
  );

create policy "payments secretary update" on public.payments
  for update using (
    public.is_admin()
    or (
      exists (
        select 1
        from public.students s
        join public.profiles p on p.school_id = s.school_id
        where p.id = auth.uid()
          and p.role = 'secretary'
          and s.id = public.payments.student_id
      )
    )
  )
  with check (
    public.is_admin()
    or (
      exists (
        select 1
        from public.students s
        join public.profiles p on p.school_id = s.school_id
        where p.id = auth.uid()
          and p.role = 'secretary'
          and s.id = public.payments.student_id
      )
    )
  );

create policy "payments secretary delete" on public.payments
  for delete using (
    public.is_admin()
    or (
      exists (
        select 1
        from public.students s
        join public.profiles p on p.school_id = s.school_id
        where p.id = auth.uid()
          and p.role = 'secretary'
          and s.id = public.payments.student_id
      )
    )
  );

-- Certificates policies
create policy "certificates admin full" on public.certificates
  for all using (public.is_admin())
  with check (public.is_admin());

create policy "certificates secretary access" on public.certificates
  for select using (
    public.is_admin()
    or (
      exists (
        select 1
        from public.profiles p
        where p.id = auth.uid()
          and p.role = 'secretary'
          and p.school_id = public.certificates.school_id
      )
    )
  );

create policy "certificates secretary modify" on public.certificates
  for insert with check (
    public.is_admin()
    or (
      exists (
        select 1
        from public.profiles p
        where p.id = auth.uid()
          and p.role = 'secretary'
          and p.school_id = public.certificates.school_id
      )
    )
  );

create policy "certificates secretary update" on public.certificates
  for update using (
    public.is_admin()
    or (
      exists (
        select 1
        from public.profiles p
        where p.id = auth.uid()
          and p.role = 'secretary'
          and p.school_id = public.certificates.school_id
      )
    )
  )
  with check (
    public.is_admin()
    or (
      exists (
        select 1
        from public.profiles p
        where p.id = auth.uid()
          and p.role = 'secretary'
          and p.school_id = public.certificates.school_id
      )
    )
  );

create policy "certificates secretary delete" on public.certificates
  for delete using (
    public.is_admin()
    or (
      exists (
        select 1
        from public.profiles p
        where p.id = auth.uid()
          and p.role = 'secretary'
          and p.school_id = public.certificates.school_id
      )
    )
  );
