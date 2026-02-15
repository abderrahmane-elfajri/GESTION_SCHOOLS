import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { fetchCurrentProfile } from "@/lib/auth";
import { fetchDashboardStats } from "@/lib/repositories/stats";
import { fetchStudents } from "@/lib/repositories/students";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";

export const revalidate = 180; // Cache for 3 minutes
export const dynamic = 'force-static';

async function DashboardStats() {
  try {
    const supabase = createServerSupabaseClient();
    const stats = await fetchDashboardStats(supabase);

    return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
        <div className="absolute right-0 top-0 h-20 w-20 translate-x-8 -translate-y-8 rounded-full bg-primaire-100 opacity-50"></div>
        <div className="relative">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primaire-100">
              <svg className="h-6 w-6 text-primaire-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-primaire-600">+0%</span>
          </div>
          <h2 className="mt-4 text-sm font-medium text-slate-600">Total Élèves</h2>
          <p className="mt-1 text-3xl font-bold text-slate-900">{stats.students}</p>
          <p className="mt-1 text-xs text-slate-500">Élèves actifs enregistrés</p>
        </div>
      </div>
      <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
        <div className="absolute right-0 top-0 h-20 w-20 translate-x-8 -translate-y-8 rounded-full bg-amber-100 opacity-50"></div>
        <div className="relative">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100">
              <svg className="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-amber-600">En attente</span>
          </div>
          <h2 className="mt-4 text-sm font-medium text-slate-600">Paiements en attente</h2>
          <p className="mt-1 text-3xl font-bold text-amber-600">{stats.unpaidPayments}</p>
          <p className="mt-1 text-xs text-slate-500">Mensualités non réglées</p>
        </div>
      </div>
      <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
        <div className="absolute right-0 top-0 h-20 w-20 translate-x-8 -translate-y-8 rounded-full bg-emerald-100 opacity-50"></div>
        <div className="relative">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
              <svg className="h-6 w-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-emerald-600">Générés</span>
          </div>
          <h2 className="mt-4 text-sm font-medium text-slate-600">Certificats</h2>
          <p className="mt-1 text-3xl font-bold text-emerald-600">{stats.certificates}</p>
          <p className="mt-1 text-xs text-slate-500">Documents générés</p>
        </div>
      </div>
    </section>
  );
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <p className="text-sm text-red-600">Erreur de chargement des statistiques. Vérifiez votre connexion à Supabase.</p>
      </div>
    );
  }
}

async function RecentStudents() {
  try {
    const supabase = createServerSupabaseClient();
    const { data: recentStudents } = await fetchStudents({ limit: 3, page: 1 }, supabase);

    return recentStudents.length === 0 ? (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
        <svg className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      </div>
      <p className="mt-4 text-sm font-medium text-slate-900">Aucun élève enregistré</p>
      <p className="mt-1 text-sm text-slate-500">Commencez par ajouter votre premier élève</p>
    </div>
  ) : (
    recentStudents.map((student) => (
      <Link
        key={student.id}
        href={`/students/${student.id}`}
        className="group flex items-center justify-between py-4 transition hover:bg-slate-50 px-4 -mx-4 rounded-lg"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primaire-100">
            <span className="text-sm font-bold text-primaire-700">
              {student.full_name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium text-slate-900 group-hover:text-primaire-600">{student.full_name}</p>
            <p className="text-sm text-slate-500">{student.serial_code} • {student.schools?.name ?? "École"}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-slate-900">{student.school_year}</p>
            <p className="text-xs text-slate-500">{student.created_at ? new Date(student.created_at).toLocaleDateString("fr-FR") : "N/A"}</p>
          </div>
          <svg className="h-5 w-5 text-slate-400 group-hover:text-primaire-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Link>
    ))
  );
  } catch (error) {
    console.error("Recent students error:", error);
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-600">Erreur de chargement des élèves récents.</p>
      </div>
    );
  }
}

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient();
  const session = await fetchCurrentProfile(supabase);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-xl bg-gradient-to-r from-primaire-600 to-primaire-700 p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold">Bonjour {session.profile.full_name ?? ""} 👋</h1>
        <p className="mt-2 text-primaire-100">Vue d&apos;ensemble de votre plateforme de gestion scolaire</p>
      </section>

      <Suspense fallback={
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <LoadingSkeleton count={1} className="h-32" />
          <LoadingSkeleton count={1} className="h-32" />
          <LoadingSkeleton count={1} className="h-32" />
        </div>
      }>
        <DashboardStats />
      </Suspense>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Derniers élèves</h2>
            <p className="mt-1 text-sm text-slate-500">Élèves récemment ajoutés</p>
          </div>
          <Link href="/students" className="rounded-lg bg-primaire-50 px-4 py-2 text-sm font-medium text-primaire-600 transition hover:bg-primaire-100">
            Voir tous →
          </Link>
        </div>
        <div className="mt-6 divide-y divide-slate-100">
          <Suspense fallback={<LoadingSkeleton count={3} className="h-20" />}>
            <RecentStudents />
          </Suspense>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Actions rapides</h3>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <Link href="/students/new" className="flex flex-col items-center gap-3 rounded-lg border-2 border-dashed border-slate-200 p-6 transition hover:border-primaire-400 hover:bg-primaire-50">
              <svg className="h-8 w-8 text-primaire-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <span className="text-sm font-medium text-slate-700">Ajouter élève</span>
            </Link>
            <Link href="/students" className="flex flex-col items-center gap-3 rounded-lg border-2 border-dashed border-slate-200 p-6 transition hover:border-primaire-400 hover:bg-primaire-50">
              <svg className="h-8 w-8 text-primaire-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-sm font-medium text-slate-700">Rechercher</span>
            </Link>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-primaire-50 to-primaire-100 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-primaire-900">💡 Astuce</h3>
          <p className="mt-2 text-sm text-primaire-700">
            Utilisez les filtres dans la liste des élèves pour rechercher rapidement par programme, année scolaire ou école.
          </p>
        </div>
      </section>
    </div>
  );
}
