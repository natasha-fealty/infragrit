import { motion } from "framer-motion";
import { toneHex } from "@/lib/tone";
import type { HealthTone } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  score: number;
  label?: string;
  tone?: HealthTone;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showLabel?: boolean;
}

export function HealthGauge({
  score,
  label,
  tone = "neutral",
  size = 140,
  strokeWidth = 12,
  className,
  showLabel = true,
}: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // 270° arc (gauge style)
  const arc = 0.75;
  const dash = circumference * arc;
  const offset = dash * (1 - score / 100);
  const color = toneHex[tone];

  return (
    <div className={cn("relative inline-flex flex-col items-center", className)}>
      <svg width={size} height={size} className="-rotate-[135deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          strokeDasharray={`${dash} ${circumference}`}
          strokeLinecap="round"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          initial={{ strokeDashoffset: dash }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-3xl font-bold tracking-tight" style={{ color }}>
          {score}
        </span>
        {showLabel && (
          <span className="text-xs font-medium text-muted-foreground">
            {label ?? "Health"}
          </span>
        )}
      </div>
    </div>
  );
}

/** Compact horizontal score bar used in health lists. */
export function ScoreBar({
  label,
  score,
  tone,
}: {
  label: string;
  score: number;
  tone: HealthTone;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span className="font-semibold" style={{ color: toneHex[tone] }}>
          {score}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full rounded-full"
          style={{ background: toneHex[tone] }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}
