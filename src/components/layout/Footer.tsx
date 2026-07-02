import { Activity, RefreshCw, ShieldCheck } from "lucide-react";
import { project } from "@/mock/project";

export function Footer() {
  return (
    <footer className="flex flex-col items-start justify-between gap-2 border-t border-border bg-card/50 px-6 py-3 text-xs text-muted-foreground sm:flex-row sm:items-center">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
        <span className="font-medium">InfraGrit {project.version}</span>
        <span className="flex items-center gap-1.5">
          <RefreshCw className="h-3 w-3" />
          Data refreshed {project.lastRefreshed}
        </span>
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="h-3 w-3 text-success" />
          Integration health {project.integrationHealth}%
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5">
          <Activity className="h-3 w-3 text-primary" />
          Environment:{" "}
          <span className="rounded bg-primary/10 px-1.5 py-0.5 font-medium text-primary">
            {project.environment}
          </span>
        </span>
        <span>© 2026 ProcessGrit</span>
      </div>
    </footer>
  );
}
