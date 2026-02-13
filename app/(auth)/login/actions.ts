"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { loginSchema } from "@/lib/schemas/auth";

type FormState = 
  | { error: string; success?: undefined; redirectTo?: undefined }
  | { success: true; redirectTo: string; error?: undefined };

export async function signIn(prevState: FormState, formData: FormData): Promise<FormState> {
  const parseResult = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password")
  });

  if (!parseResult.success) {
    const error = parseResult.error.issues[0]?.message ?? "Veuillez vérifier vos informations";
    return { error };
  }

  const { email, password } = parseResult.data;
  
  try {
    const supabase = createServerSupabaseClient();

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error("Supabase auth error:", error);
      return { error: "Identifiants invalides" };
    }

    // Revalidate auth state
    revalidatePath("/", "layout");
    
    const redirectTo = formData.get("redirect")?.toString() ?? "/dashboard";
    return { success: true, redirectTo };
  } catch (err) {
    console.error("Login error:", err);
    return { error: "Erreur de connexion. Veuillez réessayer." };
  }
}
