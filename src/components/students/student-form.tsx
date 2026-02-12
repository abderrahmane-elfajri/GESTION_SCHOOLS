"use client";

import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useRef, useEffect } from "react";
import type { StudentFormState } from "@/lib/types/student-form-state";

interface SchoolOption {
  id: string;
  name: string;
}

interface StudentFormProps {
  action: (state: StudentFormState, formData: FormData) => Promise<StudentFormState>;
  initialValues?: Partial<Record<string, string | null>>;
  schools: SchoolOption[];
  disableSchoolSelect?: boolean;
  submitLabel: string;
}

export const StudentForm = ({ action, initialValues, schools, disableSchoolSelect, submitLabel }: StudentFormProps) => {
  const initialState: StudentFormState = {
    error: undefined,
    success: undefined,
    id: initialValues?.id ?? undefined
  };

  const [state, formAction] = useFormState(action, initialState);
  const { pending } = useFormStatus();
  const regNumberRef = useRef<HTMLInputElement>(null);

  // Clear reg_number field when there's an error on it
  useEffect(() => {
    if (state?.fieldErrors?.reg_number && regNumberRef.current) {
      regNumberRef.current.value = "";
    }
  }, [state?.fieldErrors?.reg_number]);

  const renderInput = (
    name: string,
    label: string,
    props?: (InputHTMLAttributes<HTMLInputElement> | TextareaHTMLAttributes<HTMLTextAreaElement>) & {
      textarea?: boolean;
    }
  ) => {
    const hasError = state?.fieldErrors?.[name];
    const baseClassName = "rounded-lg border px-4 py-2.5 text-sm transition focus:outline-none focus:ring-2";
    const errorClassName = hasError 
      ? "border-red-300 focus:border-red-500 focus:ring-red-200" 
      : "border-slate-300 focus:border-primaire-500 focus:ring-primaire-200";
    
    if (props?.textarea) {
      const { textarea, ...rest } = props as TextareaHTMLAttributes<HTMLTextAreaElement> & { textarea?: boolean };
      return (
        <label className="flex flex-col gap-2 text-sm">
          <span className="font-medium text-slate-700">{label}</span>
          <textarea
            name={name}
            defaultValue={initialValues?.[name] ?? ""}
            className={`${baseClassName} ${errorClassName}`}
            {...rest}
          />
          {hasError && <span className="text-xs text-red-600">{hasError}</span>}
        </label>
      );
    }

    return (
      <label className="flex flex-col gap-2 text-sm">
        <span className="font-medium text-slate-700">{label}</span>
        <input
          name={name}
          defaultValue={initialValues?.[name] ?? ""}
          className={`${baseClassName} ${errorClassName}`}
          {...(props as InputHTMLAttributes<HTMLInputElement>)}
        />
        {hasError && <span className="text-xs text-red-600">{hasError}</span>}
      </label>
    );
  };

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {initialValues?.id ? <input type="hidden" name="id" defaultValue={initialValues.id ?? undefined} /> : null}
      <div className="grid gap-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm md:col-span-2">
          <span className="font-medium text-slate-700">
            Nom et prénom <span className="text-red-500">*</span>
          </span>
          <input
            name="full_name"
            defaultValue={initialValues?.full_name ?? ""}
            required
            className={`rounded-lg border px-4 py-2.5 text-sm transition focus:outline-none focus:ring-2 ${
              state?.fieldErrors?.full_name
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-slate-300 focus:border-primaire-500 focus:ring-primaire-200'
            }`}
            placeholder="Ex: Ahmed Ben Ali"
          />
          {state?.fieldErrors?.full_name && (
            <span className="text-xs text-red-600">{state.fieldErrors.full_name}</span>
          )}
        </label>

        <label className="flex flex-col gap-2 text-sm">
          <span className="font-medium text-slate-700">
            École <span className="text-red-500">*</span>
          </span>
          <select
            name="school_id"
            defaultValue={initialValues?.school_id ?? ""}
            required
            disabled={disableSchoolSelect}
            className={`rounded-lg border px-4 py-2.5 text-sm transition focus:outline-none focus:ring-2 disabled:bg-slate-100 disabled:cursor-not-allowed ${
              state?.fieldErrors?.school_id
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-slate-300 focus:border-primaire-500 focus:ring-primaire-200'
            }`}
          >
            <option value="">Sélectionner une école</option>
            {schools.map((school) => (
              <option key={school.id} value={school.id}>
                {school.name}
              </option>
            ))}
          </select>
          {state?.fieldErrors?.school_id && (
            <span className="text-xs text-red-600">{state.fieldErrors.school_id}</span>
          )}
        </label>

        {renderInput("cin", "CIN", { placeholder: "Ex: AB123456" })}
        {renderInput("code_massar", "Code Massar", { placeholder: "Ex: M123456789" })}
        {renderInput("birth_date", "Date de naissance", { type: "date" })}
        {renderInput("birth_place", "Lieu de naissance", { placeholder: "Ex: Tunis" })}
        {renderInput("address", "Adresse", { textarea: true, rows: 2, placeholder: "Ex: 123 Avenue Habib Bourguiba, Tunis" })}
        {renderInput("phone", "Téléphone", { type: "tel", placeholder: "Ex: +216 12 345 678" })}
        {renderInput("father_mother", "Père / Mère", { placeholder: "Ex: Mohamed Ben Ali" })}
        {renderInput("profession", "Profession", { placeholder: "Ex: Enseignant" })}
        
        <label className="flex flex-col gap-2 text-sm">
          <span className="font-medium text-slate-700">Programme</span>
          <select
            name="program"
            defaultValue={initialValues?.program ?? ""}
            className={`rounded-lg border px-4 py-2.5 text-sm transition focus:outline-none focus:ring-2 ${
              state?.fieldErrors?.program
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-slate-300 focus:border-primaire-500 focus:ring-primaire-200'
            }`}
          >
            <option value="">Sélectionner un programme</option>
            <option value="coiffure">Coiffure</option>
            <option value="coiffure_visagiste">Coiffure Visagiste</option>
            <option value="esthetique">Esthétique</option>
          </select>
          {state?.fieldErrors?.program && (
            <span className="text-xs text-red-600">{state.fieldErrors.program}</span>
          )}
        </label>
        
        <label className="flex flex-col gap-2 text-sm">
          <span className="font-medium text-slate-700">Niveau Scolaire</span>
          <select
            name="niveau_scolaire"
            defaultValue={initialValues?.niveau_scolaire ?? ""}
            className={`rounded-lg border px-4 py-2.5 text-sm transition focus:outline-none focus:ring-2 ${
              state?.fieldErrors?.niveau_scolaire
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-slate-300 focus:border-primaire-500 focus:ring-primaire-200'
            }`}
          >
            <option value="">Sélectionner un niveau</option>
            <option value="1ère année">1ère année</option>
            <option value="2ème année">2ème année</option>
            <option value="3ème année">3ème année</option>
            <option value="4ème année">4ème année</option>
            <option value="5ème année">5ème année</option>
            <option value="6ème année">6ème année</option>
            <option value="7ème année">7ème année</option>
            <option value="8ème année">8ème année</option>
            <option value="9ème année">9ème année</option>
            <option value="1ère année collège">1ère année collège</option>
            <option value="2ème année collège">2ème année collège</option>
            <option value="3ème année collège">3ème année collège</option>
            <option value="Tronc commun">Tronc commun</option>
            <option value="1ère année Bac">1ère année Bac</option>
            <option value="2ème année Bac">2ème année Bac</option>
          </select>
          {state?.fieldErrors?.niveau_scolaire && (
            <span className="text-xs text-red-600">{state.fieldErrors.niveau_scolaire}</span>
          )}
        </label>
        
        {renderInput("derniere_annee_scolaire", "Dernière année scolaire", { placeholder: "Ex: 2024/2025" })}
        {renderInput("school_year", "Année scolaire", { placeholder: "Ex: 2025/2026" })}
        <div className="md:col-span-2">
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-slate-700">Numéro d&apos;inscription <span className="text-slate-500 text-xs font-normal">(optionnel - laissez vide pour auto-génération)</span></span>
            <input
              ref={regNumberRef}
              name="reg_number"
              defaultValue={initialValues?.reg_number ?? ""}
              className={`rounded-lg border px-4 py-2.5 text-sm transition focus:outline-none focus:ring-2 ${
                state?.fieldErrors?.reg_number
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : 'border-slate-300 focus:border-primaire-500 focus:ring-primaire-200'
              }`}
              placeholder="Laisser vide pour génération automatique"
            />
            {state?.fieldErrors?.reg_number && (
              <span className="text-xs text-red-600">{state.fieldErrors.reg_number} - Laissez le champ vide pour auto-génération</span>
            )}
          </label>
        </div>
        {renderInput("reg_date", "Date d'inscription", { type: "date" })}
      </div>

      {state?.error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 flex items-start gap-3">
          <svg className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-red-800">Erreur</h3>
            <p className="mt-1 text-sm text-red-700">{state.error}</p>
          </div>
        </div>
      ) : null}
      
      {state?.success ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 flex items-start gap-3">
          <svg className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-emerald-800">Succès</h3>
            <p className="mt-1 text-sm text-emerald-700">{state.success}</p>
          </div>
        </div>
      ) : null}

      <div className="flex justify-end gap-3">
        <button
          type="submit"
          className="flex items-center gap-2 rounded-lg bg-primaire-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-primaire-700 disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={pending}
        >
          {pending ? (
            <>
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Enregistrement...
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {submitLabel}
            </>
          )}
        </button>
      </div>
    </form>
  );
};
