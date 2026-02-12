import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/database.types";
import { clientEnv } from "@/lib/env";

export const createBrowserSupabaseClient = () => {
  const env = clientEnv();
  return createBrowserClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
};
