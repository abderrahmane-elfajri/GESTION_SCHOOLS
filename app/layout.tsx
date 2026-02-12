import type { Metadata } from "next";
import { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gestion scolaire",
  description: "Plateforme de gestion des élèves et paiements",
  applicationName: "Gestion Scolaire",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className="bg-slate-50">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_SUPABASE_URL} />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
