import type { Tables, TablesInsert } from "@/lib/database.types";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type CertificateRow = Tables<"certificates">;

export const fetchCertificatesByStudent = async (
  studentId: string,
  client?: ReturnType<typeof createServerSupabaseClient>
): Promise<CertificateRow[]> => {
  const supabase = client ?? createServerSupabaseClient();
  const { data, error } = await supabase
    .from("certificates")
    .select("*")
    .eq("student_id", studentId)
    .order("issued_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
};

export const insertCertificate = async (
  input: Pick<CertificateRow, "student_id" | "school_id" | "school_year"> & { issued_by?: string | null },
  client?: ReturnType<typeof createServerSupabaseClient>
): Promise<CertificateRow> => {
  const supabase = client ?? createServerSupabaseClient();
  const payload: TablesInsert<"certificates"> = {
    student_id: input.student_id,
    school_id: input.school_id,
    school_year: input.school_year ?? null,
    issued_by: input.issued_by ?? null
  };

  const { data, error } = await supabase
    .from("certificates")
    .insert(payload as any)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
};
