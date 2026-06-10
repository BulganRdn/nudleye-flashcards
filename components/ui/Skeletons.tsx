import { cn } from "@/lib/cn";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton-pulse rounded-lg bg-[#e9eaf0]", className)} aria-hidden="true" />;
}

export function DeckCardSkeleton() {
  return (
    <div className="flex min-h-[252px] flex-col overflow-hidden rounded-[18px] border border-[#dfe2e8] bg-white">
      <div className="flex flex-1 flex-col p-5">
        <div className="flex justify-between">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-14" />
        </div>
        <Skeleton className="mt-6 h-6 w-2/3" />
        <Skeleton className="mt-3 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-4/5" />
        <div className="mt-auto pt-6">
          <div className="flex justify-between">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-8" />
          </div>
          <Skeleton className="mt-2 h-1 w-full rounded-full" />
        </div>
      </div>
      <div className="border-t border-[#e8e9ed] px-5 py-4">
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}

export function CollectionSkeleton() {
  return (
    <div className="app-shell app-content">
      <main className="page-canvas">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-3 h-10 w-64" />
        <Skeleton className="mt-3 h-4 w-96 max-w-full" />
        <Skeleton className="mt-8 h-12 w-full" />
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => <DeckCardSkeleton key={index} />)}
        </div>
      </main>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="app-shell app-content">
      <main className="page-canvas">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="mt-3 h-10 w-72" />
        <div className="mt-8 grid gap-4 lg:grid-cols-[1.4fr_.6fr]">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => <DeckCardSkeleton key={index} />)}
        </div>
      </main>
    </div>
  );
}

export function StudySkeleton() {
  return (
    <div className="app-shell app-content">
      <main className="page-canvas max-w-4xl">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="mt-6 h-8 w-64" />
        <Skeleton className="mt-3 h-4 w-80 max-w-full" />
        <Skeleton className="mt-8 h-[380px] w-full rounded-2xl" />
      </main>
    </div>
  );
}
