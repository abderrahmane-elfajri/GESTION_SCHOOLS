import Link from "next/link";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { fetchCurrentProfile } from "@/lib/auth";
import { LogoutButton } from "./logout-button";

const NAV_LINKS = [
  { href: "/dashboard", label: "Tableau de bord" },
  { href: "/students", label: "Élèves" }
];

const ADMIN_LINKS = [{ href: "/admin/users", label: "Administration" }];

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = createServerSupabaseClient();
  const session = await fetchCurrentProfile(supabase);

  if (!session) {
    redirect("/login");
  }

  let schoolLabel: string | null = null;
  if (session.profile.school_id) {
    const { data: school } = await supabase
      .from("schools")
      .select("name")
      .eq("id", session.profile.school_id)
      .maybeSingle();
    const schoolRow = (school ?? null) as { name: string } | null;
    schoolLabel = schoolRow?.name ?? null;
  }

  const links = session.role === "admin" ? [...NAV_LINKS, ...ADMIN_LINKS] : NAV_LINKS;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primaire-600">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-lg font-bold text-slate-900">Gestion Scolaire</span>
            </div>
            <nav className="hidden md:flex items-center gap-1">
              {links.map((link) => (
                <Link key={link.href} href={link.href} className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-primaire-50 hover:text-primaire-600">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">{session.profile.full_name ?? "Utilisateur"}</p>
                {schoolLabel ? (
                  <p className="text-xs text-slate-500">{schoolLabel}</p>
                ) : null}
              </div>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-6 py-8">{children}</main>
    </div>
  );
}
