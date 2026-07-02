import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions?: ReactNode;
}

export function SectionTitle({ title, description, icon: Icon, actions }: Props) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        {Icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <div>
          <h2 className="font-display text-lg font-semibold tracking-tight">{title}</h2>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
