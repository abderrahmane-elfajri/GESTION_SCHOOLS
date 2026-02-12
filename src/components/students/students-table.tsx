"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import type { StudentWithSchool } from "@/lib/repositories/students";

interface StudentsTableProps {
  students: StudentWithSchool[];
  total: number;
  page: number;
  limit: number;
}

export const StudentsTable = ({ students, total, page, limit }: StudentsTableProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const goToPage = (targetPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", targetPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(total, page * limit);

  const rows = useMemo(() => students, [students]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
            <tr>
              <th className="px-6 py-3">Nom complet</th>
              <th className="px-6 py-3">École</th>
              <th className="px-6 py-3">Programme</th>
              <th className="px-6 py-3">Année scolaire</th>
              <th className="px-6 py-3">Téléphone</th>
              <th className="px-6 py-3">Dossier</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <svg className="h-12 w-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <p className="mt-2 text-sm font-medium text-slate-900">Aucun élève trouvé</p>
                    <p className="mt-1 text-sm text-slate-500">Essayez de modifier vos filtres</p>
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((student) => (
                <tr 
                  key={student.id} 
                  className="cursor-pointer transition hover:bg-primaire-50"
                  onClick={() => router.push(`/students/${student.id}`)}
                >
                  <td className="px-6 py-4 text-slate-800">
                    <div className="flex flex-col">
                      <span className="font-medium">{student.full_name}</span>
                      <span className="text-xs text-slate-400">{student.serial_code}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{student.schools?.name ?? ""}</td>
                  <td className="px-6 py-4 text-slate-600">{formatProgram(student.program)}</td>
                  <td className="px-6 py-4 text-slate-600">{student.school_year ?? ""}</td>
                  <td className="px-6 py-4 text-slate-600">{student.phone ?? "-"}</td>
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <Link
                      href={`/students/${student.id}`}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-primaire-50 px-3 py-1.5 text-sm font-medium text-primaire-600 transition hover:bg-primaire-100"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Ouvrir
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4 text-sm text-slate-600">
        <span className="font-medium">
          {start}-{end} sur {total} élèves
        </span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium transition hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={() => goToPage(Math.max(1, page - 1))}
            disabled={page <= 1}
          >
            Précédent
          </button>
          <span className="font-medium">
            Page {page} / {totalPages}
          </span>
          <button
            type="button"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium transition hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={() => goToPage(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
};

function formatProgram(program?: string | null) {
  switch (program) {
    case "coiffure":
      return "Coiffure";
    case "coiffure_visagiste":
      return "Coiffure Visagiste";
    case "esthetique":
      return "Esthétique";
    default:
      return "-";
  }
}
