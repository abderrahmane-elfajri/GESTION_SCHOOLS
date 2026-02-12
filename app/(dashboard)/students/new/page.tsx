import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { fetchCurrentProfile } from "@/lib/auth";
import { StudentForm } from "@/components/students/student-form";
import { createStudentAction } from "../actions";

export default async function NewStudentPage() {
  const supabase = createServerSupabaseClient();
  const session = await fetchCurrentProfile(supabase);

  if (!session) {
    redirect("/login");
  }

  const { data: schools } = await supabase.from("schools").select("id, name").order("name", { ascending: true });

  const defaultSchoolId = session.role === "secretary" ? session.profile.school_id ?? undefined : undefined;

  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-xl bg-gradient-to-r from-primaire-600 to-primaire-700 p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold">Nouvel élève</h1>
        <p className="mt-2 text-primaire-100">Enregistrez un nouvel élève et ses informations principales</p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <StudentForm
          action={createStudentAction}
          initialValues={{ school_id: defaultSchoolId ?? "" }}
          schools={schools ?? []}
          disableSchoolSelect={session.role === "secretary"}
          submitLabel="Créer l&apos;élève"
        />
      </div>
    </div>
  );
}
