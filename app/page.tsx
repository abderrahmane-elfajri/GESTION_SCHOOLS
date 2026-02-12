import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primaire-50 via-white to-primaire-100">
      {/* Header */}
      <header className="border-b border-primaire-100 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primaire-600">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-xl font-bold text-slate-900">Gestion Scolaire</span>
            </div>
            <Link
              href="/login"
              className="rounded-lg bg-primaire-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-primaire-700"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            <span className="block">Gérez votre école</span>
            <span className="block text-primaire-600">en toute simplicité</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            Plateforme moderne et sécurisée pour la gestion des élèves, des paiements mensuels 
            et la génération de certificats de scolarité.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link
              href="/login"
              className="rounded-lg bg-primaire-600 px-8 py-3 text-base font-medium text-white shadow-lg transition hover:bg-primaire-700 hover:shadow-xl"
            >
              Commencer maintenant
            </Link>
            <a
              href="#features"
              className="rounded-lg border-2 border-primaire-600 bg-white px-8 py-3 text-base font-medium text-primaire-600 transition hover:bg-primaire-50"
            >
              En savoir plus
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900">Fonctionnalités</h2>
            <p className="mt-4 text-lg text-slate-600">
              Tout ce dont vous avez besoin pour gérer votre établissement
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primaire-100">
                <svg className="h-6 w-6 text-primaire-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">Gestion des élèves</h3>
              <p className="mt-2 text-sm text-slate-600">
                Enregistrez et suivez les informations complètes de vos élèves avec un système de matricule automatique.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
                <svg className="h-6 w-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">Suivi des paiements</h3>
              <p className="mt-2 text-sm text-slate-600">
                Gérez les paiements mensuels avec une interface intuitive et des exports Excel détaillés.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100">
                <svg className="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">Certificats PDF</h3>
              <p className="mt-2 text-sm text-slate-600">
                Générez instantanément des certificats de scolarité et cartes d&apos;abonnement en PDF.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-rose-100">
                <svg className="h-6 w-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">Sécurisé & fiable</h3>
              <p className="mt-2 text-sm text-slate-600">
                Authentification sécurisée et contrôle d&apos;accès basé sur les rôles (admin/secrétaire).
              </p>
            </div>

            {/* Feature 5 */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-violet-100">
                <svg className="h-6 w-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">Recherche avancée</h3>
              <p className="mt-2 text-sm text-slate-600">
                Filtrez par école, programme, année scolaire et recherchez par nom, téléphone ou matricule.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-100">
                <svg className="h-6 w-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">Rapports & exports</h3>
              <p className="mt-2 text-sm text-slate-600">
                Exportez vos données en Excel avec tous les détails de paiements pour l&apos;analyse.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primaire-600 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white">
            Prêt à simplifier votre gestion scolaire ?
          </h2>
          <p className="mt-4 text-lg text-primaire-100">
            Rejoignez les établissements qui font confiance à notre plateforme
          </p>
          <Link
            href="/login"
            className="mt-8 inline-block rounded-lg bg-white px-8 py-3 text-base font-medium text-primaire-600 shadow-lg transition hover:bg-primaire-50 hover:shadow-xl"
          >
            Accéder à la plateforme
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm text-slate-600">
            © 2026 Gestion Scolaire. Plateforme moderne de gestion d&apos;établissements scolaires.
          </p>
        </div>
      </footer>
    </div>
  );
}
