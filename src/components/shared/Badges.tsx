import { Badge } from "@/components/ui/badge";
import { severityBadge, severityLabel, statusVariant } from "@/lib/tone";
import type { Severity } from "@/types";
import { cn } from "@/lib/utils";

export function SeverityBadge({ severity, className }: { severity: Severity; className?: string }) {
  return (
    <Badge variant={severityBadge[severity]} className={cn("capitalize", className)}>
      <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-current" />
      {severityLabel[severity]}
    </Badge>
  );
}

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <Badge variant={statusVariant(status)} className={className}>
      {status}
    </Badge>
  );
}

export function DotStatus({ status, label }: { status: string; label?: string }) {
  const variant = statusVariant(status);
  const color =
    variant === "success"
      ? "bg-success"
      : variant === "warning"
      ? "bg-warning"
      : variant === "danger"
      ? "bg-destructive"
      : "bg-muted-foreground";
  return (
    <span className="inline-flex items-center gap-2 text-sm">
      <span className={cn("h-2 w-2 rounded-full", color, variant === "warning" && "animate-pulse")} />
      {label ?? status}
    </span>
  );
}
