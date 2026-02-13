import type { Tables, TablesInsert, TablesUpdate } from "@/lib/database.types";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { StudentFilters, StudentFormInput } from "@/lib/schemas/student";

export type StudentWithSchool = Tables<"students"> & {
  schools: Pick<Tables<"schools">, "id" | "name" | "code" | "director" | "address" | "phone" | "authorization">;
};

interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export const fetchStudents = async (
  filters: StudentFilters,
  client?: ReturnType<typeof createServerSupabaseClient>
): Promise<PaginatedResult<StudentWithSchool>> => {
  const supabase = client ?? createServerSupabaseClient();
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // Query students first
  let query = supabase
    .from("students")
    .select("*", { count: "exact" })
    .order("full_name", { ascending: true })
    .range(from, to);

  if (filters.school_id) {
    query = query.eq("school_id", filters.school_id);
  }

  if (filters.program) {
    query = query.eq("program", filters.program);
  }

  if (filters.school_year) {
    query = query.eq("school_year", filters.school_year);
  }

  if (filters.search) {
    const term = `%${filters.search.trim()}%`;
    query = query.or(
      `full_name.ilike.${term},phone.ilike.${term},reg_number.ilike.${term},serial_code.ilike.${term}`
    );
  }

  console.log("Executing students query with filters:", filters);
  const { data, count, error } = await query;

  if (error) {
    console.error("Fetch students error - Full details:", error);
    const errorMessage = typeof error === 'object' && error !== null 
      ? JSON.stringify(error, null, 2)
      : String(error);
    throw new Error(`Database error: ${errorMessage}`);
  }

  // Fetch all unique schools in one query
  const studentData = (data ?? []) as Array<Tables<"students">>;
  const uniqueSchoolIds = [...new Set(studentData.map(s => s.school_id).filter(Boolean))];
  let schoolsMap: Record<string, { id: string; name: string; code: string; director: string | null; address: string | null; phone: string | null; authorization: string | null }> = {};
  
  if (uniqueSchoolIds.length > 0) {
    const { data: schools, error: schoolsError } = await supabase
      .from("schools")
      .select("id, name, code, director, address, phone, authorization")
      .in("id", uniqueSchoolIds);
    
    type SchoolData = { id: string; name: string; code: string; director: string | null; address: string | null; phone: string | null; authorization: string | null };
    if (!schoolsError && schools) {
      schoolsMap = (schools as SchoolData[]).reduce((acc, school) => {
        acc[school.id] = school;
        return acc;
      }, {} as Record<string, SchoolData>);
    }
  }

  // Map students with schools
  const studentsWithSchools = studentData.map((student) => ({
    ...student,
    schools: student.school_id && schoolsMap[student.school_id]
      ? schoolsMap[student.school_id]
      : { id: '', name: 'École inconnue', code: '', director: null, address: null, phone: null, authorization: null }
  }));

  return {
    data: studentsWithSchools as StudentWithSchool[],
    total: count ?? 0,
    page,
    limit
  };
};

export const fetchStudentById = async (
  id: string,
  client?: ReturnType<typeof createServerSupabaseClient>
): Promise<StudentWithSchool | null> => {
  const supabase = client ?? createServerSupabaseClient();
  const { data, error } = await supabase
    .from("students")
    .select("id, school_id, serial_code, full_name, cin, code_massar, birth_date, birth_place, address, phone, father_mother, profession, program, niveau_scolaire, derniere_annee_scolaire, school_year, reg_number, reg_date, created_at, schools(id, name, code, director, address, phone, authorization)")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return data as StudentWithSchool;
};

export const createStudentRecord = async (
  payload: StudentFormInput,
  client?: ReturnType<typeof createServerSupabaseClient>
) => {
  const supabase = client ?? createServerSupabaseClient();
  const supabaseClient = supabase as any;
  const { id: _ignored, ...rest } = payload;

  const insertPayload: TablesInsert<"students"> = {
    ...rest,
    birth_date: payload.birth_date ?? null,
    reg_date: payload.reg_date ?? null
  };

  const { data, error } = await supabaseClient
    .from("students")
    .insert(insertPayload as any)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as Tables<"students">;
};

export const updateStudentRecord = async (
  id: string,
  payload: StudentFormInput,
  client?: ReturnType<typeof createServerSupabaseClient>
) => {
  const supabase = client ?? createServerSupabaseClient();
  const supabaseClient = supabase as any;

  const { id: _omit, ...rest } = payload;

  const updatePayload: TablesUpdate<"students"> = {
    ...rest,
    birth_date: payload.birth_date ?? null,
    reg_date: payload.reg_date ?? null
  };

  const { data, error } = await supabaseClient
    .from("students")
    .update(updatePayload as any)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as Tables<"students">;
};

export const deleteStudentRecord = async (
  id: string,
  client?: ReturnType<typeof createServerSupabaseClient>
) => {
  const supabase = client ?? createServerSupabaseClient();
  const { error } = await supabase.from("students").delete().eq("id", id);

  if (error) {
    throw error;
  }
};
