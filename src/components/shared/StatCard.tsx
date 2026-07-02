import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Minus, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Sparkline } from "./Sparkline";
import { cn } from "@/lib/utils";
import { toneBg, toneHex } from "@/lib/tone";
import type { HealthTone, Trend } from "@/types";
import { fadeInUp } from "./motion";

export interface StatCardProps {
  title: string;
  value: string;
  sub?: string;
  delta?: string;
  metric?: string;
  trend?: Trend;
  tone?: HealthTone;
  icon?: LucideIcon;
  spark?: number[];
  onClick?: () => void;
  className?: string;
}

const trendIcon = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  flat: Minus,
};

export function StatCard({
  title,
  value,
  sub,
  delta,
  metric,
  trend,
  tone = "neutral",
  icon: Icon,
  spark,
  onClick,
  className,
}: StatCardProps) {
  const TrendIcon = trend ? trendIcon[trend] : null;
  const trendColor =
    trend === "up" ? "text-success" : trend === "down" ? "text-destructive" : "text-muted-foreground";

  return (
    <motion.div variants={fadeInUp}>
      <Card
        onClick={onClick}
        className={cn(
          "group relative overflow-hidden p-5 card-hover",
          onClick && "cursor-pointer",
          className
        )}
      >
        {/* accent glow */}
        <div
          className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-[0.07] blur-2xl transition-opacity group-hover:opacity-20"
          style={{ background: toneHex[tone] }}
        />
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-muted-foreground">{title}</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-display text-2xl font-bold tracking-tight">{value}</span>
            </div>
            {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
          </div>
          {Icon && (
            <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", toneBg[tone])}>
              <Icon className="h-5 w-5" />
            </div>
          )}
        </div>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div className="space-y-1">
            {delta && (
              <div className={cn("flex items-center gap-1 text-xs font-semibold", trendColor)}>
                {TrendIcon && <TrendIcon className="h-3.5 w-3.5" />}
                <span>{delta}</span>
              </div>
            )}
            {metric && <p className="text-xs text-muted-foreground">{metric}</p>}
          </div>
          {spark && spark.length > 1 && (
            <Sparkline
              data={spark}
              color={toneHex[tone === "neutral" ? "neutral" : tone]}
              width={84}
              height={34}
            />
          )}
        </div>
      </Card>
    </motion.div>
  );
}
