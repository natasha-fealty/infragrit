import { cn } from "@/lib/utils";

export function Logo({ collapsed, className }: { collapsed?: boolean; className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-brand shadow-glow">
        <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
          <path
            d="M9 22V10M16 22V14M23 22V17"
            stroke="white"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <circle cx="9" cy="10" r="1.8" fill="white" />
          <circle cx="16" cy="14" r="1.8" fill="white" />
          <circle cx="23" cy="17" r="1.8" fill="white" />
        </svg>
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
