"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { studentFormSchema } from "@/lib/schemas/student";
import { paymentToggleSchema } from "@/lib/schemas/payment";
import { createStudentRecord, updateStudentRecord, deleteStudentRecord } from "@/lib/repositories/students";
import { upsertPayment } from "@/lib/repositories/payments";
import type { StudentFormState } from "@/lib/types/student-form-state";

type ActionState = StudentFormState;

export async function createStudentAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parseResult = studentFormSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parseResult.success) {
    const fieldErrors: Record<string, string> = {};
    parseResult.error.issues.forEach((issue) => {
      const field = issue.path[0]?.toString();
      if (field) {
        fieldErrors[field] = issue.message;
      }
    });
    
    const firstError = parseResult.error.issues[0];
    const error = firstError ? `${firstError.message}` : "Champs invalides";
    return { error, fieldErrors };
  }

  try {
    const inserted = (await createStudentRecord(parseResult.data)) as { id: string };
    revalidatePath("/students");
    redirect(`/students/${inserted.id}`);
  } catch (error: any) {
    // Check if this is a redirect error from Next.js (which is expected behavior)
    if (error?.digest?.startsWith('NEXT_REDIRECT')) {
      throw error; // Re-throw redirect errors
    }
    
    console.error(error);
    
    // Handle specific database errors
    if (error?.code === '23505') {
      if (error.message?.includes('students_reg_number_unique')) {
        return { 
          error: "Ce numéro d'inscription existe déjà pour cette école. Laissez le champ vide pour générer un numéro automatiquement.",
          fieldErrors: { reg_number: "Numéro déjà utilisé" }
        };
      }
      if (error.message?.includes('students_serial_code_unique')) {
        return { error: "Le matricule existe déjà. Veuillez réessayer." };
      }
      return { error: "Cette valeur existe déjà dans la base de données." };
    }
    
    if (error?.code === '23503') {
      return { 
        error: "L'école sélectionnée n'existe pas. Veuillez sélectionner une école valide.",
        fieldErrors: { school_id: "École invalide" }
      };
    }
    
    return { error: "Impossible de créer l'élève. Veuillez vérifier les informations et réessayer." };
  }
}

export async function updateStudentAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parseResult = studentFormSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parseResult.success || !parseResult.data.id) {
    const fieldErrors: Record<string, string> = {};
    parseResult.error?.issues.forEach((issue) => {
      const field = issue.path[0]?.toString();
      if (field) {
        fieldErrors[field] = issue.message;
      }
    });
    
    const firstError = parseResult.error?.issues[0];
    const error = firstError ? `${firstError.message}` : "Champs invalides";
    return { error, fieldErrors };
  }

  try {
    const updated = (await updateStudentRecord(parseResult.data.id, parseResult.data)) as { id: string };
    revalidatePath(`/students/${updated.id}`);
    return { success: "✓ Les informations de l'élève ont été mises à jour avec succès!", id: updated.id };
  } catch (error: any) {
    console.error(error);
    
    // Handle specific database errors
    if (error?.code === '23505') {
      if (error.message?.includes('students_reg_number_unique')) {
        return { 
          error: "Ce numéro d'inscription existe déjà pour cette école. Laissez le champ vide pour générer un numéro automatiquement.",
          fieldErrors: { reg_number: "Numéro déjà utilisé" }
        };
      }
      return { error: "Cette valeur existe déjà dans la base de données." };
    }
    
    if (error?.code === '23503') {
      return { 
        error: "L'école sélectionnée n'existe pas. Veuillez sélectionner une école valide.",
        fieldErrors: { school_id: "École invalide" }
      };
    }
    
    return { error: "Impossible de mettre à jour les informations. Veuillez réessayer." };
  }
}

export async function deleteStudentAction(studentId: string) {
  try {
    await deleteStudentRecord(studentId);
    revalidatePath("/students");
    redirect("/students");
  } catch (error) {
    console.error(error);
    throw new Error("Suppression impossible");
  }
}

export async function togglePaymentAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parseResult = paymentToggleSchema.safeParse({
    student_id: formData.get("student_id"),
    year: formData.get("year"),
    month: formData.get("month"),
    paid: formData.get("paid") === "true",
    amount: formData.get("amount")
  });

  if (!parseResult.success) {
    const error = parseResult.error.issues[0]?.message ?? "Données invalides";
    return { error };
  }

  try {
    await upsertPayment(parseResult.data);
    revalidatePath(`/students/${parseResult.data.student_id}`);
    return { success: "Paiement mis à jour" };
  } catch (error) {
    console.error(error);
    return { error: "Mise à jour du paiement impossible" };
  }
}
