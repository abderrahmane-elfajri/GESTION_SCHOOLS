import { z } from "zod";

export const studentFormSchema = z.object({
  id: z.string().uuid().optional(),
  school_id: z.string().uuid({ message: "Sélectionner une école" }),
  full_name: z.string().min(2, { message: "Nom requis" }),
  cin: z.string().optional().nullable(),
  code_massar: z.string().optional().nullable(),
  birth_date: z.string().optional().nullable(),
  birth_place: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  father_mother: z.string().optional().nullable(),
  profession: z.string().optional().nullable(),
  program: z.enum(["coiffure", "coiffure_visagiste", "esthetique"]).optional().nullable(),
  niveau_scolaire: z.string().optional().nullable(),
  derniere_annee_scolaire: z.string().optional().nullable(),
  school_year: z.string().optional().nullable(),
  reg_number: z.string().optional().nullable(),
  reg_date: z.string().optional().nullable()
});

export type StudentFormInput = z.infer<typeof studentFormSchema>;

export const studentFiltersSchema = z.object({
  search: z.string().optional(),
  program: z.enum(["coiffure", "coiffure_visagiste", "esthetique"]).optional(),
  school_year: z.string().optional(),
  school_id: z.string().optional(),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(20)
});

export type StudentFilters = z.infer<typeof studentFiltersSchema>;
