import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { Tables, TablesInsert } from "@/lib/database.types";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type StudentRow = Tables<"students"> & {
  schools?: Pick<Tables<"schools">, "id" | "name" | "code" | "director" | "address" | "phone" | "authorization"> | null;
};

// Cache fonts for better performance
let cachedHelveticaFont: any = null;
let cachedHelveticaBoldFont: any = null;

async function getHelveticaFont(pdfDoc: PDFDocument) {
  if (!cachedHelveticaFont) {
    cachedHelveticaFont = StandardFonts.Helvetica;
  }
  return pdfDoc.embedFont(cachedHelveticaFont);
}

async function getHelveticaBoldFont(pdfDoc: PDFDocument) {
  if (!cachedHelveticaBoldFont) {
    cachedHelveticaBoldFont = StandardFonts.HelveticaBold;
  }
  return pdfDoc.embedFont(cachedHelveticaBoldFont);
}

export async function GET(req: NextRequest) {
  const studentId = req.nextUrl.searchParams.get("studentId");
  const schoolYearParam = req.nextUrl.searchParams.get("schoolYear");
  const format = req.nextUrl.searchParams.get("format");

  if (!studentId) {
    return NextResponse.json({ error: "studentId requis" }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();

  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, school_id, full_name")
    .eq("id", session.user.id)
    .maybeSingle();

  if (profileError || !profile) {
    return NextResponse.json({ error: "Profil introuvable" }, { status: 403 });
  }

  const profileRow = profile as {
    role: string;
    school_id: string | null;
    full_name: string | null;
  };

  const { data: student, error: studentError } = await supabase
    .from("students")
    .select("*, schools(id, name, code, director, address, phone, authorization)")
    .eq("id", studentId)
    .maybeSingle();

  if (studentError || !student) {
    return NextResponse.json({ error: "Élève introuvable" }, { status: 404 });
  }

  const studentRow = student as unknown as StudentRow;

  if (profileRow.role === "secretary" && profileRow.school_id !== studentRow.school_id) {
    return NextResponse.json({ error: "Accès interdit" }, { status: 403 });
  }

  const insertPayload: TablesInsert<"certificates"> = {
    student_id: studentId,
    school_id: studentRow.school_id,
    school_year: schoolYearParam ?? studentRow.school_year,
    issued_by: session.user.id
  };

  const { data: inserted, error: insertError } = await supabase
    .from("certificates")
    .insert(insertPayload as any)
    .select("*")
    .single();

  if (insertError || !inserted) {
    return NextResponse.json({ error: "Insertion impossible" }, { status: 500 });
  }

  const insertedRow = inserted as {
    certificate_no: string;
  };

  const pdfBytes =
    format === "card"
          ? await generateCardPdf({ student: studentRow, certificateNo: insertedRow.certificate_no })
      : await generateCertificatePdf({
            student: studentRow,
          certificateNo: insertedRow.certificate_no,
            schoolYear: schoolYearParam ?? studentRow.school_year ?? "",
          issuedBy: profileRow.full_name ?? ""
        });

  const filenameBase = `certificat-${studentRow.serial_code}${format === "card" ? "-carte" : ""}`;

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filenameBase}.pdf"`
    }
  });
}

interface PdfContext {
  student: StudentRow;
  certificateNo: string;
  schoolYear: string;
  issuedBy: string;
}

