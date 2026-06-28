export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-brand-sm bg-sky/10 ${className}`} />;
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-brand bg-white dark:bg-surface p-5 shadow-sm ring-1 ring-[#E6EEF8] dark:ring-border">
      <Skeleton className="mb-3 h-2 w-12" />
      <Skeleton className="mb-1 h-8 w-16" />
      <Skeleton className="h-4 w-20" />
    </div>
  );
}

export function ListItemSkeleton() {
  return (
    <div className="flex items-center justify-between rounded-brand-sm border-2 border-[#E8EEF6] dark:border-border bg-white dark:bg-surface px-4 py-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-4 w-40" />
      </div>
      <Skeleton className="h-4 w-4" />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-brand bg-white dark:bg-surface p-5 shadow-sm ring-1 ring-[#E6EEF8] dark:ring-border">
      <Skeleton className="mb-3 h-12 w-12 rounded-full" />
      <Skeleton className="mb-1 h-5 w-32" />
      <Skeleton className="h-3 w-24" />
    </div>
  );
}
