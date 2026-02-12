export type Role = "admin" | "secretary";

export type Program = "coiffure" | "coiffure_visagiste" | "esthetique";

export interface Database {
  public: {
    Tables: {
      schools: {
        Row: {
          id: string;
          name: string;
          code: string;
          director: string | null;
          address: string | null;
          phone: string | null;
          authorization: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          code: string;
          director?: string | null;
          address?: string | null;
          phone?: string | null;
          authorization?: string | null;
          created_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["schools"]["Insert"]>;
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          role: Role;
          school_id: string | null;
          full_name: string | null;
          created_at: string | null;
        };
        Insert: {
          id: string;
          role: Role;
          school_id?: string | null;
          full_name?: string | null;
          created_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "profiles_school_id_fkey";
            columns: ["school_id"];
            referencedRelation: "schools";
            referencedColumns: ["id"];
          }
        ];
      };
      students: {
        Row: {
          id: string;
          school_id: string;
          serial_code: string;
          full_name: string;
          cin: string | null;
          code_massar: string | null;
          birth_date: string | null;
          birth_place: string | null;
          address: string | null;
          phone: string | null;
          father_mother: string | null;
          profession: string | null;
          program: Program | null;
          niveau_scolaire: string | null;
          derniere_annee_scolaire: string | null;
          school_year: string | null;
          reg_number: string | null;
          reg_date: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          school_id: string;
          serial_code?: string;
          full_name: string;
          cin?: string | null;
          code_massar?: string | null;
          birth_date?: string | null;
          birth_place?: string | null;
          address?: string | null;
          phone?: string | null;
          father_mother?: string | null;
          profession?: string | null;
          program?: Program | null;
          niveau_scolaire?: string | null;
          derniere_annee_scolaire?: string | null;
          school_year?: string | null;
          reg_number?: string | null;
          reg_date?: string | null;
          created_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["students"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "students_school_id_fkey";
            columns: ["school_id"];
            referencedRelation: "schools";
            referencedColumns: ["id"];
          }
        ];
      };
      payments: {
        Row: {
          id: string;
          student_id: string;
          year: number;
          month: number;
          paid: boolean;
          paid_at: string | null;
          amount: number | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          student_id: string;
          year: number;
          month: number;
          paid?: boolean;
          paid_at?: string | null;
          amount?: number | null;
          created_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["payments"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "payments_student_id_fkey";
            columns: ["student_id"];
            referencedRelation: "students";
            referencedColumns: ["id"];
          }
        ];
      };
      certificates: {
        Row: {
          id: string;
          student_id: string;
          school_id: string;
          school_year: string | null;
          certificate_no: string;
          issued_at: string | null;
          issued_by: string | null;
        };
        Insert: {
          id?: string;
          student_id: string;
          school_id: string;
          school_year?: string | null;
          certificate_no?: string;
          issued_at?: string | null;
          issued_by?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["certificates"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "certificates_student_id_fkey";
            columns: ["student_id"];
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "certificates_school_id_fkey";
            columns: ["school_id"];
            referencedRelation: "schools";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "certificates_issued_by_fkey";
            columns: ["issued_by"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"];
export type TablesInsert<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Update"];
