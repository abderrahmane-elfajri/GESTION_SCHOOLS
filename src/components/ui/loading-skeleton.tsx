"use client";

interface LoadingSkeletonProps {
  count?: number;
  className?: string;
}

export function LoadingSkeleton({ count = 1, className = "h-32" }: LoadingSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`rounded-xl bg-slate-200 animate-pulse ${className}`}></div>
      ))}
    </>
  );
}

export function TableSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="rounded-lg border border-slate-200 overflow-hidden">
        <div className="bg-slate-100 h-12"></div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="border-t border-slate-200 h-16 bg-white"></div>
        ))}
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-slate-200 rounded"></div>
          <div className="h-4 bg-slate-200 rounded w-5/6"></div>
          <div className="h-4 bg-slate-200 rounded w-4/6"></div>
        </div>
      </div>
    </div>
  );
}
