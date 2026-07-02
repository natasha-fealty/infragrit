import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Users,
  HardHat,
  AlertTriangle,
  Gauge,
  Truck,
  RefreshCw,
  Download,
  Activity,
  TrendingDown,
  Wrench,
  Zap,
  Lightbulb,
  Send,
  UserPlus,
  ArrowRight,
} from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { ChartCard } from "@/components/shared/ChartCard";
import { ChartTooltip, chartColors } from "@/components/shared/ChartTooltip";
import { DataTable } from "@/components/shared/DataTable";
import { AiInsightPanel } from "@/components/shared/AiInsightPanel";
import { StatusBadge } from "@/components/shared/Badges";
import { KpiGridSkeleton } from "@/components/shared/Skeletons";
import { StaggerGroup } from "@/components/shared/motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  resourceKpis,
  labourTrend,
  equipmentUtil,
  crewProductivity,
  contractorLabour,
  equipmentRegister,
} from "@/mock/data";
import { useSimulatedLoad, useRefresh } from "@/hooks/useSimulatedLoad";
import { formatNumber } from "@/lib/utils";

const kpiIcons = [Users, HardHat, AlertTriangle, Gauge, Truck];

type ContractorRow = (typeof contractorLabour)[number];
type EquipmentRow = (typeof equipmentRegister)[number];

/** Colour a productivity value: >=85 green, 70–85 amber, <70 red. */
function prodColor(value: number): string {
  return value >= 85 ? chartColors.green : value >= 70 ? chartColors.amber : chartColors.red;
}
function prodTone(value: number): "success" | "warning" | "danger" {
  return value >= 85 ? "success" : value >= 70 ? "warning" : "danger";
}

