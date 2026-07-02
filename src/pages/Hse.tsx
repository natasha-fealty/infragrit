import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  HardHat,
  RefreshCw,
  Download,
  AlertTriangle,
  Eye,
  ShieldAlert,
  Award,
  Activity,
  TrendingDown,
  Map as MapIcon,
  Flame,
  ClipboardList,
  Plus,
  ClipboardCheck,
  ShieldCheck,
  Sparkles,
  Wrench,
  HeartPulse,
} from "lucide-react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { ChartCard } from "@/components/shared/ChartCard";
import { ChartTooltip, chartColors } from "@/components/shared/ChartTooltip";
import { DataTable } from "@/components/shared/DataTable";
import { SeverityBadge, StatusBadge } from "@/components/shared/Badges";
import { StaggerGroup, fadeInUp } from "@/components/shared/motion";
import { KpiGridSkeleton } from "@/components/shared/Skeletons";
import { AiInsightPanel } from "@/components/shared/AiInsightPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  hseKpis,
  incidentTrend,
  severityTrend,
  siteRiskHeatmap,
  incidentRegister,
  correctiveActions,
} from "@/mock/data";
import { useSimulatedLoad, useRefresh } from "@/hooks/useSimulatedLoad";
import { formatDate } from "@/lib/utils";
import type { IncidentRow } from "@/types";

const kpiIcons = [AlertTriangle, Eye, ShieldAlert, Award];
const kpiRoutes = ["/hse", "/hse", "/hse", "/hse"];

type CorrectiveAction = (typeof correctiveActions)[number];

/* Site-risk heat scale — 1 (low) → 4 (critical). */
const heat = [
  { hex: "#16A34A", label: "Low" },
  { hex: "#EAB308", label: "Moderate" },
  { hex: "#F97316", label: "High" },
  { hex: "#DC2626", label: "Critical" },
] as const;
const heatFor = (value: number) => heat[Math.min(Math.max(value, 1), 4) - 1];

/* Permit-to-work register (static). */
const permitRegister = [
  { id: "p1", permit: "Hot Work — Welding", location: "MMS Assembly", validTill: "2026-07-03", status: "Active" },
  { id: "p2", permit: "Working at Height", location: "Inverter Yard", validTill: "2026-07-04", status: "Active" },
  { id: "p3", permit: "Excavation", location: "Cable Trench", validTill: "2026-07-02", status: "Expiring" },
  { id: "p4", permit: "Electrical LOTO", location: "Substation", validTill: "2026-07-05", status: "Active" },
];

const incidentColumns: ColumnDef<IncidentRow>[] = [
  {
    accessorKey: "refNo",
    header: "Ref No.",
    cell: ({ row }) => <span className="font-medium">{row.original.refNo}</span>,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <Badge variant="neutral" className="text-[11px]">
        {row.original.type}
      </Badge>
    ),
  },
  { accessorKey: "location", header: "Location" },
  {
    accessorKey: "severity",
    header: "Severity",
    cell: ({ row }) => <SeverityBadge severity={row.original.severity} />,
  },
  {
    accessorKey: "reportedBy",
    header: "Reported By",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.reportedBy}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => (
      <span className="text-muted-foreground tabular-nums">{formatDate(row.original.date)}</span>
    ),
  },
];

