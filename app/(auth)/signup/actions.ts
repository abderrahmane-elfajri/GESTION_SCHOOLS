"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/database.types";

type FormState = 
  | { error: string; success?: undefined }
  | { success: true; error?: undefined };

export async function signUp(prevState: FormState, formData: FormData): Promise<FormState> {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return { error: "Email et mot de passe requis" };
  }

  if (password.length < 8) {
    return { error: "Le mot de passe doit contenir au moins 8 caractères" };
  }

  try {
    const supabase = createServerSupabaseClient();

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/login`
      }
    });

    if (authError) {
      console.error("Signup auth error:", authError);
      return { error: authError.message };
    }

    if (!authData.user) {
      return { error: "Échec de création de l'utilisateur" };
    }

    // Create profile with proper typing
    const profileData: Database["public"]["Tables"]["profiles"]["Insert"] = {
      id: authData.user.id,
      role: "admin",
      school_id: null
    };

    const { error: profileError } = await supabase
      .from("profiles")
      .insert(profileData);

    if (profileError) {
      console.error("Profile creation error:", profileError);
      // User created but profile failed - still return success
      // The user can login and profile might exist already
    }

    return { success: true };
  } catch (err) {
    console.error("Signup error:", err);
    return { error: "Erreur lors de la création du compte" };
  }
}