export default function Resources() {
  const navigate = useNavigate();
  const loading = useSimulatedLoad(600);
  const [refreshing, refresh] = useRefresh();

  // Downtime donut — average utilisation split across the week.
  const days = equipmentUtil.length;
  const avg = (key: "Working" | "Idle" | "Breakdown") =>
    Math.round(equipmentUtil.reduce((s, d) => s + (d[key] as number), 0) / days);
  const downtimeSplit = [
    { name: "Working", value: avg("Working"), color: chartColors.green },
    { name: "Idle", value: avg("Idle"), color: chartColors.amber },
    { name: "Breakdown", value: avg("Breakdown"), color: chartColors.red },
  ];

  const breakdownUnits = equipmentRegister.filter((e) => e.breakdown > 0);

  const contractorCols: ColumnDef<ContractorRow>[] = [
    {
      accessorKey: "contractor",
      header: "Contractor",
      cell: ({ row }) => (
        <div className="min-w-0">
          <p className="font-medium leading-snug">{row.original.contractor}</p>
          <p className="text-xs text-muted-foreground">{row.original.trade}</p>
        </div>
      ),
    },
    { accessorKey: "planned", header: "Planned", cell: ({ row }) => formatNumber(row.original.planned) },
    { accessorKey: "present", header: "Present", cell: ({ row }) => formatNumber(row.original.present) },
    {
      accessorKey: "absent",
      header: "Absent",
      cell: ({ row }) => <span className="font-medium text-destructive">{row.original.absent}</span>,
    },
    {
      id: "attendance",
      header: "Attendance",
      cell: ({ row }) => {
        const pct = Math.round((row.original.present / row.original.planned) * 100);
        return (
          <div className="w-32 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Present</span>
              <span className="font-semibold">{pct}%</span>
            </div>
            <Progress value={pct} tone={pct >= 85 ? "success" : pct >= 75 ? "warning" : "danger"} className="h-1.5" />
          </div>
        );
      },
    },
    {
      accessorKey: "productivity",
      header: "Productivity",
      cell: ({ row }) => {
        const p = row.original.productivity;
        return (
          <div className="w-32 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Efficiency</span>
              <span className="font-semibold">{p}%</span>
            </div>
            <Progress value={p} tone={prodTone(p)} className="h-1.5" />
          </div>
        );
      },
    },
  ];

  const equipmentCols: ColumnDef<EquipmentRow>[] = [
    {
      accessorKey: "equipment",
      header: "Equipment",
      cell: ({ row }) => <span className="font-medium">{row.original.equipment}</span>,
    },
    { accessorKey: "working", header: "Working (hrs)", cell: ({ row }) => row.original.working.toFixed(1) },
    { accessorKey: "idle", header: "Idle (hrs)", cell: ({ row }) => row.original.idle.toFixed(1) },
    {
      accessorKey: "breakdown",
      header: "Breakdown (hrs)",
      cell: ({ row }) =>
        row.original.breakdown > 0 ? (
          <span className="font-medium text-destructive">{row.original.breakdown.toFixed(1)}</span>
        ) : (
          <span className="text-muted-foreground">0.0</span>
        ),
    },
    { accessorKey: "fuel", header: "Fuel (L)", cell: ({ row }) => formatNumber(row.original.fuel) },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Resource Intelligence"
        description="Labour, crew productivity and equipment utilisation across GreenSun Solar Park."
        icon={<Users className="h-5 w-5" />}
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
                toast.success("Resource report exported", {
                  description: "Labour & equipment MIS generated for GreenSun Solar Park.",
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
        <KpiGridSkeleton count={5} />
      ) : (
        <StaggerGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {resourceKpis.map((kpi, i) => (
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

      {/* Charts — Labour trend + Equipment utilisation */}
      <StaggerGroup className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard
          title="Labour Trend"
          description="Required vs available headcount per week"
          icon={<Users className="h-4 w-4" />}
        >
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={labourTrend} margin={{ left: -12, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="res-req" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColors.red} stopOpacity={0.22} />
                  <stop offset="100%" stopColor={chartColors.red} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="res-avail" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColors.primary} stopOpacity={0.28} />
                  <stop offset="100%" stopColor={chartColors.primary} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
              <XAxis dataKey="period" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={48} domain={[2200, 2900]} />
              <Tooltip content={<ChartTooltip />} />
              {/* Required area sits above Available — the exposed band is the labour gap. */}
              <Area type="monotone" dataKey="Required" stroke={chartColors.red} strokeWidth={2} strokeDasharray="5 4" fill="url(#res-req)" />
              <Area type="monotone" dataKey="Available" stroke={chartColors.primary} strokeWidth={2.5} fill="url(#res-avail)" />
            </AreaChart>
          </ResponsiveContainer>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Shaded band above the blue line represents the{" "}
            <span className="font-semibold text-destructive">480 headcount gap</span>.
          </p>
        </ChartCard>

        <ChartCard
          title="Equipment Utilization"
          description="Working / idle / breakdown split per day (%)"
          icon={<Truck className="h-4 w-4" />}
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={equipmentUtil} margin={{ left: -12, right: 8, top: 8 }} barCategoryGap="28%">
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
              <XAxis dataKey="period" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={40} unit="%" />
              <Tooltip content={<ChartTooltip valueSuffix="%" />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }} />
              <Bar dataKey="Working" stackId="a" fill={chartColors.green} />
              <Bar dataKey="Idle" stackId="a" fill={chartColors.amber} />
              <Bar dataKey="Breakdown" stackId="a" fill={chartColors.red} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </StaggerGroup>

      {/* Charts — Crew productivity + Downtime */}
      <StaggerGroup className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard
          title="Crew Productivity"
          description="Efficiency by crew (%)"
          icon={<Activity className="h-4 w-4" />}
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={crewProductivity}
              layout="vertical"
              margin={{ left: 8, right: 24, top: 4, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tickLine={false} axisLine={false} unit="%" />
              <YAxis
                type="category"
                dataKey="crew"
                tickLine={false}
                axisLine={false}
                width={72}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<ChartTooltip valueSuffix="%" />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={18}>
                {crewProductivity.map((c) => (
                  <Cell key={c.crew} fill={prodColor(c.value)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 flex justify-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: chartColors.green }} /> ≥85%</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: chartColors.amber }} /> 70–85%</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: chartColors.red }} /> &lt;70%</span>
          </div>
        </ChartCard>

        <ChartCard
          title="Downtime Analysis"
          description="Fleet time split (avg)"
          icon={<Wrench className="h-4 w-4" />}
        >
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={downtimeSplit}
                dataKey="value"
                nameKey="name"
                innerRadius={52}
                outerRadius={80}
                paddingAngle={2}
                strokeWidth={0}
              >
                {downtimeSplit.map((d) => (
                  <Cell key={d.name} fill={d.color} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip valueSuffix="%" />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-1 space-y-2">
            {downtimeSplit.map((d) => (
              <div key={d.name} className="flex items-center gap-2 text-sm">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
                <span className="text-muted-foreground">{d.name}</span>
                <span className="ml-auto font-semibold">{d.value}%</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </StaggerGroup>

      {/* Contractor labour summary */}
      <ChartCard
        title="Contractor Labour Summary"
        description="Attendance & productivity by contractor"
        icon={<HardHat className="h-4 w-4" />}
      >
        <DataTable
          columns={contractorCols}
          data={contractorLabour}
          searchKey="contractor"
          searchPlaceholder="Search contractors…"
          pageSize={8}
        />
      </ChartCard>

      {/* Equipment register + Breakdown register */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard
          title="Equipment Register"
          description="Daily machine utilisation & status"
          icon={<Truck className="h-4 w-4" />}
          className="lg:col-span-2"
        >
          <DataTable
            columns={equipmentCols}
            data={equipmentRegister}
            searchKey="equipment"
            searchPlaceholder="Search equipment…"
            pageSize={8}
          />
        </ChartCard>

        <Card className="flex flex-col">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              Breakdown Register
            </CardTitle>
            <Badge variant="danger">{breakdownUnits.length} units</Badge>
          </CardHeader>
          <CardContent className="flex-1 space-y-2">
            {breakdownUnits.map((e) => (
              <div
                key={e.id}
                className="flex items-start gap-3 rounded-xl border border-border p-3 transition-colors hover:bg-muted/40"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                  <Wrench className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-snug">{e.equipment}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {e.breakdown.toFixed(1)} hrs down · fuel {e.fuel} L
                  </p>
                </div>
                <StatusBadge status={e.status} />
              </div>
            ))}
            <Button
              variant="soft"
              className="w-full"
              onClick={() =>
                toast.success("Maintenance dispatched", {
                  description: "Field service team notified for downed units.",
                })
              }
            >
              Raise maintenance request
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* AI Resource Intelligence */}
      <AiInsightPanel
        title="AI Resource Intelligence"
        confidence={82}
        sections={[
          {
            icon: TrendingDown,
            label: "Resource Shortage Forecast",
            body: (
              <>
                A <span className="font-semibold text-destructive">480 headcount gap (17%)</span> persists across
                three contractors, concentrated in Module Install and MMS Erection. Sustained shortfall drives a
                productivity risk projected at a <span className="font-semibold">6-day critical-path delay</span>{" "}
                with an exposure of <span className="font-semibold text-destructive">₹3.0 Cr</span>.
              </>
            ),
          },
          {
            icon: Gauge,
            label: "Productivity Forecast",
            body: (
              <>
                Weighted crew productivity is holding at{" "}
                <span className="font-semibold text-warning">82%</span> and trending down (-4% WoW). Piling C (67%)
                and Module B (72%) are the weakest crews and the primary drag on the schedule.
              </>
            ),
          },
          {
            icon: Lightbulb,
            label: "Recovery Suggestions",
            body: (
              <ul className="mt-1 space-y-1.5">
                <li className="flex items-start gap-2">
                  <Zap className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                  Mobilise 150 additional workers to Module Install <span className="font-semibold text-success">(+3 days)</span>.
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                  Introduce a second shift on MMS Erection <span className="font-semibold text-success">(+2 days)</span>.
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                  Repair Piling Rig <span className="font-semibold">PR-02</span> to restore piling throughput.
                </li>
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
                toast.success("Crew mobilisation initiated", {
                  description: "Request for 150 workers routed to contractor SCM.",
                })
              }
            >
              <UserPlus className="h-4 w-4" />
              Mobilise crew
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                toast.success("Equipment request raised", {
                  description: "Additional rig & telehandler requested from central fleet.",
                })
              }
            >
              <Send className="h-4 w-4" />
              Request equipment
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/copilot")}>
              Ask Copilot
              <ArrowRight className="h-4 w-4" />
            </Button>
          </>
        }
      />
    </div>
  );
}
