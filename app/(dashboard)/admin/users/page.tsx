import { redirect } from "next/navigation";
import { createAdminSupabaseClient, createServerSupabaseClient } from "@/lib/supabase/server";
import { fetchCurrentProfile } from "@/lib/auth";
import { CreateSecretaryForm } from "@/components/users/create-secretary-form";
import { createSecretaryAction, updateSecretarySchoolAction } from "./actions";

export default async function AdminUsersPage() {
  const supabase = createServerSupabaseClient();
  const session = await fetchCurrentProfile(supabase);

  if (!session || session.role !== "admin") {
    redirect("/dashboard");
  }

  const [{ data: schools }, { data: secretaries }, adminUsers] = await Promise.all([
    supabase.from("schools").select("id, name").order("name", { ascending: true }),
    supabase.from("profiles").select("id, full_name, school_id").eq("role", "secretary").order("created_at", { ascending: false }),
    fetchAuthUsers()
  ]);

  const emailMap = new Map(adminUsers.map((user) => [user.id, user.email ?? ""]));
  const schoolRows = (schools ?? []) as Array<{ id: string; name: string }>;
  const secretaryRows = (secretaries ?? []) as Array<{
    id: string;
    full_name: string | null;
    school_id: string | null;
  }>;

  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-xl bg-gradient-to-r from-primaire-600 to-primaire-700 p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold">Gestion des secrétaires</h1>
        <p className="mt-2 text-primaire-100">Créez des comptes secrétaires et assignez-les à une école</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-lg font-semibold text-slate-900">Créer un nouveau secrétaire</h2>
        <CreateSecretaryForm action={createSecretaryAction} schools={schoolRows} />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Liste des secrétaires</h2>
          <p className="mt-1 text-sm text-slate-500">Gérez les comptes existants</p>
        </div>
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
            <tr>
              <th className="px-6 py-3">Nom</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">École</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {secretaryRows.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                  <div className="flex flex-col items-center">
                    <svg className="h-12 w-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <p className="mt-2 text-sm font-medium">Aucun secrétaire enregistré</p>
                  </div>
                </td>
              </tr>
            ) : (
              secretaryRows.map((secretary) => (
                <tr key={secretary.id} className="transition hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">{secretary.full_name ?? "-"}</td>
                  <td className="px-6 py-4 text-slate-600">{emailMap.get(secretary.id) ?? ""}</td>
                  <td className="px-6 py-4 text-slate-600">
                    {schoolRows.find((school) => school.id === secretary.school_id)?.name ?? "-"}
                  </td>
                  <td className="px-6 py-4">
                    <form action={updateSecretarySchoolAction} className="flex items-center gap-2">
                      <input type="hidden" name="user_id" value={secretary.id} />
                      <select
                        name="school_id"
                        defaultValue={secretary.school_id ?? ""}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm transition focus:border-primaire-500 focus:outline-none focus:ring-2 focus:ring-primaire-200"
                        aria-label="École"
                      >
                        <option value="">Sélectionner</option>
                        {schoolRows.map((school) => (
                          <option key={school.id} value={school.id}>
                            {school.name}
                          </option>
                        ))}
                      </select>
                      <button
                        type="submit"
                        className="rounded-lg border border-primaire-200 bg-primaire-50 px-4 py-2 text-sm font-medium text-primaire-600 transition hover:bg-primaire-100"
                      >
                        Mettre à jour
                      </button>
                    </form>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type AuthUser = { id: string; email?: string | null };

async function fetchAuthUsers(): Promise<AuthUser[]> {
  const adminClient = createAdminSupabaseClient();
  const { data } = await adminClient.auth.admin.listUsers({ page: 1, perPage: 200 });
  return data?.users?.map((user) => ({ id: user.id, email: user.email })) ?? [];
}
