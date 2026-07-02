import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Database,
  RefreshCw,
  Download,
  CheckCircle2,
  FileWarning,
  Wand2,
  Gauge as GaugeIcon,
  TrendingDown,
  TrendingUp,
  BarChart3,
  Activity,
  Sparkles,
  ShieldCheck,
  Bell,
  MapPin,
  Send,
} from "lucide-react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { ChartCard } from "@/components/shared/ChartCard";
import { ChartTooltip, chartColors } from "@/components/shared/ChartTooltip";
import { HealthGauge, ScoreBar } from "@/components/shared/HealthGauge";
import { AiInsightPanel } from "@/components/shared/AiInsightPanel";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge, SeverityBadge } from "@/components/shared/Badges";
import { StaggerGroup, fadeInUp } from "@/components/shared/motion";
import { KpiGridSkeleton } from "@/components/shared/Skeletons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  dataQualityKpis,
  completenessTrend,
  completenessByModule,
  validationErrors,
  missingRecords,
} from "@/mock/data";
import { useSimulatedLoad, useRefresh } from "@/hooks/useSimulatedLoad";
import { toneHex } from "@/lib/tone";
import type { LucideIcon } from "lucide-react";

const kpiIcons: Record<string, LucideIcon> = {
  comp: CheckCircle2,
  missing: FileWarning,
  unmapped: Wand2,
  aiconf: Sparkles,
};

// Derived: declining count of missing records over the last weeks (see spec).
const missingTrend = [
  { period: "W-5", Missing: 500 },
  { period: "W-4", Missing: 460 },
  { period: "W-3", Missing: 410 },
  { period: "W-2", Missing: 370 },
  { period: "W-1", Missing: 340 },
  { period: "Now", Missing: 312 },
];

function moduleColor(value: number) {
  if (value >= 95) return chartColors.green;
  if (value >= 88) return chartColors.amber;
  return chartColors.red;
}

type MissingRow = (typeof missingRecords)[number];
type ValidationRow = (typeof validationErrors)[number];

