"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type LogoutState = 
  | { error: string; success?: undefined; redirectTo?: undefined }
  | { success: true; redirectTo: string; error?: undefined };

export async function signOut(prevState: LogoutState | null, formData: FormData): Promise<LogoutState> {
  try {
    const supabase = createServerSupabaseClient();
    await supabase.auth.signOut();
    
    // Revalidate to clear auth state
    revalidatePath("/", "layout");
    
    return { success: true, redirectTo: "/login" };
  } catch (err) {
    console.error("Logout error:", err);
    return { error: "Erreur lors de la déconnexion" };
  }
}
