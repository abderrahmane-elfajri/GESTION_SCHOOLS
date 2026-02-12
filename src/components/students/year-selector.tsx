"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface YearSelectorProps {
  currentYear: number;
  years: number[];
}

export function YearSelector({ currentYear, years }: YearSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleYearChange = (year: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("year", year);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-600">Année</span>
      <select
        name="year"
        value={currentYear}
        onChange={(e) => handleYearChange(e.target.value)}
        className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium transition focus:border-primaire-500 focus:outline-none focus:ring-2 focus:ring-primaire-200"
        aria-label="Année"
      >
        {years.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
    </div>
  );
}
