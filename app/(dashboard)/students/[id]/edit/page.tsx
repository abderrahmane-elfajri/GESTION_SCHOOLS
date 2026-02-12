import { notFound, redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { fetchCurrentProfile } from "@/lib/auth";
import { fetchStudentById } from "@/lib/repositories/students";
import { StudentForm } from "@/components/students/student-form";
import { updateStudentAction } from "../../actions";

interface EditPageProps {
  params: { id: string };
}

export default async function EditStudentPage({ params }: EditPageProps) {
  const supabase = createServerSupabaseClient();
  const session = await fetchCurrentProfile(supabase);

  if (!session) {
    redirect("/login");
  }

  const student = await fetchStudentById(params.id, supabase);

  if (!student) {
    notFound();
  }

  const { data: schools } = await supabase.from("schools").select("id, name").order("name", { ascending: true });

  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-xl bg-gradient-to-r from-primaire-600 to-primaire-700 p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold">Modifier l&apos;élève</h1>
        <p className="mt-2 text-primaire-100">Mettez à jour les informations de {student.full_name}</p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <StudentForm
          action={updateStudentAction}
          initialValues={{
            id: student.id,
            full_name: student.full_name,
            school_id: student.school_id,
            birth_date: student.birth_date ?? "",
            birth_place: student.birth_place ?? "",
            address: student.address ?? "",
            phone: student.phone ?? "",
            father_mother: student.father_mother ?? "",
            profession: student.profession ?? "",
            program: student.program ?? "",
            school_year: student.school_year ?? "",
            reg_number: student.reg_number ?? "",
            reg_date: student.reg_date ?? ""
          }}
          schools={schools ?? []}
          disableSchoolSelect={session.role === "secretary"}
          submitLabel="Mettre à jour"
        />
      </div>
    </div>
  );
}
