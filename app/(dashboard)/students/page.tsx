import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { fetchCurrentProfile } from "@/lib/auth";
import { studentFiltersSchema } from "@/lib/schemas/student";
import { fetchStudents } from "@/lib/repositories/students";
import { StudentsFilters } from "@/components/students/students-filters";
import { StudentsTable } from "@/components/students/students-table";

export const revalidate = 30; // Cache for 30 seconds
export const fetchCache = 'default-cache';

const PROGRAM_OPTIONS = [
  { value: "coiffure", label: "Coiffure" },
  { value: "coiffure_visagiste", label: "Coiffure Visagiste" },
  { value: "esthetique", label: "Esthétique" }
];

export default async function StudentsPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  try {
    const supabase = createServerSupabaseClient();
    const session = await fetchCurrentProfile(supabase);

    if (!session) {
      redirect("/login");
    }

    const parsedFilters = studentFiltersSchema.safeParse({
      ...searchParams,
      search: typeof searchParams.search === "string" ? searchParams.search : undefined,
      program: typeof searchParams.program === "string" ? searchParams.program : undefined,
      school_year: typeof searchParams.school_year === "string" ? searchParams.school_year : undefined,
      school_id: typeof searchParams.school_id === "string" ? searchParams.school_id : undefined,
      page: typeof searchParams.page === "string" ? searchParams.page : undefined
    });

    const baseFilters = parsedFilters.success ? parsedFilters.data : { page: 1, limit: 20 };

    const enforcedFilters = {
      ...baseFilters,
      school_id: session.role === "secretary" ? session.profile.school_id ?? undefined : baseFilters.school_id
    };

    const [studentsResult, schoolsResult, schoolYearsResult] = await Promise.all([
      fetchStudents(enforcedFilters, supabase).catch(err => {
        console.error("Fetch students error:", err);
        throw new Error(`Erreur lors du chargement des élèves: ${err.message}`);
      }),
      supabase.from("schools").select("id, name").order("name", { ascending: true }).then(result => {
        if (result.error) {
          console.error("Schools query error:", result.error);
          throw new Error(`Erreur lors du chargement des écoles: ${result.error.message}`);
        }
        return result;
      }),
      supabase.from("students").select("school_year").order("school_year", { ascending: false }).then(result => {
        if (result.error) {
          console.error("School years query error:", result.error);
          // Don't throw, this is optional data
          return { data: [] };
        }
        return result;
      })
    ]);

    const { data: students, total, page, limit } = studentsResult;
    const { data: schoolsData } = schoolsResult;
    const { data: schoolYearsData } = schoolYearsResult;

  const yearsRows = (schoolYearsData ?? []) as Array<{ school_year: string | null }>;
  const schoolYears = Array.from(
    new Set(yearsRows.map((row) => row.school_year).filter((year): year is string => Boolean(year)))
  );

  const schools = (schoolsData ?? []) as Array<{ id: string; name: string }>;

  const exportParams = new URLSearchParams();
  if (enforcedFilters.search) exportParams.set("search", enforcedFilters.search);
  if (enforcedFilters.program) exportParams.set("program", enforcedFilters.program);
  if (enforcedFilters.school_year) exportParams.set("school_year", enforcedFilters.school_year);
  if (enforcedFilters.school_id) exportParams.set("school_id", enforcedFilters.school_id);
  exportParams.set("year", new Date().getFullYear().toString());

  const exportUrl = `/api/export?${exportParams.toString()}`;

  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-xl bg-gradient-to-r from-primaire-600 to-primaire-700 p-8 text-white shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Élèves</h1>
            <p className="mt-2 text-primaire-100">Gérez et suivez tous vos élèves en un seul endroit</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/students/new"
              className="flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-primaire-600 shadow-lg transition hover:bg-primaire-50"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nouvel élève
            </Link>
            <Link
              href={exportUrl}
              className="flex items-center gap-2 rounded-lg border-2 border-white bg-transparent px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white hover:text-primaire-600"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Excel
            </Link>
          </div>
        </div>
      </div>

      <StudentsFilters
        programs={PROGRAM_OPTIONS}
        schoolYears={schoolYears}
        schools={schools.map((school) => ({ id: school.id, name: school.name }))}
        isAdmin={session.role === "admin"}
        defaultValues={{
          search: enforcedFilters.search ?? "",
          program: enforcedFilters.program ?? "",
          school_year: enforcedFilters.school_year ?? "",
          school_id: enforcedFilters.school_id ?? ""
        }}
      />

      <StudentsTable students={students} total={total} page={page} limit={limit} />
    </div>
  );
  } catch (error) {
    console.error("Students page error:", error);
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 p-8">
        <svg className="h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="mt-4 text-lg font-semibold text-red-900">Erreur de chargement</h2>
        <p className="mt-2 text-sm text-red-600">
          Impossible de charger la liste des élèves. Vérifiez votre connexion à Supabase.
        </p>
        <p className="mt-1 text-xs text-red-500">{error instanceof Error ? error.message : "Unknown error"}</p>
        <a href="/dashboard" className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
          ← Retour au tableau de bord
        </a>
      </div>
    );
  }
}
