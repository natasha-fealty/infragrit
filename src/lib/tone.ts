import type { HealthTone, Severity } from "@/types";

/** Map a health tone to text color class. */
export const toneText: Record<HealthTone, string> = {
  success: "text-success",
  warning: "text-[hsl(38_92%_40%)] dark:text-warning",
  danger: "text-destructive",
  neutral: "text-foreground",
};

export const toneBg: Record<HealthTone, string> = {
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-[hsl(38_92%_40%)] dark:text-warning",
  danger: "bg-destructive/10 text-destructive",
  neutral: "bg-muted text-muted-foreground",
};

export const toneRing: Record<HealthTone, string> = {
  success: "ring-success/20",
  warning: "ring-warning/20",
  danger: "ring-destructive/20",
  neutral: "ring-border",
};

export const toneHex: Record<HealthTone, string> = {
  success: "#16A34A",
  warning: "#F59E0B",
  danger: "#EF4444",
  neutral: "#64748B",
};

export const severityBadge: Record<Severity, "danger" | "warning" | "info" | "neutral"> = {
  critical: "danger",
  high: "warning",
  medium: "info",
  low: "neutral",
};

export const severityLabel: Record<Severity, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

export function scoreTone(score: number): HealthTone {
  if (score >= 80) return "success";
  if (score >= 65) return "warning";
  return "danger";
}

/** Generic status → badge variant mapper for demo tables. */
export function statusVariant(
  status: string
): "success" | "warning" | "danger" | "info" | "neutral" {
  const s = status.toLowerCase();
  if (["completed", "closed", "delivered", "approved", "afc", "active", "connected", "on track", "resolved", "pass", "ok", "running"].some((k) => s.includes(k)))
    return "success";
  if (["at risk", "under review", "in progress", "investigating", "mitigating", "syncing", "watch", "due", "invited", "pending", "acknowledged", "idle"].some((k) => s.includes(k)))
    return "warning";
  if (["delayed", "error", "open", "critical", "fail", "overdue", "breakdown", "suspended", "disconnected", "new", "at risk"].some((k) => s.includes(k)))
    return "danger";
  return "neutral";
}
