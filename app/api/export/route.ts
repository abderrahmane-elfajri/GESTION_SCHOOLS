import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";
import type { Tables } from "@/lib/database.types";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { studentFiltersSchema } from "@/lib/schemas/student";

type ExportStudentRow = Pick<
  Tables<"students">,
  "id" | "full_name" | "cin" | "code_massar" | "birth_date" | "birth_place" | "phone" | "address" | "father_mother" | "profession" | "program" | "niveau_scolaire" | "derniere_annee_scolaire" | "school_year" | "serial_code" | "school_id" | "reg_number"
> & {
  schools?: Pick<Tables<"schools">, "name"> | null;
};

type ExportPaymentRow = Pick<Tables<"payments">, "student_id" | "month" | "paid" | "amount">;

export async function GET(req: NextRequest) {
  const supabase = createServerSupabaseClient();

  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  // Extract filters directly from URL params
  const search = req.nextUrl.searchParams.get("search") || undefined;
  const program = req.nextUrl.searchParams.get("program") || undefined;
  const school_year = req.nextUrl.searchParams.get("school_year") || undefined;
  const school_id = req.nextUrl.searchParams.get("school_id") || undefined;
  const year = req.nextUrl.searchParams.get("year")
    ? parseInt(req.nextUrl.searchParams.get("year")!, 10)
    : new Date().getFullYear();

  console.log("Export filters from URL:", { search, program, school_year, school_id, year });

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, school_id")
    .eq("id", session.user.id)
    .maybeSingle();

  if (profileError || !profile) {
    return NextResponse.json({ error: "Profil introuvable" }, { status: 403 });
  }

  const profileRow = profile as Pick<Tables<"profiles">, "role" | "school_id">;

  // For secretaries, enforce their school_id. For admins, use the filter if provided
  const effectiveSchoolId =
    profileRow.role === "secretary" 
      ? profileRow.school_id 
      : school_id;

  console.log("User role:", profileRow.role);
  console.log("Effective school_id:", effectiveSchoolId);

  let query = supabase
    .from("students")
    .select("id, full_name, cin, code_massar, birth_date, birth_place, phone, address, father_mother, profession, program, niveau_scolaire, derniere_annee_scolaire, school_year, serial_code, schools(name), school_id, reg_number")
    .order("full_name", { ascending: true })
    .range(0, 2000);

  if (effectiveSchoolId) {
    query = query.eq("school_id", effectiveSchoolId);
    console.log("✓ Applying school filter:", effectiveSchoolId);
  }

  if (search && search.trim()) {
    const term = `%${search.trim()}%`;
    query = query.or(`full_name.ilike.${term},phone.ilike.${term},reg_number.ilike.${term},serial_code.ilike.${term}`);
    console.log("✓ Applying search filter:", search);
  }

  if (program && (program === "coiffure" || program === "coiffure_visagiste" || program === "esthetique")) {
    query = query.eq("program", program);
    console.log("✓ Applying program filter:", program);
  }

  if (school_year && school_year.trim()) {
    query = query.eq("school_year", school_year);
    console.log("✓ Applying school_year filter:", school_year);
  }

  const { data: students, error: studentsError } = await query;

  if (studentsError) {
    return NextResponse.json({ error: "Erreur chargement élèves" }, { status: 500 });
  }

  const studentRows = (students ?? []) as ExportStudentRow[];

  const studentIds = studentRows.map((student) => student.id);

  const { data: paymentsData } = await supabase
    .from("payments")
    .select("student_id, month, paid, amount")
    .eq("year", year)
    .in("student_id", studentIds.length > 0 ? studentIds : ["00000000-0000-0000-0000-000000000000"]);

  const paymentRows = (paymentsData ?? []) as ExportPaymentRow[];

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Élèves");

  sheet.columns = [
    { header: "École", key: "school", width: 25 },
    { header: "Nom complet", key: "name", width: 28 },
    { header: "CIN", key: "cin", width: 15 },
    { header: "Code Massar", key: "code_massar", width: 18 },
    { header: "Date naissance", key: "birth_date", width: 15 },
    { header: "Lieu naissance", key: "birth_place", width: 20 },
    { header: "Téléphone", key: "phone", width: 18 },
    { header: "Adresse", key: "address", width: 30 },
    { header: "Père/Mère", key: "father_mother", width: 25 },
    { header: "Profession", key: "profession", width: 20 },
    { header: "Programme", key: "program", width: 20 },
    { header: "Niveau Scolaire", key: "niveau_scolaire", width: 20 },
    { header: "Dernière Année", key: "derniere_annee", width: 15 },
    { header: "Année scolaire", key: "year", width: 15 },
    { header: "Matricule", key: "serial", width: 18 },
    { header: "Num. inscription", key: "reg", width: 18 },
    ...Array.from({ length: 12 }, (_, index) => ({ header: monthName(index + 1), key: `m${index + 1}`, width: 12 }))
  ];

  studentRows.forEach((student) => {
    const payments = paymentRows.filter((payment) => payment.student_id === student.id);
    const row: Record<string, string | number | null> = {
      school: student.schools?.name ?? "",
      name: student.full_name,
      cin: student.cin ?? "",
      code_massar: student.code_massar ?? "",
      birth_date: student.birth_date ? new Date(student.birth_date).toLocaleDateString("fr-FR") : "",
      birth_place: student.birth_place ?? "",
      phone: student.phone ?? "",
      address: student.address ?? "",
      father_mother: student.father_mother ?? "",
      profession: student.profession ?? "",
      program: formatProgram(student.program),
      niveau_scolaire: student.niveau_scolaire ?? "",
      derniere_annee: student.derniere_annee_scolaire ?? "",
      year: student.school_year ?? "",
      serial: student.serial_code,
      reg: student.reg_number ?? ""
    };

    for (let month = 1; month <= 12; month += 1) {
      const payment = payments.find((item) => item.month === month);
      row[`m${month}`] = payment ? (payment.paid ? "Payé" : `Impayé${payment.amount ? ` (${payment.amount}€)` : ""}`) : "-";
    }

    sheet.addRow(row);
  });

  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(Buffer.from(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="export-eleves-${year}.xlsx"`
    }
  });
}

function monthName(month: number) {
  return new Intl.DateTimeFormat("fr-FR", { month: "short" }).format(new Date(2020, month - 1, 1));
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
