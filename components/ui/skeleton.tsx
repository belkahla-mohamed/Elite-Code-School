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

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-brand border-2 border-border bg-white dark:bg-surface">
      <div className="border-b-2 border-border bg-surface px-5 py-3">
        <Skeleton className="h-4 w-32" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 border-b border-border px-5 py-4">
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-16 hidden md:block" />
          <Skeleton className="h-4 w-24 hidden lg:block" />
          <Skeleton className="h-4 w-24 hidden lg:block" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full rounded-brand" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full rounded-brand" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-24 w-full rounded-brand" />
      </div>
      <Skeleton className="h-10 w-32 rounded-full" />
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-40" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
