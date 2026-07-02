import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { type ColumnDef } from "@tanstack/react-table";
import {
  ShieldCheck,
  RefreshCw,
  Download,
  FileWarning,
  CheckCircle2,
  Percent,
  Wrench,
  TrendingDown,
  BarChart3,
  Activity,
  ClipboardCheck,
  ListChecks,
  AlertTriangle,
  Zap,
  Bell,
  UserPlus,
  ArrowRight,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { ChartCard } from "@/components/shared/ChartCard";
import { ChartTooltip, chartColors } from "@/components/shared/ChartTooltip";
import { DataTable } from "@/components/shared/DataTable";
import { SeverityBadge, StatusBadge } from "@/components/shared/Badges";
import { AiInsightPanel } from "@/components/shared/AiInsightPanel";
import { EmptyState } from "@/components/shared/EmptyState";
import { StaggerGroup } from "@/components/shared/motion";
import { KpiGridSkeleton } from "@/components/shared/Skeletons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  qualityKpis,
  ncrTrend,
  defectPareto,
  reworkTrend,
  ncrRegister,
  inspectionRegister,
} from "@/mock/data";
import { useSimulatedLoad, useRefresh } from "@/hooks/useSimulatedLoad";
import { formatCr, formatDate } from "@/lib/utils";
import type { NcrRow } from "@/types";

const kpiIcons = [FileWarning, CheckCircle2, Percent, Wrench];

type InspectionRow = (typeof inspectionRegister)[number];

const punchList = [
  { id: "PL-041", item: "Rectify weld cap profile — MMS beam B-14", zone: "MMS Assembly", discipline: "Structures", priority: "high" as const },
  { id: "PL-038", item: "Re-torque module mid clamps — Row A-22", zone: "Module Field A", discipline: "Modules", priority: "medium" as const },
  { id: "PL-034", item: "Touch-up galvanising — purlin P-08", zone: "MMS Assembly", discipline: "Structures", priority: "low" as const },
  { id: "PL-030", item: "Re-dress cable bend radius — trench T-04", zone: "Cable Trench", discipline: "Cabling", priority: "medium" as const },
];

