"use client";

import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { signUp } from "./actions";

const initialState = { error: "" } as const;

export const SignupForm = () => {
  const [state, formAction] = useFormState(signUp, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state && 'success' in state && state.success) {
      alert("Admin créé avec succès! Vous pouvez maintenant vous connecter.");
      router.push("/login");
    }
  }, [state, router]);

  return (
    <form action={formAction} className="mx-auto flex w-full max-w-sm flex-col gap-4 rounded-lg bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Créer un Admin</h1>
      <p className="text-sm text-slate-500">Créez le premier compte administrateur.</p>

      <label className="flex flex-col gap-2 text-sm">
        <span className="font-medium text-slate-700">Email</span>
        <input
          name="email"
          type="email"
          required
          className="rounded-md border border-slate-200 px-3 py-2 focus:border-primaire-500 focus:outline-none focus:ring-2 focus:ring-primaire-100"
          placeholder="admin@gestion.ma"
        />
      </label>

      <label className="flex flex-col gap-2 text-sm">
        <span className="font-medium text-slate-700">Mot de passe</span>
        <input
          name="password"
          type="password"
          required
          minLength={8}
          className="rounded-md border border-slate-200 px-3 py-2 focus:border-primaire-500 focus:outline-none focus:ring-2 focus:ring-primaire-100"
          placeholder="••••••••"
        />
      </label>

      {state && 'error' in state && state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}

      <button
        type="submit"
        className="rounded-md bg-primaire-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-primaire-700"
      >
        Créer Admin
      </button>

      <a href="/login" className="text-center text-sm text-primaire-600 hover:underline">
        Déjà un compte? Se connecter
      </a>
    </form>
  );
};
