import type { TooltipProps } from "recharts";

export function ChartTooltip({
  active,
  payload,
  label,
  valueSuffix = "",
  valuePrefix = "",
}: TooltipProps<number, string> & { valueSuffix?: string; valuePrefix?: string }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-xl border border-border bg-popover/95 px-3 py-2 shadow-elevated backdrop-blur">
      {label != null && (
        <p className="mb-1 text-xs font-semibold text-foreground">{label}</p>
      )}
      <div className="space-y-1">
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: entry.color || entry.stroke || entry.fill }}
            />
            <span className="text-muted-foreground">{entry.name}</span>
            <span className="ml-auto font-semibold text-foreground">
              {valuePrefix}
              {typeof entry.value === "number"
                ? entry.value.toLocaleString("en-IN")
                : entry.value}
              {valueSuffix}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export const chartColors = {
  grid: "hsl(var(--border))",
  axis: "hsl(var(--muted-foreground))",
  primary: "#2563EB",
  secondary: "#14B8A6",
  accent: "#7C3AED",
  cyan: "#06B6D4",
  amber: "#F59E0B",
  red: "#EF4444",
  green: "#16A34A",
  pink: "#EC4899",
  indigo: "#6366F1",
};

export const chartPalette = [
  "#2563EB",
  "#14B8A6",
  "#7C3AED",
  "#06B6D4",
  "#F59E0B",
  "#EC4899",
  "#16A34A",
  "#6366F1",
];
