"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface CertificateButtonsProps {
  studentId: string;
  schoolYear: string;
}

export function CertificateButtons({ studentId, schoolYear }: CertificateButtonsProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingCard, setIsGeneratingCard] = useState(false);
  const router = useRouter();

  const handleGenerateCertificate = async (format?: "card") => {
    if (format === "card") {
      if (isGeneratingCard) return;
      setIsGeneratingCard(true);
    } else {
      if (isGenerating) return;
      setIsGenerating(true);
    }

    try {
      const url = `/api/certificates?studentId=${studentId}&schoolYear=${encodeURIComponent(schoolYear)}${format ? `&format=${format}` : ""}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error("Erreur lors de la génération");
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `certificat-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      
      // Refresh to show new certificate in table
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la génération du certificat");
    } finally {
      if (format === "card") {
        setIsGeneratingCard(false);
      } else {
        setIsGenerating(false);
      }
    }
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={() => handleGenerateCertificate()}
        disabled={isGenerating}
        className="flex items-center gap-2 rounded-lg bg-primaire-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-primaire-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isGenerating ? (
          <>
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Génération...
          </>
        ) : (
          <>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Générer certificat
          </>
        )}
      </button>
      
      <button
        onClick={() => handleGenerateCertificate("card")}
        disabled={isGeneratingCard}
        className="flex items-center gap-2 rounded-lg border-2 border-primaire-200 bg-white px-4 py-2 text-sm font-medium text-primaire-600 transition hover:bg-primaire-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isGeneratingCard ? (
          <>
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Génération...
          </>
        ) : (
          <>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
            </svg>
            Carte abonnement
          </>
        )}
      </button>
    </div>
  );
}
