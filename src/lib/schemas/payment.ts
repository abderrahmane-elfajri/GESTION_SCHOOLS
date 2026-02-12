import { z } from "zod";

export const paymentToggleSchema = z.object({
  student_id: z.string().uuid(),
  year: z.coerce.number().int().min(2000),
  month: z.coerce.number().int().min(1).max(12),
  paid: z.boolean(),
  amount: z.coerce.number().nonnegative().optional().nullable()
});

export type PaymentToggleInput = z.infer<typeof paymentToggleSchema>;