export default function DataQuality() {
  const navigate = useNavigate();
  const loading = useSimulatedLoad(600);
  const [refreshing, refresh] = useRefresh();

  const missingColumns: ColumnDef<MissingRow>[] = [
    {
      accessorKey: "module",
      header: "Module",
      cell: ({ row }) => <span className="font-medium">{row.original.module}</span>,
    },
    {
      accessorKey: "location",
      header: "Location / Source",
      cell: ({ row }) => (
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" /> {row.original.location}
        </span>
      ),
    },
    { accessorKey: "expected", header: "Expected" },
    {
      accessorKey: "lastReceived",
      header: "Last Received",
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.lastReceived}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: "action",
      header: "",
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            toast.success("Reminder sent", {
              description: `${row.original.module} · ${row.original.location} notified to submit pending data.`,
            })
          }
        >
          <Bell className="h-3.5 w-3.5" /> Send Reminder
        </Button>
      ),
    },
  ];

  const validationColumns: ColumnDef<ValidationRow>[] = [
    {
      accessorKey: "module",
      header: "Module",
      cell: ({ row }) => <span className="font-medium">{row.original.module}</span>,
    },
    {
      accessorKey: "record",
      header: "Record",
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground">{row.original.record}</span>
      ),
    },
    { accessorKey: "error", header: "Validation Error" },
    {
      accessorKey: "severity",
      header: "Severity",
      cell: ({ row }) => <SeverityBadge severity={row.original.severity} />,
    },
    {
      id: "action",
      header: "",
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            toast.success("Sent for resolution", {
              description: `${row.original.record} — routed to data steward for correction.`,
            })
          }
        >
          Resolve
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Data Quality"
        description="Completeness, freshness and validation health across every GreenSun data source."
        icon={<Database className="h-5 w-5" />}
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
                toast.success("Data quality report exported", {
                  description: "Completeness & validation summary generated as PDF.",
                })
              }
            >
              <Download />
              Export
            </Button>
          </>
        }
      />

      {/* KPI row */}
      {loading ? (
        <KpiGridSkeleton count={4} />
      ) : (
        <StaggerGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {dataQualityKpis.map((kpi) => (
            <StatCard
              key={kpi.id}
              title={kpi.title}
              value={kpi.value}
              sub={kpi.sub}
              delta={kpi.delta}
              trend={kpi.trend}
              tone={kpi.tone}
              icon={kpiIcons[kpi.id]}
            />
          ))}
        </StaggerGroup>
      )}

      {/* Gauge + Score bars, then Completeness trend */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <motion.div variants={fadeInUp} initial="hidden" animate="show">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GaugeIcon className="h-4 w-4 text-primary" />
                Overall Completeness
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex justify-center">
                <HealthGauge score={94} tone="success" size={150} label="Completeness" />
              </div>
              <Separator />
              <div className="space-y-3">
                <ScoreBar label="AI Confidence" score={88} tone="success" />
                <ScoreBar label="Data Freshness" score={92} tone="success" />
                <ScoreBar label="Sync Health" score={96} tone="success" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <ChartCard
          title="Completeness Trend"
          description="Data completeness vs freshness (%) by week"
          icon={<TrendingUp className="h-4 w-4" />}
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={completenessTrend} margin={{ left: -20, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="dq-comp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColors.primary} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={chartColors.primary} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
              <XAxis dataKey="period" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={40} domain={[70, 100]} />
              <Tooltip content={<ChartTooltip valueSuffix="%" />} />
              <Area
                type="monotone"
                dataKey="Completeness"
                stroke={chartColors.primary}
                strokeWidth={2.5}
                fill="url(#dq-comp)"
              />
              <Line
                type="monotone"
                dataKey="Freshness"
                stroke={chartColors.secondary}
                strokeWidth={2}
                strokeDasharray="5 4"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Missing data trend + completeness by module */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard
          title="Missing Records Trend"
          description="Flagged records pending entry, by week"
          icon={<TrendingDown className="h-4 w-4" />}
          actions={
            <Badge variant="success" className="gap-1">
              <TrendingDown className="h-3 w-3" /> 38% since W-5
            </Badge>
          }
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={missingTrend} margin={{ left: -20, right: 8, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
              <XAxis dataKey="period" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={40} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(148,163,184,0.08)" }} />
              <Bar dataKey="Missing" fill={chartColors.amber} radius={[6, 6, 0, 0]} maxBarSize={44} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Completeness by Module"
          description="Coverage across integrated modules (%)"
          icon={<BarChart3 className="h-4 w-4" />}
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={completenessByModule}
              layout="vertical"
              margin={{ left: 20, right: 24, top: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tickLine={false} axisLine={false} />
              <YAxis
                type="category"
                dataKey="module"
                tickLine={false}
                axisLine={false}
                width={80}
              />
              <Tooltip content={<ChartTooltip valueSuffix="%" />} cursor={{ fill: "rgba(148,163,184,0.08)" }} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={26}>
                {completenessByModule.map((m) => (
                  <Cell key={m.module} fill={moduleColor(m.value)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Missing records table */}
      <motion.div variants={fadeInUp} initial="hidden" animate="show">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2">
              <FileWarning className="h-4 w-4 text-warning" />
              Missing Records
            </CardTitle>
            <Button
              variant="soft"
              size="sm"
              onClick={() =>
                toast.success("Reminders dispatched", {
                  description: "All overdue sources notified to submit pending data.",
                })
              }
            >
              <Send className="h-3.5 w-3.5" /> Remind All
            </Button>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={missingColumns}
              data={missingRecords}
              searchKey="module"
              searchPlaceholder="Search modules…"
              pageSize={8}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Validation errors table */}
      <motion.div variants={fadeInUp} initial="hidden" animate="show">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Validation Errors
            </CardTitle>
            <Badge variant="warning" className="gap-1">
              <Activity className="h-3 w-3" /> {validationErrors.length} flagged
            </Badge>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={validationColumns}
              data={validationErrors}
              searchKey="module"
              searchPlaceholder="Search errors…"
              pageSize={8}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* AI insight */}
      <AiInsightPanel
        confidence={88}
        sections={[
          {
            icon: CheckCircle2,
            label: "Data Health",
            body: (
              <>
                Overall data completeness is at{" "}
                <span className="font-semibold text-success">94% (+2% WoW)</span> and rising, keeping
                prediction reliability <span className="font-semibold">high</span> across schedule,
                cost and procurement models.
              </>
            ),
          },
          {
            icon: Wand2,
            label: "Harmonization Engine",
            body: (
              <>
                <span className="font-semibold">18 unmapped fields</span> are being auto-harmonized.
                The Data Harmonization Engine is mapping variants like{" "}
                <span className="font-mono text-xs">Solar Module / PV Module / Module Erection</span>{" "}
                →{" "}
                <span className="font-mono text-xs font-semibold text-primary">
                  SOLAR MODULE PACKAGE
                </span>
                .
              </>
            ),
          },
          {
            icon: TrendingUp,
            label: "Recommendation",
            body: (
              <>
                Chase the <span className="font-semibold">312 missing records</span> (down 40) from
                Block D progress and Volt Electricals labour to push completeness past the 95%
                confidence threshold.
              </>
            ),
          },
        ]}
        actions={
          <>
            <Button
              variant="gradient"
              size="sm"
              onClick={() =>
                toast.success("Harmonization run queued", {
                  description: "18 unmapped fields sent to the Data Harmonization Engine.",
                })
              }
            >
              <Wand2 className="h-4 w-4" /> Auto-Harmonize
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate("/integration")}>
              Open Integration Hub
            </Button>
          </>
        }
      />
    </div>
  );
}
