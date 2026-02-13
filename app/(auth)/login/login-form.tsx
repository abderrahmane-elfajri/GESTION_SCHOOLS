"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { signIn } from "./actions";

const initialState = { error: "" } as const;

interface LoginFormProps {
  redirectTo?: string;
}

export const LoginForm = ({ redirectTo }: LoginFormProps) => {
  const [state, formAction] = useFormState(signIn, initialState);
  const { pending } = useFormStatus();
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

      <button
        type="submit"
        className="rounded-md bg-primaire-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-primaire-700 disabled:opacity-60"
        disabled={pending}
      >
        {pending ? "Connexion..." : "Se connecter"}
      </button>
    </form>
  );
};
