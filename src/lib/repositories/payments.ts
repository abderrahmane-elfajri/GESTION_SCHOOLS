import type { Tables, TablesInsert } from "@/lib/database.types";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { PaymentToggleInput } from "@/lib/schemas/payment";

export type PaymentRow = Tables<"payments">;

export interface MonthlyPayment {
  month: number;
  paid: boolean;
  amount: number | null;
  paid_at: string | null;
  id?: string;
}

export const fetchStudentPayments = async (
  studentId: string,
  year: number,
  client?: ReturnType<typeof createServerSupabaseClient>
): Promise<MonthlyPayment[]> => {
  const supabase = client ?? createServerSupabaseClient();
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("student_id", studentId)
    .eq("year", year)
    .order("month", { ascending: true });

  if (error) {
    throw error;
  }

  const paymentRows = (data ?? []) as PaymentRow[];

  const months: MonthlyPayment[] = Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    const payment = paymentRows.find((item) => item.month === month);
    return {
      month,
      paid: payment?.paid ?? false,
      amount: payment?.amount ?? null,
      paid_at: payment?.paid_at ?? null,
      id: payment?.id
    };
  });

  return months;
};

export const upsertPayment = async (
  payload: PaymentToggleInput,
  client?: ReturnType<typeof createServerSupabaseClient>
) => {
  const supabase = client ?? createServerSupabaseClient();
  const { student_id, year, month, amount, paid } = payload;

  const body: TablesInsert<"payments"> = {
    student_id,
    year,
    month,
    paid,
    amount: amount ?? null,
    paid_at: paid ? new Date().toISOString() : null
  };

  const { data, error } = await supabase
    .from("payments")
    .upsert(body as any, { onConflict: "student_id,year,month" })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
};
