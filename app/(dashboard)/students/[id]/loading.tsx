import { CardSkeleton } from "@/components/ui/loading-skeleton";

export default function StudentDetailLoading() {
  return (
    <div className="flex flex-col gap-8">
      <div className="animate-pulse h-12 bg-slate-200 rounded"></div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
}
