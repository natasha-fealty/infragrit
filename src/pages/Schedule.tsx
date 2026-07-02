import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Area,
  AreaChart,
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CalendarClock,
  RefreshCw,
  Download,
  TrendingUp,
  Gauge,
  GitBranch,
  Filter,
  Flag,
  ZoomIn,
  ZoomOut,
  Waypoints,
  Search,
  Target,
  Lightbulb,
  PlayCircle,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import type { ColumnDef } from "@tanstack/react-table";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { ChartCard } from "@/components/shared/ChartCard";
import { ChartTooltip, chartColors } from "@/components/shared/ChartTooltip";
import { AiInsightPanel } from "@/components/shared/AiInsightPanel";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/Badges";
import { StaggerGroup, fadeInUp } from "@/components/shared/motion";
import { KpiGridSkeleton } from "@/components/shared/Skeletons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  scheduleKpis,
  scheduleSCurve,
  delayPareto,
  milestones,
  ganttTasks,
  aiScheduleInsight,
} from "@/mock/data";
import { useSimulatedLoad, useRefresh } from "@/hooks/useSimulatedLoad";
import { formatDate } from "@/lib/utils";
import { toneHex } from "@/lib/tone";
import type { Milestone } from "@/types";

const kpiIcons = [Gauge, CalendarClock, Target, TrendingUp, Waypoints];

/* Filter definitions — visual only, wired to a toast on change */
const filters: { label: string; placeholder: string; options: string[] }[] = [
  { label: "Date range", placeholder: "This project", options: ["This project", "Last 30 days", "Last 90 days", "Current quarter"] },
  { label: "Package", placeholder: "All packages", options: ["All packages", "Piling", "Structures", "Modules", "Cabling", "Power", "T&C"] },
  { label: "Contractor", placeholder: "All contractors", options: ["All contractors", "Rajputana Constructions", "Marwar Structures", "Desert Solar Labour Co", "Volt Electricals"] },
  { label: "WBS", placeholder: "All WBS", options: ["All WBS", "1 — Enabling", "2 — Piling", "3 — Structures", "4 — Modules", "5 — Cabling"] },
  { label: "Location", placeholder: "All blocks", options: ["All blocks", "Block A", "Block B", "Block C", "Block D", "Zone 4"] },
];

