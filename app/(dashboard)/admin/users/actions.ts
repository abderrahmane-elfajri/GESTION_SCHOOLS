"use server";

import { revalidatePath } from "next/cache";
import { createAdminSupabaseClient, createServerSupabaseClient } from "@/lib/supabase/server";
import { secretaryFormSchema } from "@/lib/schemas/profile";

interface ActionState {
  error?: string;
  success?: string;
}

export async function createSecretaryAction(_prev: ActionState | undefined, formData: FormData): Promise<ActionState> {
  const parseResult = secretaryFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    full_name: formData.get("full_name"),
    school_id: formData.get("school_id")
  });

  if (!parseResult.success) {
    const error = parseResult.error.issues[0]?.message ?? "Champs invalides";
    return { error };
  }

  const adminClient = createAdminSupabaseClient();
  const { data, error } = await adminClient.auth.admin.createUser({
    email: parseResult.data.email,
    password: parseResult.data.password,
    email_confirm: true
  });

  if (error || !data.user) {
    return { error: "Impossible de créer l'utilisateur" };
  }

  const supabase = createServerSupabaseClient() as any;
  const profilePayload = {
    id: data.user.id,
    role: "secretary",
    school_id: parseResult.data.school_id,
    full_name: parseResult.data.full_name
  };

  const { error: insertError } = await supabase.from("profiles").insert(profilePayload as any);

  if (insertError) {
    return { error: "Impossible d'enregistrer le profil" };
  }

  revalidatePath("/admin/users");

  return { success: "Secrétaire créé avec succès" };
}

export async function updateSecretarySchoolAction(formData: FormData): Promise<void> {
  const userId = formData.get("user_id")?.toString();
  const schoolId = formData.get("school_id")?.toString();

  if (!userId || !schoolId) {
    throw new Error("Données manquantes");
  }

  const supabase = createServerSupabaseClient() as any;
  const { error } = await supabase
    .from("profiles")
    .update({ school_id: schoolId } as any)
    .eq("id", userId);

  if (error) {
    throw new Error("Mise à jour impossible");
  }

  revalidatePath("/admin/users");
}
