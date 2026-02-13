"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { loginSchema } from "@/lib/schemas/auth";

export async function signIn(prevState: { error?: string; success?: boolean; redirectTo?: string } | undefined, formData: FormData) {
  const parseResult = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password")
  });

  if (!parseResult.success) {
    const error = parseResult.error.issues[0]?.message ?? "Veuillez vérifier vos informations";
    return { error };
  }

  const { email, password } = parseResult.data;
  const supabase = createServerSupabaseClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Identifiants invalides" };
  }

  // Revalidate auth state
  revalidatePath("/", "layout");
  
  const redirectTo = formData.get("redirect")?.toString() ?? "/dashboard";
  return { success: true, redirectTo };
}