async function generateCertificatePdf({ student, certificateNo, schoolYear, issuedBy }: PdfContext) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
  const fontBold = await getHelveticaBoldFont(pdfDoc);
  const font = await getHelveticaFont(pdfDoc);
  const { width, height } = page.getSize();

  // Get dynamic school information from database
  const schoolName = student.schools?.name || "Ecole la Palme D'or Internationale";
  const directorName = student.schools?.director || "Directeur";
  const schoolAddress = student.schools?.address || "lotissement Dandoune N°154 Sidi maarouf";
  const schoolPhone = student.schools?.phone || "0667622925";
  const schoolAuthorization = student.schools?.authorization || "3/08/1/2012 DU 25/12/2012";

  const textColor = rgb(0, 0, 0);
  const primaryColor = rgb(0.1, 0.2, 0.6); // Blue for headers
  let yPos = height - 80;

  // Draw decorative top border
  page.drawRectangle({
    x: 40,
    y: height - 50,
    width: width - 80,
    height: 3,
    color: primaryColor
  });

  // ==================== HEADER SECTION ====================
  yPos -= 20;
  
  // School name - centered and bold
  const schoolTitle = `Etablissement ${schoolName}`;
  const schoolTitleWidth = fontBold.widthOfTextAtSize(schoolTitle, 16);
  page.drawText(schoolTitle, { 
    x: (width - schoolTitleWidth) / 2, 
    y: yPos, 
    size: 16, 
    font: fontBold, 
    color: primaryColor 
  });
  yPos -= 25;

  // Subtitle - centered
  const subtitle = "privée de coiffure et esthétique";
  const subtitleWidth = font.widthOfTextAtSize(subtitle, 12);
  page.drawText(subtitle, { 
    x: (width - subtitleWidth) / 2, 
    y: yPos, 
    size: 12, 
    font, 
    color: textColor 
  });
  yPos -= 30;

  // Contact info - centered (dynamic from database)
  const address = `Adresse : ${schoolAddress}`;
  const addressWidth = font.widthOfTextAtSize(address, 10);
  page.drawText(address, { 
    x: (width - addressWidth) / 2, 
    y: yPos, 
    size: 10, 
    font, 
    color: textColor 
  });
  yPos -= 18;

  const contact = `Tel : ${schoolPhone}`;
  const contactWidth = font.widthOfTextAtSize(contact, 10);
  page.drawText(contact, { 
    x: (width - contactWidth) / 2, 
    y: yPos, 
    size: 10, 
    font, 
    color: textColor 
  });
  yPos -= 18;

  const authorization = `Autorisé sous N° ${schoolAuthorization}`;
  const authWidth = font.widthOfTextAtSize(authorization, 10);
  page.drawText(authorization, { 
    x: (width - authWidth) / 2, 
    y: yPos, 
    size: 10, 
    font, 
    color: textColor 
  });
  yPos -= 40;

  // Decorative separator
  page.drawRectangle({
    x: width / 2 - 100,
    y: yPos,
    width: 200,
    height: 1,
    color: primaryColor
  });
  yPos -= 35;

  // ==================== DOCUMENT TITLE ====================
  const docTitle = "ATTESTATION DE SCOLARITÉ";
  const docTitleWidth = fontBold.widthOfTextAtSize(docTitle, 14);
  page.drawText(docTitle, { 
    x: (width - docTitleWidth) / 2, 
    y: yPos, 
    size: 14, 
    font: fontBold, 
    color: primaryColor 
  });
  yPos -= 50;

  // ==================== DIRECTOR DECLARATION ====================
  page.drawText(`Je soussigné Mr ${directorName}`, { 
    x: 60, 
    y: yPos, 
    size: 11, 
    font: fontBold, 
    color: textColor 
  });
  yPos -= 20;

  page.drawText(`Directeur de l'établissement ${schoolName}`, { 
    x: 60, 
    y: yPos, 
    size: 11, 
    font, 
    color: textColor 
  });
  yPos -= 25;

  page.drawText("privée de coiffure et esthétique", { 
    x: 60, 
    y: yPos, 
    size: 11, 
    font, 
    color: textColor 
  });
  yPos -= 40;

  // ==================== ATTESTATION CONTENT ====================
  page.drawText("Atteste que :", { 
    x: 60, 
    y: yPos, 
    size: 12, 
    font: fontBold, 
    color: textColor 
  });
  yPos -= 30;

  // Student info section with better formatting
  page.drawText("La stagiaire :", { 
    x: 80, 
    y: yPos, 
    size: 11, 
    font: fontBold, 
    color: textColor 
  });
  page.drawText(student.full_name.toUpperCase(), { 
    x: 170, 
    y: yPos, 
    size: 11, 
    font: fontBold, 
    color: primaryColor 
  });
  yPos -= 25;

  const birthDate = student.birth_date ? formatDate(student.birth_date) : "___________";
  const birthPlace = student.birth_place || "CASA";
  page.drawText("Né(e) le :", { 
    x: 80, 
    y: yPos, 
    size: 11, 
    font, 
    color: textColor 
  });
  page.drawText(`${birthDate} à ${birthPlace}`, { 
    x: 170, 
    y: yPos, 
    size: 11, 
    font, 
    color: textColor 
  });
  yPos -= 25;

  const regDate = student.reg_date ? formatDate(student.reg_date) : "___________";
  const regNumber = student.reg_number || certificateNo;
  page.drawText("Inscrit(e) le :", { 
    x: 80, 
    y: yPos, 
    size: 11, 
    font, 
    color: textColor 
  });
  page.drawText(`${regDate} sous le N° ${regNumber}`, { 
    x: 170, 
    y: yPos, 
    size: 11, 
    font, 
    color: textColor 
  });
  yPos -= 35;

  // Academic information section
  const niveauScolaire = student.niveau_scolaire || "1ère année";
  page.drawText("A poursuivi ses études en classe de :", { 
    x: 80, 
    y: yPos, 
    size: 11, 
    font, 
    color: textColor 
  });
  page.drawText(niveauScolaire, { 
    x: 300, 
    y: yPos, 
    size: 11, 
    font: fontBold, 
    color: primaryColor 
  });
  yPos -= 25;

  const programText = formatProgram(student.program);
  page.drawText("Filière :", { 
    x: 80, 
    y: yPos, 
    size: 11, 
    font, 
    color: textColor 
  });
  page.drawText(programText, { 
    x: 300, 
    y: yPos, 
    size: 11, 
    font: fontBold, 
    color: primaryColor 
  });
  yPos -= 25;

  page.drawText("Durée de formation :", { 
    x: 80, 
    y: yPos, 
    size: 11, 
    font, 
    color: textColor 
  });
  page.drawText("12 MOIS", { 
    x: 300, 
    y: yPos, 
    size: 11, 
    font: fontBold, 
    color: textColor 
  });
  yPos -= 25;

  page.drawText("Niveau de formation :", { 
    x: 80, 
    y: yPos, 
    size: 11, 
    font, 
    color: textColor 
  });
  page.drawText("FORMATION CONTINUE", { 
    x: 300, 
    y: yPos, 
    size: 11, 
    font: fontBold, 
    color: textColor 
  });
  yPos -= 50;

  // ==================== FOOTER ====================
  const footerText = "La présente attestation est délivrée à l'intéressé(e) pour servir et valoir ce que de droit.";
  const footerWidth = font.widthOfTextAtSize(footerText, 10);
  page.drawText(footerText, { 
    x: (width - footerWidth) / 2, 
    y: yPos, 
    size: 10, 
    font: fontBold, 
    color: textColor 
  });
  yPos -= 60;

  // Date and location
  const dateText = `Fait à Casablanca, le ${new Date().toLocaleDateString("fr-FR")}`;
  page.drawText(dateText, { 
    x: 60, 
    y: yPos, 
    size: 10, 
    font, 
    color: textColor 
  });

  // Signature section
  page.drawText("Le Directeur", { 
    x: 420, 
    y: yPos, 
    size: 11, 
    font: fontBold, 
    color: textColor 
  });
  yPos -= 20;
  
  page.drawText("Signature et Cachet", { 
    x: 405, 
    y: yPos, 
    size: 9, 
    font, 
    color: textColor 
  });

  // Bottom border
  page.drawRectangle({
    x: 40,
    y: 50,
    width: width - 80,
    height: 2,
    color: primaryColor
  });

  return pdfDoc.save();
}