export default function Schedule() {
  const loading = useSimulatedLoad(600);
  const [refreshing, refresh] = useRefresh();
  const [zoom, setZoom] = useState(1);
  const [criticalOnly, setCriticalOnly] = useState(false);

  const maxDay = useMemo(
    () => Math.max(...ganttTasks.map((t) => t.start + t.duration)),
    []
  );
  const visibleTasks = useMemo(
    () => (criticalOnly ? ganttTasks.filter((t) => t.critical) : ganttTasks),
    [criticalOnly]
  );

  const milestoneColumns: ColumnDef<Milestone>[] = [
    {
      accessorKey: "name",
      header: "Milestone",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Flag className="h-3.5 w-3.5 text-primary" />
          <span className="font-medium">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: "planned",
      header: "Planned",
      cell: ({ row }) => (
        <span className="text-muted-foreground">{formatDate(row.original.planned)}</span>
      ),
    },
    {
      accessorKey: "forecast",
      header: "Forecast",
      cell: ({ row }) => <span>{formatDate(row.original.forecast)}</span>,
    },
    {
      accessorKey: "varianceDays",
      header: "Variance",
      cell: ({ row }) => {
        const v = row.original.varianceDays;
        return (
          <span
            className="font-semibold"
            style={{ color: v < 0 ? toneHex.danger : v > 0 ? toneHex.success : undefined }}
          >
            {v === 0 ? "On plan" : `${v > 0 ? "+" : ""}${v} days`}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "progress",
      header: "Progress",
      cell: ({ row }) => {
        const p = row.original.progress;
        return (
          <div className="flex w-32 items-center gap-2">
            <Progress
              value={p}
              tone={p >= 100 ? "success" : p >= 50 ? "primary" : "warning"}
              className="h-1.5"
            />
            <span className="w-9 shrink-0 text-right text-xs font-medium tabular-nums">{p}%</span>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Schedule Intelligence"
        description="Critical-path, milestone and delay analytics for GreenSun Solar Park."
        icon={<CalendarClock className="h-5 w-5" />}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={refresh}>
              <RefreshCw className={refreshing ? "animate-spin" : ""} />
              {refreshing ? "Refreshing" : "Refresh"}
            </Button>
            <Button
              variant="gradient"
              size="sm"
              onClick={() =>
                toast.success("Schedule report exported", {
                  description: "Critical path & milestone pack generated (PDF).",
                })
              }
            >
              <Download />
              Export
            </Button>
          </>
        }
      />

      {/* Filters row */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="show"
        className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-3 shadow-card"
      >
        <span className="mr-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Filter className="h-3.5 w-3.5" /> Filters
        </span>
        {filters.map((f) => (
          <Select
            key={f.label}
            onValueChange={(v) =>
              toast.success("Filter applied", { description: `${f.label}: ${v}` })
            }
          >
            <SelectTrigger className="h-9 w-[9.5rem]">
              <SelectValue placeholder={f.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {f.options.map((o) => (
                <SelectItem key={o} value={o}>
                  {o}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
      </motion.div>

      {/* KPI cards */}
      {loading ? (
        <KpiGridSkeleton count={5} />
      ) : (
        <StaggerGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {scheduleKpis.map((kpi, i) => (
            <StatCard
              key={kpi.id}
              title={kpi.title}
              value={kpi.value}
              sub={kpi.sub}
              delta={kpi.delta}
              trend={kpi.trend}
              tone={kpi.tone}
              icon={kpiIcons[i]}
            />
          ))}
        </StaggerGroup>
      )}

      {/* S-Curve + Delay Pareto */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard
          title="Progress S-Curve"
          description="Planned vs Actual vs Forecast (%)"
          icon={<TrendingUp className="h-4 w-4" />}
        >
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={scheduleSCurve} margin={{ left: -20, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="sc-planned" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColors.primary} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={chartColors.primary} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
              <XAxis dataKey="period" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={40} />
              <Tooltip content={<ChartTooltip valueSuffix="%" />} />
              <Area type="monotone" dataKey="Planned" stroke={chartColors.primary} strokeWidth={2} fill="url(#sc-planned)" />
              <Line type="monotone" dataKey="Actual" stroke={chartColors.secondary} strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="Forecast" stroke={chartColors.accent} strokeWidth={2} strokeDasharray="5 4" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Delay Contributors"
          description="Pareto of critical-path delay by cause (days)"
          icon={<Waypoints className="h-4 w-4" />}
        >
          <ResponsiveContainer width="100%" height={260}>
            <ComposedChart data={delayPareto} margin={{ left: -20, right: 8, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
              <XAxis dataKey="cause" tickLine={false} axisLine={false} interval={0} tick={{ fontSize: 10 }} angle={-12} textAnchor="end" height={54} />
              <YAxis yAxisId="left" tickLine={false} axisLine={false} width={32} />
              <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} width={40} domain={[0, 100]} unit="%" />
              <Tooltip content={<ChartTooltip valueSuffix="" />} />
              <Bar yAxisId="left" dataKey="days" name="Delay days" fill={chartColors.primary} radius={[4, 4, 0, 0]} maxBarSize={38} />
              <Line yAxisId="right" type="monotone" dataKey="cum" name="Cumulative %" stroke={chartColors.amber} strokeWidth={2.5} dot={{ r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Critical Path Viewer — interactive Gantt */}
      <ChartCard
        title="Critical Path Viewer"
        description="Interactive Gantt across the project WBS (day offsets)"
        icon={<GitBranch className="h-4 w-4" />}
        actions={
          <div className="flex items-center gap-1.5">
            <Button
              variant={criticalOnly ? "gradient" : "outline"}
              size="sm"
              onClick={() => setCriticalOnly((v) => !v)}
            >
              <Waypoints className="h-4 w-4" />
              Critical only
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setZoom((z) => Math.max(0.75, +(z - 0.25).toFixed(2)))}
              disabled={zoom <= 0.75}
              aria-label="Zoom out"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="w-10 text-center text-xs font-medium tabular-nums text-muted-foreground">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setZoom((z) => Math.min(2, +(z + 0.25).toFixed(2)))}
              disabled={zoom >= 2}
              aria-label="Zoom in"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        }
      >
        {/* Legend */}
        <div className="mb-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-3.5 rounded-sm" style={{ background: chartColors.red }} />
            Critical path
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-3.5 rounded-sm" style={{ background: chartColors.primary }} />
            Normal
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-3.5 rounded-sm bg-foreground/70" />
            Progress
          </span>
          <span className="ml-auto flex items-center gap-1.5">
            <Search className="h-3.5 w-3.5" />
            {visibleTasks.length} of {ganttTasks.length} activities · timeline {maxDay} days
          </span>
        </div>

        <div className="overflow-x-auto pb-1">
          <div style={{ width: `${zoom * 100}%`, minWidth: 640 }} className="space-y-2">
            {visibleTasks.map((t, i) => {
              const base = t.critical ? chartColors.red : chartColors.primary;
              return (
                <div key={t.id} className="flex items-center gap-3">
                  <div className="w-52 shrink-0">
                    <div className="flex items-center gap-1.5">
                      <Badge variant="outline" className="h-5 px-1.5 text-[10px] tabular-nums">
                        {t.wbs}
                      </Badge>
                      <span className="truncate text-sm font-medium">{t.name}</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground">{t.package}</span>
                  </div>
                  <div className="relative h-8 flex-1 rounded-md bg-muted/40">
                    <motion.div
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{ scaleX: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                      style={{
                        position: "absolute",
                        top: 4,
                        bottom: 4,
                        left: `${(t.start / maxDay) * 100}%`,
                        width: `${(t.duration / maxDay) * 100}%`,
                        transformOrigin: "left",
                        background: `${base}33`,
                        border: `1px solid ${base}`,
                      }}
                      className="group flex items-center overflow-hidden rounded"
                      title={`${t.name} · ${t.progress}% · ${t.duration}d`}
                    >
                      <div
                        className="h-full"
                        style={{ width: `${t.progress}%`, background: base }}
                      />
                      <span className="pointer-events-none absolute right-1.5 text-[10px] font-semibold text-foreground/80">
                        {t.progress}%
                      </span>
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </ChartCard>

      {/* Milestone Tracker */}
      <ChartCard
        title="Milestone Tracker"
        description="Baseline vs forecast dates and delivery status"
        icon={<Flag className="h-4 w-4" />}
      >
        <DataTable
          columns={milestoneColumns}
          data={milestones}
          searchKey="name"
          searchPlaceholder="Search milestones…"
          pageSize={8}
        />
      </ChartCard>

      {/* AI Schedule Insights */}
      <AiInsightPanel
        title="AI Schedule Insights"
        confidence={88}
        sections={[
          {
            icon: Target,
            label: "Root Cause",
            body: aiScheduleInsight.rootCause,
          },
          {
            icon: TrendingUp,
            label: "Prediction",
            body: aiScheduleInsight.prediction,
          },
          {
            icon: Lightbulb,
            label: "Recommended Actions",
            body: (
              <ul className="space-y-1.5">
                {aiScheduleInsight.actions.map((a, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            ),
          },
        ]}
        actions={
          <>
            <Button
              variant="gradient"
              size="sm"
              onClick={() =>
                toast.success("Recovery plan generated", {
                  description: "3 levers modelled — up to 6 days recoverable.",
                })
              }
            >
              <PlayCircle className="h-4 w-4" />
              Simulate recovery
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                toast.success("Actions routed", {
                  description: "Recommended actions sent to owners for execution.",
                })
              }
            >
              Assign actions
              <ArrowRight className="h-4 w-4" />
            </Button>
          </>
        }
      />
    </div>
  );
}
