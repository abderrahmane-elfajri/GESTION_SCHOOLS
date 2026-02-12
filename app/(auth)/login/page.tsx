import { LoginForm } from "./login-form";
import Link from "next/link";

export default async function LoginPage({ searchParams }: { searchParams: { redirect?: string } }) {
  return (
    <div className="flex min-h-screen">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primaire-600 via-primaire-700 to-primaire-800 p-12 flex-col justify-between">
        <div>
          <Link href="/" className="flex items-center gap-2 text-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-xl font-bold">Gestion Scolaire</span>
          </Link>
        </div>
        
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-white leading-tight">
            Gérez votre établissement en toute simplicité
          </h1>
          <p className="text-lg text-primaire-100">
            Plateforme moderne et sécurisée pour la gestion des élèves, des paiements et des certificats.
          </p>
          
          <div className="grid grid-cols-2 gap-4 pt-8">
            <div className="rounded-lg bg-white/10 backdrop-blur-sm p-4">
              <div className="text-3xl font-bold text-white">100%</div>
              <div className="text-sm text-primaire-100">Sécurisé</div>
            </div>
            <div className="rounded-lg bg-white/10 backdrop-blur-sm p-4">
              <div className="text-3xl font-bold text-white">24/7</div>
              <div className="text-sm text-primaire-100">Disponible</div>
            </div>
          </div>
        </div>

        <div className="text-sm text-primaire-100">
          © 2026 Gestion Scolaire. Tous droits réservés.
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primaire-600">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-xl font-bold text-slate-900">Gestion Scolaire</span>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-slate-900">Connexion</h2>
            <p className="mt-2 text-sm text-slate-600">
              Accédez à votre espace de gestion
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <LoginForm redirectTo={searchParams?.redirect} />
          </div>

          <div className="text-center">
            <Link href="/" className="text-sm text-primaire-600 hover:text-primaire-700 font-medium">
              ← Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
