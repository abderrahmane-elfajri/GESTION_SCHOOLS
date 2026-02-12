import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { fetchCurrentProfile } from "@/lib/auth";
import { fetchStudentById } from "@/lib/repositories/students";
import { fetchStudentPayments } from "@/lib/repositories/payments";
import { fetchCertificatesByStudent } from "@/lib/repositories/certificates";
import { PaymentsTable } from "@/components/students/payments-table";
import { YearSelector } from "@/components/students/year-selector";
import { CertificateButtons } from "@/components/certificates/certificate-buttons";
import { deleteStudentAction } from "../actions";

const currentYear = new Date().getFullYear();

const YEARS_RANGE = Array.from({ length: 5 }, (_, index) => currentYear - index);

interface StudentPageProps {
  params: { id: string };
  searchParams: { year?: string };
}

export default async function StudentDetailPage({ params, searchParams }: StudentPageProps) {
  const supabase = createServerSupabaseClient();
  const session = await fetchCurrentProfile(supabase);

  if (!session) {
    redirect("/login");
  }

  const student = await fetchStudentById(params.id, supabase);

  if (!student) {
    notFound();
  }

  const year = searchParams.year ? parseInt(searchParams.year, 10) : new Date().getFullYear();
  const payments = await fetchStudentPayments(student.id, year, supabase);
  const certificates = await fetchCertificatesByStudent(student.id, supabase);

  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-xl bg-gradient-to-r from-primaire-600 to-primaire-700 p-8 text-white shadow-lg">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <span className="text-xl font-bold text-white">{student.full_name.charAt(0)}</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold">{student.full_name}</h1>
                <p className="mt-1 text-primaire-100">
                  {student.schools?.name ?? ""} • {student.serial_code}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/students/${student.id}/edit`}
              className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-primaire-600 transition hover:bg-primaire-50"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Modifier
            </Link>
            <form action={deleteStudentAction.bind(null, student.id)}>
              <button
                type="submit"
                className="flex items-center gap-2 rounded-lg border-2 border-white/50 bg-transparent px-4 py-2 text-sm font-medium text-white transition hover:border-white hover:bg-white/10"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Supprimer
              </button>
            </form>
          </div>
        </div>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-lg font-semibold text-slate-900">Informations personnelles</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <DetailItem label="Téléphone" value={student.phone ?? "-"} />
          <DetailItem label="Adresse" value={student.address ?? "-"} />
          <DetailItem label="CIN" value={student.cin ?? "-"} />
          <DetailItem label="Code Massar" value={student.code_massar ?? "-"} />
          <DetailItem label="Date de naissance" value={formatDate(student.birth_date)} />
          <DetailItem label="Lieu de naissance" value={student.birth_place ?? "-"} />
          <DetailItem label="Père/Mère" value={student.father_mother ?? "-"} />
          <DetailItem label="Profession" value={student.profession ?? "-"} />
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-lg font-semibold text-slate-900">Informations scolaires</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <DetailItem label="Programme" value={formatProgram(student.program)} />
          <DetailItem label="Niveau scolaire" value={student.niveau_scolaire ?? "-"} />
          <DetailItem label="Dernière année scolaire" value={student.derniere_annee_scolaire ?? "-"} />
          <DetailItem label="Année scolaire" value={student.school_year ?? "-"} />
          <DetailItem label="Référence inscription" value={student.reg_number ?? "-"} />
          <DetailItem label="Date inscription" value={formatDate(student.reg_date)} />
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Paiements {year}</h2>
            <p className="mt-1 text-sm text-slate-500">Suivi des mensualités de l&apos;année</p>
          </div>
          <YearSelector currentYear={year} years={YEARS_RANGE} />
        </div>
        <PaymentsTable studentId={student.id} year={year} months={payments} />
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Certificats</h2>
            <p className="mt-1 text-sm text-slate-500">Documents générés pour l&apos;élève</p>
          </div>
          <CertificateButtons 
            studentId={student.id} 
            schoolYear={student.school_year ?? ""} 
          />
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
              <tr>
                <th className="px-6 py-3">Numéro</th>
                <th className="px-6 py-3">Année scolaire</th>
                <th className="px-6 py-3">Émis le</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {certificates.length === 0 ? (
                <tr>
                  <td className="px-6 py-8 text-center text-slate-500" colSpan={3}>
                    <div className="flex flex-col items-center">
                      <svg className="h-12 w-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="mt-2 text-sm font-medium">Aucun certificat généré</p>
                    </div>
                  </td>
                </tr>
              ) : (
                certificates.map((certificate) => (
                  <tr key={certificate.id} className="transition hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-primaire-600">{certificate.certificate_no}</td>
                    <td className="px-6 py-4 text-slate-700">{certificate.school_year ?? "-"}</td>
                    <td className="px-6 py-4 text-slate-700">
                      {formatDate(certificate.issued_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-2 rounded-lg bg-slate-50 p-4">
    <span className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</span>
    <span className="text-base font-medium text-slate-900">{value || "-"}</span>
  </div>
);

function formatDate(value?: string | null) {
  if (!value) {
    return "-";
  }
  return new Date(value).toLocaleDateString("fr-FR");
}

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
