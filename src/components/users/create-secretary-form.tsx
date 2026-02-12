"use client";

import { useFormState, useFormStatus } from "react-dom";

interface SchoolOption {
  id: string;
  name: string;
}

interface ActionState {
  error?: string;
  success?: string;
}

interface CreateSecretaryFormProps {
  action: (state: ActionState | undefined, formData: FormData) => Promise<ActionState>;
  schools: SchoolOption[];
}

const initialState: ActionState = {};

export const CreateSecretaryForm = ({ action, schools }: CreateSecretaryFormProps) => {
  const [state, formAction] = useFormState(action, initialState);

  return (
    <form action={formAction} className="grid gap-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-4">
      <div className="flex flex-col gap-2 text-sm">
        <span className="font-medium text-slate-700">Nom complet</span>
        <input
          name="full_name"
          required
          className="rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-primaire-500 focus:outline-none focus:ring-2 focus:ring-primaire-100"
          placeholder="Nom Prénom"
        />
      </div>
      <div className="flex flex-col gap-2 text-sm">
        <span className="font-medium text-slate-700">Email</span>
        <input
          name="email"
          type="email"
          required
          className="rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-primaire-500 focus:outline-none focus:ring-2 focus:ring-primaire-100"
          placeholder="secretariat@ecole.fr"
        />
      </div>
      <div className="flex flex-col gap-2 text-sm">
        <span className="font-medium text-slate-700">Mot de passe temporaire</span>
        <input
          name="password"
          type="password"
          required
          minLength={6}
          aria-label="Mot de passe temporaire"
          placeholder="Entrez le mot de passe"
          className="rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-primaire-500 focus:outline-none focus:ring-2 focus:ring-primaire-100"
        />
      </div>
      <div className="flex flex-col gap-2 text-sm">
        <span className="font-medium text-slate-700">École</span>
        <select
          name="school_id"
          required
          aria-label="Sélectionner une école"
          className="rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-primaire-500 focus:outline-none focus:ring-2 focus:ring-primaire-100"
        >
          <option value="">Sélectionner</option>
          {schools.map((school) => (
            <option key={school.id} value={school.id}>
              {school.name}
            </option>
          ))}
        </select>
      </div>

      {state?.error ? <p className="md:col-span-4 text-sm text-red-600">{state.error}</p> : null}
      {state?.success ? <p className="md:col-span-4 text-sm text-emerald-600">{state.success}</p> : null}

      <div className="md:col-span-4 flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
};

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="rounded-md bg-primaire-600 px-4 py-2 text-sm font-medium text-white hover:bg-primaire-700 disabled:opacity-60"
      disabled={pending}
    >
      {pending ? "Création..." : "Créer le compte"}
    </button>
  );
};