export default function Quality() {
  const navigate = useNavigate();
  const loading = useSimulatedLoad(600);
  const [refreshing, refresh] = useRefresh();

  const inspectionDonut = useMemo(() => {
    const pass = inspectionRegister.filter((i) => i.result === "Pass").length;
    const fail = inspectionRegister.filter((i) => i.result === "Fail").length;
    return [
      { name: "Pass", value: pass, color: chartColors.green },
      { name: "Fail", value: fail, color: chartColors.red },
    ];
  }, []);
  const inspectionTotal = inspectionDonut.reduce((s, d) => s + d.value, 0);
  const passRate = Math.round((inspectionDonut[0].value / inspectionTotal) * 100);

  const ncrColumns: ColumnDef<NcrRow>[] = [
    {
      accessorKey: "ncrNo",
      header: "NCR No.",
      cell: ({ row }) => <span className="font-mono text-xs font-semibold">{row.original.ncrNo}</span>,
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="min-w-0">
          <p className="truncate font-medium">{row.original.description}</p>
          <p className="text-xs text-muted-foreground">Raised by {row.original.raisedBy}</p>
        </div>
      ),
    },
    {
      accessorKey: "discipline",
      header: "Discipline",
      cell: ({ row }) => (
        <Badge variant="neutral" className="text-[10px]">
          {row.original.discipline}
        </Badge>
      ),
    },
    {
      accessorKey: "severity",
      header: "Severity",
      cell: ({ row }) => <SeverityBadge severity={row.original.severity} />,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "reworkCost",
      header: "Rework Cost",
      cell: ({ row }) => (
        <span className="font-semibold tabular-nums text-destructive">{formatCr(row.original.reworkCost)}</span>
      ),
    },
    {
      accessorKey: "age",
      header: "Age",
      cell: ({ row }) => (
        <span className="tabular-nums text-muted-foreground">{row.original.age} days</span>
      ),
    },
  ];

  const inspectionColumns: ColumnDef<InspectionRow>[] = [
    {
      accessorKey: "inspection",
      header: "Inspection",
      cell: ({ row }) => <span className="font-medium">{row.original.inspection}</span>,
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <Badge variant="secondary" className="text-[10px]">
          {row.original.type}
        </Badge>
      ),
    },
    {
      accessorKey: "result",
      header: "Result",
      cell: ({ row }) => <StatusBadge status={row.original.result} />,
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => (
        <span className="tabular-nums text-muted-foreground">{formatDate(row.original.date)}</span>
      ),
    },
    {
      accessorKey: "inspector",
      header: "Inspector",
      cell: ({ row }) => <span>{row.original.inspector}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quality Intelligence"
        description="NCR trends, defect Pareto and rework exposure across GreenSun Solar Park."
        icon={<ShieldCheck className="h-5 w-5" />}
        breadcrumbs={[{ label: "Command Centre", to: "/command-centre" }, { label: "Quality" }]}
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
                toast.success("Quality report exported", {
                  description: "NCR & inspection summary generated as PDF.",
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
          {qualityKpis.map((kpi, i) => (
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

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard
          title="NCR Trend"
          description="Non-conformance reports raised vs closed"
          icon={<Activity className="h-4 w-4" />}
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={ncrTrend} margin={{ left: -20, right: 8, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
              <XAxis dataKey="period" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={40} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }} />
              <Bar dataKey="Raised" fill={chartColors.primary} radius={[4, 4, 0, 0]} maxBarSize={22} />
              <Bar dataKey="Closed" fill={chartColors.secondary} radius={[4, 4, 0, 0]} maxBarSize={22} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Defect Pareto"
          description="Defect count with cumulative % (80/20 focus)"
          icon={<BarChart3 className="h-4 w-4" />}
        >
          <ResponsiveContainer width="100%" height={260}>
            <ComposedChart data={defectPareto} margin={{ left: -20, right: 4, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
              <XAxis
                dataKey="defect"
                tickLine={false}
                axisLine={false}
                interval={0}
                tick={{ fontSize: 10 }}
                angle={-12}
                textAnchor="end"
                height={54}
              />
              <YAxis yAxisId="left" tickLine={false} axisLine={false} width={36} />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
                width={40}
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }} />
              <Bar yAxisId="left" dataKey="count" fill={chartColors.accent} radius={[4, 4, 0, 0]} maxBarSize={30} />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="cum"
                name="Cumulative %"
                stroke={chartColors.amber}
                strokeWidth={2.5}
                dot={{ r: 3, fill: chartColors.amber }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard
          title="Rework Trend"
          description="Cumulative rework cost (₹ Cr) vs tonnage (MT)"
          icon={<Wrench className="h-4 w-4" />}
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={260}>
            <ComposedChart data={reworkTrend} margin={{ left: -20, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="q-rework" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColors.red} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={chartColors.red} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
              <XAxis dataKey="period" tickLine={false} axisLine={false} />
              <YAxis yAxisId="left" tickLine={false} axisLine={false} width={40} />
              <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} width={40} />
              <Tooltip content={<ChartTooltip />} />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="Cost"
                name="Cost (₹ Cr)"
                stroke={chartColors.red}
                strokeWidth={2.5}
                fill="url(#q-rework)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="MT"
                name="Rework (MT)"
                stroke={chartColors.amber}
                strokeWidth={2}
                strokeDasharray="5 4"
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Inspection Pass Rate"
          description="Witness & test outcomes"
          icon={<ClipboardCheck className="h-4 w-4" />}
        >
          <div className="flex h-[260px] flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={inspectionDonut}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={52}
                  outerRadius={76}
                  paddingAngle={3}
                  stroke="none"
                >
                  {inspectionDonut.map((d) => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="-mt-[118px] flex flex-col items-center">
              <span className="font-display text-3xl font-bold tracking-tight text-success">{passRate}%</span>
              <span className="text-[11px] text-muted-foreground">pass rate</span>
            </div>
            <div className="mt-[86px] flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: chartColors.green }} />
                Pass {inspectionDonut[0].value}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: chartColors.red }} />
                Fail {inspectionDonut[1].value}
              </span>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* NCR Register */}
      <ChartCard
        title="NCR Register"
        description="Open, in-progress and closed non-conformances"
        icon={<FileWarning className="h-4 w-4" />}
        bodyClassName="pt-2"
      >
        <DataTable
          columns={ncrColumns}
          data={ncrRegister}
          searchKey="description"
          searchPlaceholder="Search NCRs…"
          pageSize={8}
        />
      </ChartCard>

      {/* Inspection + Punch List */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard
          title="Inspection Register"
          description="Recent witness points and tests"
          icon={<ClipboardCheck className="h-4 w-4" />}
          bodyClassName="pt-2"
        >
          <DataTable
            columns={inspectionColumns}
            data={inspectionRegister}
            searchKey="inspection"
            searchPlaceholder="Search inspections…"
            pageSize={6}
          />
        </ChartCard>

        <ChartCard
          title="Open Punch List"
          description="Site quality items awaiting close-out"
          icon={<ListChecks className="h-4 w-4" />}
        >
          {punchList.length ? (
            <div className="space-y-2">
              {punchList.map((p) => (
                <div
                  key={p.id}
                  className="flex items-start gap-3 rounded-xl border border-border p-3 transition-colors hover:bg-muted/40"
                >
                  <SeverityBadge severity={p.priority} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium leading-snug">{p.item}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {p.id} · {p.zone} · {p.discipline}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      toast.success("Punch item assigned", {
                        description: `${p.id} routed to QA/QC for close-out.`,
                      })
                    }
                  >
                    Close out
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={ListChecks} title="No open punch items" description="All quality punch items are closed out." />
          )}
        </ChartCard>
      </div>

      {/* AI Section */}
      <AiInsightPanel
        title="AI Quality Intelligence"
        confidence={80}
        sections={[
          {
            icon: AlertTriangle,
            label: "High Risk Zones",
            body: (
              <span>
                <span className="font-semibold text-foreground">Structures (welding)</span> and{" "}
                <span className="font-semibold text-foreground">Piling</span> are flagged — weld porosity and pile
                verticality non-conformances are clustering, driving 60% of open rework tonnage.
              </span>
            ),
          },
          {
            icon: TrendingDown,
            label: "Expected Rework",
            body: (
              <span>
                Forecast <span className="font-semibold text-foreground">48 MT</span> of rework with{" "}
                <span className="font-semibold text-destructive">₹3.6 Cr</span> cost escalation. NCRs trending{" "}
                <span className="font-semibold text-destructive">+40% week-on-week</span> in the structures package.
              </span>
            ),
          },
          {
            icon: Bell,
            label: "Quality Alerts",
            body: (
              <ul className="list-disc space-y-1 pl-4">
                <li>Deploy an additional QA inspector to the MMS assembly line before next weld campaign.</li>
                <li>Trigger welder re-certification for crews on Block A & B structures.</li>
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
                toast.success("QA inspector assigned", {
                  description: "Additional inspector deployed to Structures (welding) zone.",
                })
              }
            >
              <UserPlus className="h-4 w-4" />
              Assign inspector
            </Button>
            <Button variant="soft" size="sm" onClick={() => navigate("/predictions")}>
              <Zap className="h-4 w-4" />
              View predictions
              <ArrowRight className="h-4 w-4" />
            </Button>
          </>
        }
      />
    </div>
  );
}
