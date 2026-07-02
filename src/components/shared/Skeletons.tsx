import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function StatCardSkeleton() {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-7 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-10 w-10 rounded-xl" />
      </div>
      <Skeleton className="mt-4 h-8 w-full" />
    </Card>
  );
}

export function ChartSkeleton({ height = 280 }: { height?: number }) {
  return (
    <Card className="p-5">
      <Skeleton className="mb-4 h-4 w-40" />
      <Skeleton className="w-full rounded-lg" style={{ height }} />
    </Card>
  );
}

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <Card className="p-5">
      <Skeleton className="mb-4 h-9 w-64" />
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-4 w-1/5" />
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-4 w-1/5" />
            <Skeleton className="h-4 w-1/5" />
          </div>
        ))}
      </div>
    </Card>
  );
}

export function KpiGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** Wraps content with a brief skeleton flash to simulate loading in the demo. */
export function useSimulatedLoading(ms = 550) {
  return ms;
}
