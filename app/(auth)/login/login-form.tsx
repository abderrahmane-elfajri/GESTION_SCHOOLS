"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { signIn } from "./actions";

const initialState = { error: "" } as const;

interface LoginFormProps {
  redirectTo?: string;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button
      type="submit"
      className="flex items-center justify-center gap-2 rounded-md bg-primaire-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-primaire-700 disabled:opacity-60"
      disabled={pending}
    >
      {pending ? (
        <>
          <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Connexion...
        </>
      ) : "Se connecter"}
    </button>
  );
}

export const LoginForm = ({ redirectTo }: LoginFormProps) => {
  const [state, formAction] = useFormState(signIn, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state && 'success' in state && state.success && state.redirectTo) {
      router.push(state.redirectTo);
    }
  }, [state, router]);

  return (
    <form action={formAction} className="mx-auto flex w-full max-w-sm flex-col gap-4 rounded-lg bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Connexion</h1>
      <p className="text-sm text-slate-500">Accédez à la plateforme de gestion scolaire.</p>

      <label className="flex flex-col gap-2 text-sm">
        <span className="font-medium text-slate-700">Email</span>
        <input
          name="email"
          type="email"
          required
          className="rounded-md border border-slate-200 px-3 py-2 focus:border-primaire-500 focus:outline-none focus:ring-2 focus:ring-primaire-100"
          placeholder="nom@ecole.fr"
        />
      </label>

      <label className="flex flex-col gap-2 text-sm">
        <span className="font-medium text-slate-700">Mot de passe</span>
        <input
          name="password"
          type="password"
          required
          className="rounded-md border border-slate-200 px-3 py-2 focus:border-primaire-500 focus:outline-none focus:ring-2 focus:ring-primaire-100"
          placeholder="••••••••"
        />
      </label>

      {redirectTo ? <input type="hidden" name="redirect" value={redirectTo} /> : null}

      {state && 'error' in state && state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}

      <SubmitButton />
    </form>
  );
};
