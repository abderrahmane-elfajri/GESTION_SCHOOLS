import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/lib/database.types";
import { serverEnv } from "@/lib/env";

const buildCookieAdapter = () => {
  const cookieStore = cookies();

  return {
    get(name: string) {
      return cookieStore.get(name)?.value;
    },
    set(name: string, value: string, options: { path?: string; maxAge?: number }) {
      try {
        cookieStore.set({ name, value, ...options });
      } catch (error) {
        /* ignore when in a read-only context */
      }
    },
    remove(name: string, options: { path?: string }) {
      try {
        cookieStore.set({ name, value: "", ...options });
      } catch (error) {
        /* ignore when in a read-only context */
      }
    }
  };
};

export const createServerSupabaseClient = () => {
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = serverEnv();
  return createServerClient<Database, "public">(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: buildCookieAdapter()
  });
};

export const createAdminSupabaseClient = () => {
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = serverEnv();

  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY manquant. Nécessaire pour les opérations administrateur."
    );
  }

  return createClient<Database, "public">(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};