async function generateCardPdf({
  student,
  certificateNo
}: {
  student: StudentRow;
  certificateNo: string;
}) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([325.98, 204.09]);
  const font = await getHelveticaBoldFont(pdfDoc);
  const fontRegular = await getHelveticaFont(pdfDoc);

  const borderColor = rgb(0.29, 0.36, 0.81);
  const backgroundColor = rgb(0.95, 0.96, 1);

  page.drawRectangle({
    x: 10,
    y: 10,
    width: 305.98,
    height: 184.09,
    borderColor,
    borderWidth: 2,
    color: backgroundColor
  });

  page.drawText(student.schools?.name ?? "", { x: 24, y: 170, size: 16, font });
  page.drawText("Carte d'abonnement", { x: 24, y: 145, size: 14, font });
  page.drawText(`Élève: ${student.full_name}`, { x: 24, y: 120, size: 12, font: fontRegular });
  page.drawText(`Programme: ${formatProgram(student.program)}`, { x: 24, y: 100, size: 12, font: fontRegular });
  page.drawText(`Année: ${student.school_year ?? ""}`, { x: 24, y: 80, size: 12, font: fontRegular });
  page.drawText(`N°: ${certificateNo}`, { x: 24, y: 60, size: 12, font: fontRegular });

  return pdfDoc.save();
}

function formatDate(value?: string | null) {
  if (!value) {
    return "";
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
