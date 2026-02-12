"use client";

import { useFormState, useFormStatus } from "react-dom";
import type { MonthlyPayment } from "@/lib/repositories/payments";
import { togglePaymentAction } from "../../../app/(dashboard)/students/actions";

interface PaymentsTableProps {
  studentId: string;
  year: number;
  months: MonthlyPayment[];
}

const initialState = { error: undefined as string | undefined, success: undefined as string | undefined };

export const PaymentsTable = ({ studentId, year, months }: PaymentsTableProps) => {
  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Mois</th>
              <th className="px-4 py-3 font-medium">Montant</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {months.map((month) => (
              <PaymentRow key={month.month} studentId={studentId} year={year} payment={month} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const PaymentRow = ({ studentId, year, payment }: { studentId: string; year: number; payment: MonthlyPayment }) => {
  const [state, formAction] = useFormState(togglePaymentAction, initialState);

  const statusLabel = payment.paid ? "Payé" : "Non payé";
  const statusColor = payment.paid ? "text-emerald-600" : "text-red-600";

  return (
    <tr className="align-middle">
      <td className="px-4 py-3 font-medium text-slate-700">{formatMonth(payment.month)}</td>
      <td className="px-4 py-3">
        <form action={formAction} className="flex items-center gap-3">
          <input type="hidden" name="student_id" value={studentId} />
          <input type="hidden" name="year" value={year} />
          <input type="hidden" name="month" value={payment.month} />
          <input
            name="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            defaultValue={payment.amount ?? ""}
            className="w-28 rounded-md border border-slate-200 px-2 py-1 text-sm focus:border-primaire-500 focus:outline-none focus:ring-2 focus:ring-primaire-100"
          />
          <ActionButtons />
        </form>
        {state?.error ? <p className="mt-2 text-xs text-red-600">{state.error}</p> : null}
        {state?.success ? <p className="mt-2 text-xs text-emerald-600">{state.success}</p> : null}
      </td>
      <td className={`px-4 py-3 ${statusColor}`}>
        <div className="flex flex-col">
          <span className="font-medium">{statusLabel}</span>
          {payment.paid_at ? <span className="text-xs text-slate-500">le {new Date(payment.paid_at).toLocaleDateString("fr-FR")}</span> : null}
        </div>
      </td>
      <td className="px-4 py-3 text-xs text-slate-500">{payment.id ? `#${payment.id.slice(0, 8)}` : "-"}</td>
    </tr>
  );
};

function formatMonth(month: number) {
  const formatter = new Intl.DateTimeFormat("fr-FR", { month: "long" });
  const date = new Date(2020, month - 1, 1);
  return formatter.format(date);
}

const ActionButtons = () => {
  const { pending } = useFormStatus();

  return (
    <div className="flex gap-2">
      <button
        name="paid"
        value="true"
        type="submit"
        className="rounded-md bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
        disabled={pending}
      >
        Marquer payé
      </button>
      <button
        name="paid"
        value="false"
        type="submit"
        className="rounded-md border border-red-200 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
        disabled={pending}
      >
        Marquer impayé
      </button>
    </div>
  );
};
