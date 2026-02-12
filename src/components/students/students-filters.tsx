"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

interface SchoolOption {
  id: string;
  name: string;
}

interface StudentsFiltersProps {
  programs: Array<{ value: string; label: string }>;
  schoolYears: string[];
  schools: SchoolOption[];
  isAdmin: boolean;
  defaultValues: {
    search?: string | null;
    program?: string | null;
    school_year?: string | null;
    school_id?: string | null;
  };
}

export const StudentsFilters = ({ programs, schoolYears, schools, isAdmin, defaultValues }: StudentsFiltersProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(defaultValues.search ?? "");

  const buildQuery = useCallback(
    (params: Record<string, string | null>) => {
      const current = new URLSearchParams(searchParams.toString());
      Object.entries(params).forEach(([key, value]) => {
        if (!value) {
          current.delete(key);
        } else {
          current.set(key, value);
        }
      });
      router.push(`${pathname}?${current.toString()}`);
    },
    [router, pathname, searchParams]
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      buildQuery({ search: searchValue ? searchValue : null, page: null });
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchValue, buildQuery]);

  const onSelectChange = useCallback(
    (key: string, value: string) => {
      buildQuery({ [key]: value || null, page: null });
    },
    [buildQuery]
  );

  const programOptions = useMemo(() => [{ value: "", label: "Programme" }, ...programs], [programs]);

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex-1 min-w-[200px]">
        <input
          type="search"
          placeholder="Rechercher (nom, téléphone, inscription...)"
          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-primaire-500 focus:outline-none focus:ring-2 focus:ring-primaire-100"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
        />
      </div>
      <select
        aria-label="Filtrer par programme"
        className="min-w-[160px] rounded-md border border-slate-200 px-3 py-2 text-sm"
        defaultValue={defaultValues.program ?? ""}
        onChange={(event) => onSelectChange("program", event.target.value)}
      >
        {programOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <select
        aria-label="Filtrer par année scolaire"
        className="min-w-[150px] rounded-md border border-slate-200 px-3 py-2 text-sm"
        defaultValue={defaultValues.school_year ?? ""}
        onChange={(event) => onSelectChange("school_year", event.target.value)}
      >
        <option value="">Année scolaire</option>
        {schoolYears.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
      {isAdmin ? (
        <select
          aria-label="Filtrer par école"
          className="min-w-[150px] rounded-md border border-slate-200 px-3 py-2 text-sm"
          defaultValue={defaultValues.school_id ?? ""}
          onChange={(event) => onSelectChange("school_id", event.target.value)}
        >
          <option value="">Toutes les écoles</option>
          {schools.map((school) => (
            <option key={school.id} value={school.id}>
              {school.name}
            </option>
          ))}
        </select>
      ) : null}
    </div>
  );
};
