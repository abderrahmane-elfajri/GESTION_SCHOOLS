import { z } from "zod";

export const secretaryFormSchema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  password: z.string().min(6, { message: "Mot de passe trop court" }),
  full_name: z.string().min(2, { message: "Nom requis" }),
  school_id: z.string().uuid({ message: "Sélectionner une école" })
});

export type SecretaryFormInput = z.infer<typeof secretaryFormSchema>;
