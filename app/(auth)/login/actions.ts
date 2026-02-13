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

    console.log("Attempting login for:", email);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error("Supabase auth error:", {
        message: error.message,
        status: error.status,
        name: error.name
      });
      return { error: `Erreur: ${error.message}` };
    }

    if (!data.user) {
      console.error("Login succeeded but no user returned");
      return { error: "Aucun utilisateur trouvé" };
    }

    console.log("Login successful for user:", data.user.id);

    // Revalidate auth state
    revalidatePath("/", "layout");
    
    const redirectTo = formData.get("redirect")?.toString() ?? "/dashboard";
    return { success: true, redirectTo };
  } catch (err) {
    console.error("Login error:", err);
    return { error: "Erreur de connexion. Veuillez réessayer." };
  }
}
