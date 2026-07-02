import { Sparkles, Lightbulb, TrendingUp, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { fadeInUp } from "./motion";

interface Section {
  icon?: LucideIcon;
  label: string;
  body: ReactNode;
}

interface Props {
  title?: string;
  confidence?: number;
  sections: Section[];
  actions?: ReactNode;
  className?: string;
}

export function AiInsightPanel({
  title = "AI Insights",
  confidence,
  sections,
  actions,
  className,
}: Props) {
  return (
    <motion.div
      variants={fadeInUp}
      className={cn(
        "relative overflow-hidden rounded-xl border border-accent/20 bg-gradient-to-br from-accent/[0.06] via-primary/[0.04] to-transparent p-5 shadow-card",
        className
      )}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent/10 blur-3xl" />
      <div className="relative">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand text-white shadow-soft">
              <Sparkles className="h-4 w-4" />
            </div>
            <h3 className="font-display text-base font-semibold">{title}</h3>
          </div>
          {confidence != null && (
            <Badge variant="accent" className="gap-1">
              <TrendingUp className="h-3 w-3" />
              {confidence}% confidence
            </Badge>
          )}
        </div>

        <div className="space-y-4">
          {sections.map((s, i) => {
            const Icon = s.icon ?? Lightbulb;
            return (
              <div key={i} className="flex gap-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {s.label}
                  </p>
                  <div className="mt-0.5 text-sm leading-relaxed text-foreground">{s.body}</div>
                </div>
              </div>
            );
          })}
        </div>

        {actions && <div className="mt-5 flex flex-wrap gap-2">{actions}</div>}
      </div>
    </motion.div>
  );
}
