import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface DashboardStats {
  students: number;
  unpaidPayments: number;
  certificates: number;
}

export const fetchDashboardStats = async (
  client?: ReturnType<typeof createServerSupabaseClient>
): Promise<DashboardStats> => {
  const supabase = client ?? createServerSupabaseClient();

  // Get user's profile to check role and school access
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    return {
      students: 0,
      unpaidPayments: 0,
      certificates: 0
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, school_id")
    .eq("id", session.user.id)
    .single();

  // Build queries based on role
  let studentsQuery = supabase.from("students").select("id", { count: "exact", head: true });
  let paymentsQuery = supabase.from("payments").select("id", { count: "exact", head: true }).eq("paid", false);
  let certificatesQuery = supabase.from("certificates").select("id", { count: "exact", head: true });

  // If secretary, filter by their school
  if (profile?.role === "secretary" && profile.school_id) {
    studentsQuery = studentsQuery.eq("school_id", profile.school_id);
    // Payments and certificates are linked to students, so they'll follow the same RLS
  }

  const [{ count: studentCount }, { count: unpaidCount }, { count: certificateCount }] = await Promise.all([
    studentsQuery,
    paymentsQuery,
    certificatesQuery
  ]);

  return {
    students: studentCount ?? 0,
    unpaidPayments: unpaidCount ?? 0,
    certificates: certificateCount ?? 0
  };
};
