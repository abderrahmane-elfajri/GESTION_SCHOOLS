import { redirect } from "next/navigation";
import type { Role, Tables } from "@/lib/database.types";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const PROTECTED_PATHS = ["/dashboard", "/students", "/admin"] as const;

export const ADMIN_SEGMENTS = ["/admin"] as const;

export type Profile = Tables<"profiles">;

export interface SessionWithProfile {
  profile: Profile;
  role: Role;
}

export const fetchCurrentProfile = async (
  supabase?: ReturnType<typeof createServerSupabaseClient>
): Promise<SessionWithProfile | null> => {
  const client = supabase ?? createServerSupabaseClient();
  const {
    data: { user }
  } = await client.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile, error } = await client
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    return null;
  }

  const typedProfile = profile as Profile;

  return { profile: typedProfile, role: typedProfile.role };
};

export const assertRole = async (role: Role) => {
  const session = await fetchCurrentProfile();
  if (!session || session.role !== role) {
    redirect("/login");
  }
};
