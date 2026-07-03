import { cn } from "@/lib/utils";

export function Logo({ collapsed, className }: { collapsed?: boolean; className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-glow ring-1 ring-white/20">
        <img
          src="/process-grit.jpg"
          alt="ProcessGrit"
          className="h-full w-full object-contain p-1"
        />
      </div>
      {!collapsed && (
        <div className="leading-tight">
          <p className="font-display text-[15px] font-extrabold tracking-tight text-white">
            InfraGrit
          </p>
          <p className="text-[10px] font-medium uppercase tracking-wider text-white/50">
            EPC Intelligence
          </p>
        </div>
      )}
    </div>
  );
}