const actionColumns: ColumnDef<CorrectiveAction>[] = [
  {
    accessorKey: "action",
    header: "Corrective Action",
    cell: ({ row }) => (
      <span className="block max-w-[280px] font-medium leading-snug">{row.original.action}</span>
    ),
  },
  {
    accessorKey: "ref",
    header: "Ref",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.ref}</span>,
  },
  { accessorKey: "owner", header: "Owner" },
  {
    accessorKey: "due",
    header: "Due",
    cell: ({ row }) => (
      <span className="text-muted-foreground tabular-nums">{formatDate(row.original.due)}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
];

export default function Hse() {
  const navigate = useNavigate();
  const loading = useSimulatedLoad(600);
  const [refreshing, refresh] = useRefresh();

  // Report-observation dialog state
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("Near Miss");
  const [location, setLocation] = useState("");
  const [severity, setSeverity] = useState("low");
  const [description, setDescription] = useState("");

  function submitObservation() {
    setOpen(false);
    toast.success("HSE observation logged", {
      description: `${type} at ${location || "site"} — routed to HSE team for review.`,
    });
    setType("Near Miss");
    setLocation("");
    setSeverity("low");
    setDescription("");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="HSE Intelligence"
        description="Safety performance, incident analytics and site-risk intelligence for GreenSun Solar Park."
        icon={<HardHat className="h-5 w-5" />}
        breadcrumbs={[{ label: "Command Centre", to: "/command-centre" }, { label: "HSE" }]}
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
                toast.success("HSE report exported", {
                  description: "Incident register, corrective actions & safety analytics (PDF).",
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
          {hseKpis.map((kpi, i) => (
            <StatCard
              key={kpi.id}
              title={kpi.title}
              value={kpi.value}
              sub={kpi.sub}
              delta={kpi.delta}
              trend={kpi.trend}
              tone={kpi.tone}
              icon={kpiIcons[i]}
              onClick={() => navigate(kpiRoutes[i])}
            />
          ))}
        </StaggerGroup>
      )}

      {/* Incident + Severity trends */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard
          title="Incident Trend"
          description="Incidents, near misses & unsafe acts by month"
          icon={<Activity className="h-4 w-4" />}
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={incidentTrend} margin={{ left: -20, right: 8, top: 8 }} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
              <XAxis dataKey="period" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={40} />
              <Tooltip cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }} content={<ChartTooltip />} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="Incidents" fill={chartColors.red} radius={[4, 4, 0, 0]} barSize={14} />
              <Bar dataKey="NearMiss" fill={chartColors.amber} radius={[4, 4, 0, 0]} barSize={14} />
              <Bar dataKey="Unsafe" fill={chartColors.primary} radius={[4, 4, 0, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Severity Index Trend"
          description="Weighted incident severity — lower is better"
          icon={<TrendingDown className="h-4 w-4" />}
          actions={
            <Badge variant="success" className="gap-1">
              <TrendingDown className="h-3 w-3" /> Improving
            </Badge>
          }
        >
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={severityTrend} margin={{ left: -20, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="hse-sev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColors.green} stopOpacity={0.28} />
                  <stop offset="100%" stopColor={chartColors.green} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
              <XAxis dataKey="period" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={40} domain={[0, 3]} />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="Index"
                stroke={chartColors.green}
                strokeWidth={2.5}
                fill="url(#hse-sev)"
              />
            </AreaChart>
          </ResponsiveContainer>
          <p className="mt-2 text-xs text-muted-foreground">
            Severity index down to <span className="font-semibold text-success">1.4</span> from 2.1 in Mar —
            a 33% improvement.
          </p>
        </ChartCard>
      </div>

      {/* Unsafe observations + Site risk heatmap */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard
          title="Unsafe Observation Trend"
          description="Unsafe acts logged per month"
          icon={<ShieldAlert className="h-4 w-4" />}
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={incidentTrend} margin={{ left: -20, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="hse-unsafe" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColors.accent} stopOpacity={0.95} />
                  <stop offset="100%" stopColor={chartColors.accent} stopOpacity={0.55} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
              <XAxis dataKey="period" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={40} />
              <Tooltip cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }} content={<ChartTooltip />} />
              <Bar dataKey="Unsafe" fill="url(#hse-unsafe)" radius={[6, 6, 0, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Site Risk Heatmap"
          description="Live risk rating across work zones"
          icon={<MapIcon className="h-4 w-4" />}
          actions={
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-muted-foreground">Low</span>
              <div className="flex overflow-hidden rounded-full">
                {heat.map((h) => (
                  <span key={h.label} className="h-2 w-5" style={{ background: h.hex }} />
                ))}
              </div>
              <span className="text-[11px] text-muted-foreground">High</span>
            </div>
          }
        >
          <StaggerGroup className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {siteRiskHeatmap.map((z) => {
              const level = heatFor(z.value);
              return (
                <motion.div
                  key={z.zone}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.04, y: -2 }}
                  transition={{ type: "spring", stiffness: 320, damping: 20 }}
                  className="group relative cursor-default overflow-hidden rounded-xl border p-3"
                  style={{ borderColor: `${level.hex}55`, background: `${level.hex}18` }}
                >
                  <div className="flex items-start justify-between gap-1">
                    <p className="text-xs font-semibold leading-snug">{z.zone}</p>
                    <span
                      className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ background: level.hex }}
                    />
                  </div>
                  <p className="mt-2 font-display text-lg font-bold" style={{ color: level.hex }}>
                    {level.label}
                  </p>
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                    style={{ background: level.hex }}
                  />
                </motion.div>
              );
            })}
          </StaggerGroup>
        </ChartCard>
      </div>

      {/* Incident Register */}
      <motion.div variants={fadeInUp} initial="hidden" animate="show">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-primary" />
              Incident Register
            </CardTitle>
            <Button variant="gradient" size="sm" onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4" /> Report Observation
            </Button>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={incidentColumns}
              data={incidentRegister}
              searchKey="location"
              searchPlaceholder="Search ref, type or location…"
              pageSize={8}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Corrective Actions + Permits */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <motion.div variants={fadeInUp} initial="hidden" animate="show">
          <Card className="h-full">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="h-4 w-4 text-primary" />
                Corrective Actions
              </CardTitle>
              <Badge variant="warning">{correctiveActions.filter((a) => a.status !== "Closed").length} open</Badge>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={actionColumns}
                data={correctiveActions}
                searchKey="action"
                searchPlaceholder="Search actions…"
                pageSize={6}
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp} initial="hidden" animate="show">
          <Card className="h-full">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-primary" />
                Permit-to-Work Register
              </CardTitle>
              <Badge variant="neutral">{permitRegister.length} active</Badge>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {permitRegister.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border p-3 transition-colors hover:bg-muted/40"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                      <Flame className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{p.permit}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {p.location} · valid till {formatDate(p.validTill)}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* AI Insights */}
      <AiInsightPanel
        title="AI HSE Intelligence"
        confidence={85}
        sections={[
          {
            icon: ShieldAlert,
            label: "HSE Risk Forecast",
            body: (
              <>
                <span className="font-semibold text-destructive">Inverter Yard</span> and{" "}
                <span className="font-semibold text-destructive">Piling</span> zones are trending{" "}
                <span className="font-semibold">elevated</span> on crane-lift and excavation exposure. Overall
                severity index is <span className="font-semibold text-success">improving</span> (2.1 → 1.4),
                signalling controls are taking effect.
              </>
            ),
          },
          {
            icon: HeartPulse,
            label: "Safety Recommendations",
            body: (
              <>
                Complete a <span className="font-semibold">rigging & crane audit</span> at the Inverter Yard, run a{" "}
                <span className="font-semibold">PPE compliance drive</span> for trench works, and enforce{" "}
                <span className="font-semibold">excavation barricading</span> across the cable trench corridor.
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
                toast.success("Rigging audit scheduled", {
                  description: "Crane & rigging inspection assigned to HSE team at Inverter Yard.",
                })
              }
            >
              <Wrench className="h-4 w-4" /> Schedule Audit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                toast.success("PPE compliance drive launched", {
                  description: "Toolbox talks & PPE checks rolled out across trench-work crews.",
                })
              }
            >
              <ShieldCheck className="h-4 w-4" /> Launch PPE Drive
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                toast.success("Barricading task raised", {
                  description: "Excavation barricading audit routed to A. Nair.",
                })
              }
            >
              <Sparkles className="h-4 w-4" /> Barricading
            </Button>
          </>
        }
      />

      {/* Report Observation dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HardHat className="h-4 w-4 text-primary" /> Report HSE Observation
            </DialogTitle>
            <DialogDescription>
              Log a safety observation — it is routed to the HSE team for triage and corrective action.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Near Miss", "Unsafe Act", "First Aid", "Incident"].map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Severity</Label>
                <Select value={severity} onValueChange={setSeverity}>
                  <SelectTrigger className="capitalize">
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    {["low", "medium", "high", "critical"].map((s) => (
                      <SelectItem key={s} value={s} className="capitalize">
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Inverter Yard"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what was observed and any immediate action taken…"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="gradient" onClick={submitObservation}>
              <Plus /> Submit Observation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
