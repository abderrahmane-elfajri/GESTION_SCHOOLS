import { TableSkeleton } from "@/components/ui/loading-skeleton";

export default function StudentsLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="animate-pulse">
        <div className="h-10 bg-slate-200 rounded w-48 mb-4"></div>
        <div className="h-6 bg-slate-200 rounded w-64"></div>
      </div>
      <TableSkeleton />
    </div>
  );
}
