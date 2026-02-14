"use client";

import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { signOut } from "./logout-action";

const initialState = null;

export function LogoutButton() {
  const [state, formAction] = useFormState(signOut, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state && 'success' in state && state.success && state.redirectTo) {
      router.push(state.redirectTo);
    }
  }, [state, router]);

  return (
    <form action={formAction}>
      <button 
        type="submit" 
        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
      >
        Déconnexion
      </button>
      {state && 'error' in state && state.error ? (
        <p className="mt-1 text-xs text-red-600">{state.error}</p>
      ) : null}
    </form>
  );
}
