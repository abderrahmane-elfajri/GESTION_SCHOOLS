"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { signOut } from "./logout-action";

const initialState = null;

function LogoutSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit" 
      className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
      disabled={pending}
    >
      {pending ? (
        <>
          <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Déconnexion...
        </>
      ) : "Déconnexion"}
    </button>
  );
}

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
      <LogoutSubmitButton />
      {state && 'error' in state && state.error ? (
        <p className="mt-1 text-xs text-red-600">{state.error}</p>
      ) : null}
    </form>
  );
}
