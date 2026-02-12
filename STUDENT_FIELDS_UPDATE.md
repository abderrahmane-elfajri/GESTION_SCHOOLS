# Student Fields Update Summary

## New Fields Added ✅

### 1. CIN (Carte d'Identité Nationale)
- Field for national ID card number
- Optional field in student form

### 2. Code Massar  
- Unique education identifier
- Optional field with unique constraint in database
- Used in Excel export

### 3. Niveau Scolaire (School Level)
- Dropdown selector with all levels from base to Bac:
  - 1ère année → 9ème année (primary)
  - 1ère année collège → 3ème année collège (middle school)
  - Tronc commun (common core)
  - 1ère année Bac → 2ème année Bac (high school)

### 4. Dernière Année Scolaire (Last School Year)
- Free text field for last completed school year
- Format: 2024/2025

## Program Types Updated ✅

Changed from:
- ❌ Hommes (Men)
- ❌ Femmes (Women)  
- ❌ Mixte (Mixed)

To:
- ✅ Coiffure
- ✅ Coiffure Visagiste
- ✅ Esthétique

## Excel Export Enhanced ✅

Now includes ALL student information:
- École (School)
- Nom complet (Full Name)
- **CIN** (NEW)
- **Code Massar** (NEW)
- **Date naissance** (NEW)
- **Lieu naissance** (NEW)
- Téléphone
- **Adresse** (NEW)
- **Père/Mère** (NEW)
- **Profession** (NEW)
- Programme (updated values)
- **Niveau Scolaire** (NEW)
- **Dernière Année** (NEW)
- Année scolaire
- Matricule
- Num. inscription
- 12 months payment status

## Database Changes Required

**Run this SQL in your Supabase SQL Editor:**

```sql
-- File: supabase/add-student-fields.sql

ALTER TABLE students 
ADD COLUMN IF NOT EXISTS cin VARCHAR(50),
ADD COLUMN IF NOT EXISTS code_massar VARCHAR(50),
ADD COLUMN IF NOT EXISTS niveau_scolaire VARCHAR(100),
ADD COLUMN IF NOT EXISTS derniere_annee_scolaire VARCHAR(100);

-- Update program field constraint
ALTER TABLE students DROP CONSTRAINT IF EXISTS students_program_check;
ALTER TABLE students ADD CONSTRAINT students_program_check 
  CHECK (program IN ('coiffure', 'coiffure_visagiste', 'esthetique'));

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_students_cin ON students(cin);
CREATE INDEX IF NOT EXISTS idx_students_code_massar ON students(code_massar);
CREATE INDEX IF NOT EXISTS idx_students_niveau_scolaire ON students(niveau_scolaire);

-- Add unique constraint for Code Massar
CREATE UNIQUE INDEX IF NOT EXISTS idx_students_code_massar_unique 
  ON students(code_massar) WHERE code_massar IS NOT NULL;
```

## Files Modified

1. ✅ `src/lib/schemas/student.ts` - Schema updated
2. ✅ `src/components/students/student-form.tsx` - Form fields added
3. ✅ `app/api/export/route.ts` - Excel export updated with all fields
4. ✅ `src/lib/database.types.ts` - Program type updated
5. ✅ `app/(dashboard)/students/page.tsx` - Program options updated
6. ✅ All formatProgram functions updated

## Testing Checklist

- [ ] Run SQL migration in Supabase
- [ ] Create a new student with all fields
- [ ] Select different "Niveau Scolaire" options
- [ ] Test Code Massar uniqueness
- [ ] Export to Excel and verify all columns appear
- [ ] Check that existing students still work
- [ ] Verify program filter shows new options

## Notes

- Old program values (men/women/mixed) will need manual migration if you have existing data
- Code Massar has unique constraint - each student must have different value
- All new fields are optional except the program dropdown
- Excel export now has 16 student info columns + 12 payment months
