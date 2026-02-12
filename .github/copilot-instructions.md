# Copilot Instructions - Gestion Scolaire

This is a Next.js 14 school management application for French professional training schools (Coiffure, Coiffure Visagiste, Esthétique).

## Project Overview

**Tech Stack:**
- Next.js 14.2.35 (App Router, TypeScript)
- Supabase (Postgres + Auth + RLS)
- Tailwind CSS
- Zod validation
- pdf-lib for certificates
- ExcelJS for exports

**Key Features:**
- Multi-school management with role-based access (Admin/Secretary)
- Student CRUD with 16 fields including CIN, Code Massar, Niveau Scolaire
- Monthly payment tracking (10 months per student)
- PDF certificate generation (A4 format)
- Excel export with full student details
- Professional modern UI with gradients and loading states

## Architecture Guidelines

### Routing & Pages
- **Landing page**: `app/page.tsx` - Public homepage with feature showcase
- **Auth**: `app/(auth)/login/page.tsx` - Login page
- **Dashboard**: `app/(dashboard)/` - Protected routes (dashboard, students, admin)
- **API Routes**: `app/api/certificates/` and `app/api/export/`

### Data Flow
1. All data access goes through repositories in `src/lib/repositories/`
2. Use Server Components for data fetching
3. Use Server Actions for mutations
4. Client Components only when needed (forms, interactive UI)

### Database Schema
**Students table fields:**
- Personal: full_name, phone, address
- Documents: cin, code_massar, serial_code (matricule)
- Education: niveau_scolaire (15 levels), derniere_annee_scolaire, school_year
- Program: program (coiffure | coiffure_visagiste | esthetique)
- Payments: 10 monthly payment fields with amounts and dates
- Relations: school_id (foreign key to schools)

### Security Rules
- All routes protected by `middleware.ts` (excludes /api/*, /_next/*, /)
- RLS policies enforce school isolation
- Admin: full access
- Secretary: access only to their assigned school

## Development Guidelines

### Component Patterns
1. **Server Components (default)**:
   ```tsx
   export default async function Page() {
     const data = await fetchData(supabase);
     return <Component data={data} />;
   }
   ```

2. **Client Components (when needed)**:
   ```tsx
   "use client";
   export function Form() { ... }
   ```

3. **Loading States**:
   ```tsx
   <Suspense fallback={<LoadingSkeleton count={3} className="h-20" />}>
     <AsyncComponent />
   </Suspense>
   ```

### Form Validation
- All schemas in `src/lib/schemas/`
- Use Zod for runtime validation
- Display field-level errors with red borders
- Show success messages after actions

### Styling
- Tailwind CSS with custom primaire colors
- Use gradients: `bg-gradient-to-r from-primaire-600 to-primaire-700`
- Error borders: `border-red-300`
- Success messages: green background
- Consistent spacing and rounded corners

### Performance
- Use React Suspense for streaming
- Cache pages with `revalidate` when appropriate
- Optimize database queries with proper indexes
- Use loading skeletons for better UX

## Common Tasks

### Adding a new student field
1. Update `src/lib/database.types.ts` - Row and Insert interfaces
2. Update `src/lib/schemas/student.ts` - Zod schema
3. Update `src/components/students/student-form.tsx` - Add input
4. Update `src/lib/repositories/students.ts` - Include in queries
5. Update `app/api/export/route.ts` - Add to Excel export
6. Create SQL migration in `supabase/` directory

### Creating a new page
1. Create file in `app/(dashboard)/newpage/page.tsx`
2. Add Server Component with data fetching
3. Wrap async parts in Suspense
4. Add navigation link in layout or dashboard

### Adding a new API route
1. Create `app/api/routename/route.ts`
2. Use `createServerSupabaseClient()` for auth
3. Return `NextResponse.json()` or stream response
4. Handle errors with try/catch

## File Locations Reference

- **Student forms**: `src/components/students/student-form.tsx`
- **Student table**: `src/components/students/students-table.tsx`
- **Dashboard**: `app/(dashboard)/dashboard/page.tsx`
- **Auth helpers**: `src/lib/auth.ts`
- **Supabase clients**: `src/lib/supabase/`
- **Database types**: `src/lib/database.types.ts`
- **Schemas**: `src/lib/schemas/`
- **SQL migrations**: `supabase/`

## Environment Variables Required

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Testing Checklist

Before considering a feature complete:
- ✅ TypeScript compilation passes (`npm run build`)
- ✅ No ESLint errors
- ✅ Forms validate correctly with error messages
- ✅ Loading states appear during data fetching
- ✅ Error handling works (try/catch, error boundaries)
- ✅ Mobile responsive design
- ✅ Accessibility labels (aria-label) on interactive elements
- ✅ Success feedback after actions

## Common Pitfalls to Avoid

1. **Don't** use `"use client"` unless necessary (forms, interactive UI)
2. **Don't** fetch data in Client Components (use Server Components)
3. **Don't** forget to handle null/undefined in TypeScript
4. **Don't** create multiple Supabase clients (use existing helpers)
5. **Don't** skip validation (always use Zod schemas)
6. **Don't** forget loading states (use Suspense and LoadingSkeleton)
7. **Don't** hardcode values (use environment variables)
8. **Don't** expose sensitive data in client components

## Current State

✅ **Working:**
- Landing page with professional design
- Authentication flow (landing → login → dashboard)
- Complete student CRUD with all 16 fields
- Program types: Coiffure, Coiffure Visagiste, Esthétique
- Niveau scolaire: 15-level dropdown
- CIN and Code Massar fields
- PDF certificate generation
- Excel export with all fields
- Payment tracking (10 months)
- Admin user management
- Accessibility labels
- Loading skeletons
- Field-level validation

✅ **Database:**
- Schema with RLS policies
- Migration successfully applied
- Indexes created for performance

✅ **Build:**
- Production build passes
- All TypeScript errors fixed
- ESLint passing
- Dev server running on port 3000

## Maintenance Notes

- When adding new fields, always update types, schemas, forms, and exports
- Test build before considering changes complete
- Keep README.md updated with new features
- Use `npm run build` to catch TypeScript errors early
- Clear `.next` cache if experiencing weird behavior

---

**Last Updated:** All errors fixed, production build successful, app running perfectly.
