import { KpiGridSkeleton, ChartSkeleton } from "@/components/shared/Skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export function RouteFallback() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-9 w-40" />
      </div>
      <KpiGridSkeleton count={4} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    </div>
  );
}
