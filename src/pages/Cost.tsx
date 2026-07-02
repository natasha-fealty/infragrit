import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Wallet,
  RefreshCw,
  Download,
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon,
  Layers,
  FileWarning,
  AlertTriangle,
  Flame,
  Sparkles,
  Target,
  Lightbulb,
  Play,
  Wand2,
} from "lucide-react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { ChartCard } from "@/components/shared/ChartCard";
import { ChartTooltip, chartColors } from "@/components/shared/ChartTooltip";
import { DataTable } from "@/components/shared/DataTable";
import { AiInsightPanel } from "@/components/shared/AiInsightPanel";
import { StatusBadge } from "@/components/shared/Badges";
import { StaggerGroup, fadeInUp } from "@/components/shared/motion";
import { KpiGridSkeleton } from "@/components/shared/Skeletons";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  costKpis,
  monthlyCostTrend,
  costBurn,
  packageCost,
  packageCostSummary,
  changeOrders,
  costDrivers,
} from "@/mock/data";
import { useSimulatedLoad, useRefresh } from "@/hooks/useSimulatedLoad";
import { formatDate, cn } from "@/lib/utils";
import { toneHex } from "@/lib/tone";

const kpiIcons = [Wallet, TrendingUp, Layers, Target, BarChart3, AlertTriangle];

type PkgRow = (typeof packageCostSummary)[number];
type ChangeOrderRow = (typeof changeOrders)[number];

const cr = (n: number) => `₹${n} Cr`;

const packageColumns: ColumnDef<PkgRow>[] = [
  {
    accessorKey: "pkg",
    header: "Package",
    cell: ({ row }) => <span className="font-medium">{row.original.pkg}</span>,
  },
  {
    accessorKey: "budget",
    header: "Budget",
    cell: ({ row }) => <span className="tabular-nums">{cr(row.original.budget)}</span>,
  },
  {
    accessorKey: "actual",
    header: "Actual",
    cell: ({ row }) => <span className="tabular-nums text-muted-foreground">{cr(row.original.actual)}</span>,
  },
  {
    accessorKey: "committed",
    header: "Committed",
    cell: ({ row }) => <span className="tabular-nums text-muted-foreground">{cr(row.original.committed)}</span>,
  },
  {
    accessorKey: "forecast",
    header: "Forecast (EAC)",
    cell: ({ row }) => <span className="tabular-nums font-medium">{cr(row.original.forecast)}</span>,
  },
  {
    accessorKey: "variance",
    header: "Variance",
    cell: ({ row }) => {
      const v = row.original.variance;
      const neg = v < 0;
      return (
        <span
          className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold tabular-nums"
          style={{
            color: neg ? toneHex.danger : toneHex.success,
            background: `${neg ? toneHex.danger : toneHex.success}14`,
          }}
        >
          {neg ? "▼" : "▲"} {neg ? "-" : "+"}₹{Math.abs(v)} Cr
        </span>
      );
    },
  },
];

const changeOrderColumns: ColumnDef<ChangeOrderRow>[] = [
  {
    accessorKey: "id",
    header: "CO #",
    cell: ({ row }) => <span className="font-mono text-xs font-medium">{row.original.id}</span>,
  },
  {
    accessorKey: "title",
    header: "Description",
    cell: ({ row }) => <span className="font-medium">{row.original.title}</span>,
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => <span className="tabular-nums font-semibold">{cr(row.original.value)}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "raised",
    header: "Raised",
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">{formatDate(row.original.raised)}</span>
    ),
  },
];

const savings = [
  { text: "Re-sequence installation to avoid LD exposure", save: "₹2.8 Cr" },
  { text: "Consolidate DC cable RFQ across zones", save: "₹0.6 Cr" },
  { text: "Recover welding rework via QA inspector uplift", save: "₹1.1 Cr" },
];

export default function Cost() {
  const navigate = useNavigate();
  const loading = useSimulatedLoad(600);
  const [refreshing, refresh] = useRefresh();

  const maxDriver = Math.max(...costDrivers.map((d) => d.amount));
  const sortedDrivers = [...costDrivers].sort((a, b) => b.amount - a.amount);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cost Intelligence"
        description="Earned-value analytics, cost forecasting and variance control for GreenSun Solar Park."
        icon={<Wallet className="h-5 w-5" />}
        breadcrumbs={[{ label: "Command Centre", to: "/command-centre" }, { label: "Cost" }]}
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
                toast.success("Cost report exported", {
                  description: "EVM & forecast workbook generated (XLSX + PDF).",
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
        <KpiGridSkeleton count={6} />
      ) : (
        <StaggerGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {costKpis.map((kpi, i) => (
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
          title="Monthly Cost Trend"
          description="Planned vs actual spend per month (₹ Cr)"
          icon={<BarChart3 className="h-4 w-4" />}
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyCostTrend} margin={{ left: -20, right: 8, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
              <XAxis dataKey="period" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={40} />
              <Tooltip content={<ChartTooltip valuePrefix="₹" valueSuffix=" Cr" />} cursor={{ fill: `${chartColors.primary}0d` }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
              <Bar dataKey="Planned" fill={chartColors.primary} radius={[4, 4, 0, 0]} maxBarSize={22} />
              <Bar dataKey="Actual" fill={chartColors.accent} radius={[4, 4, 0, 0]} maxBarSize={22} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Budget vs Actual Cash Flow"
          description="Cumulative committed cost curve (₹ Cr)"
          icon={<TrendingUp className="h-4 w-4" />}
        >
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={costBurn} margin={{ left: -20, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="cost-budget" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColors.primary} stopOpacity={0.2} />
                  <stop offset="100%" stopColor={chartColors.primary} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="cost-actual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColors.accent} stopOpacity={0.28} />
                  <stop offset="100%" stopColor={chartColors.accent} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
              <XAxis dataKey="period" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={40} />
              <Tooltip content={<ChartTooltip valuePrefix="₹" valueSuffix=" Cr" />} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
              <Area type="monotone" dataKey="Budget" stroke={chartColors.primary} strokeWidth={2} fill="url(#cost-budget)" />
              <Area type="monotone" dataKey="Actual" stroke={chartColors.accent} strokeWidth={2.5} fill="url(#cost-actual)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts row 2 — Package distribution + Package summary */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <ChartCard
          title="Package Cost Distribution"
          description="Forecast spend by package (₹ Cr)"
          icon={<PieChartIcon className="h-4 w-4" />}
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={packageCost}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={58}
                outerRadius={92}
                paddingAngle={2}
                stroke="none"
              >
                {packageCost.map((p) => (
                  <Cell key={p.name} fill={p.color} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip valuePrefix="₹" valueSuffix=" Cr" />} />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                iconType="circle"
                wrapperStyle={{ fontSize: 11, lineHeight: "18px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Package Cost Summary"
          description="Budget, actual, committed & forecast per package"
          icon={<Layers className="h-4 w-4" />}
          className="lg:col-span-3"
          bodyClassName="pt-2"
        >
          <DataTable
            columns={packageColumns}
            data={packageCostSummary}
            searchKey="pkg"
            searchPlaceholder="Search packages…"
            pageSize={8}
          />
        </ChartCard>
      </div>

      {/* Change orders + AI section */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard
          title="Change Orders"
          description="Scope variations impacting contract value"
          icon={<FileWarning className="h-4 w-4" />}
          actions={
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                toast.info("Change order log", { description: "Opening full variation register." })
              }
            >
              View log
            </Button>
          }
          bodyClassName="pt-2"
        >
          <DataTable
            columns={changeOrderColumns}
            data={changeOrders}
            searchKey="title"
            searchPlaceholder="Search change orders…"
            pageSize={6}
          />
        </ChartCard>

        <AiInsightPanel
          title="AI Cost Intelligence"
          confidence={84}
          className="h-full"
          sections={[
            {
              icon: Flame,
              label: "Forecast Overrun",
              body: (
                <p>
                  Forecast final cost{" "}
                  <span className="font-semibold text-foreground">₹1,271 Cr</span> against the ₹1,250 Cr
                  budget — an overrun of{" "}
                  <span className="font-semibold" style={{ color: toneHex.danger }}>
                    ₹21.3 Cr (1.7%)
                  </span>
                  . CPI is 0.97 and trending down.
                </p>
              ),
            },
            {
              icon: Target,
              label: "Top Cost Drivers",
              body: (
                <div className="mt-1 space-y-2">
                  {sortedDrivers.map((d) => (
                    <div key={d.driver} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-foreground">{d.driver}</span>
                        <span className="font-semibold tabular-nums text-muted-foreground">
                          ₹{d.amount} Cr
                        </span>
                      </div>
                      <Progress value={(d.amount / maxDriver) * 100} tone="danger" className="h-1.5" />
                    </div>
                  ))}
                </div>
              ),
            },
            {
              icon: Lightbulb,
              label: "Savings Opportunities",
              body: (
                <ul className="mt-1 space-y-1.5">
                  {savings.map((s) => (
                    <li key={s.text} className="flex items-start gap-2 text-xs">
                      <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                      <span className="text-foreground">
                        {s.text} —{" "}
                        <span className="font-semibold" style={{ color: toneHex.success }}>
                          save {s.save}
                        </span>
                      </span>
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
                  toast.success("Recovery plan applied", {
                    description: "Cost-saving levers routed to owners — projected save ₹4.5 Cr.",
                  })
                }
              >
                <Wand2 className="h-4 w-4" />
                Apply
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  toast.info("Simulating scenario", {
                    description: "Running EAC re-forecast with mitigations applied…",
                  })
                }
              >
                <Play className="h-4 w-4" />
                Simulate
              </Button>
            </>
          }
        />
      </div>

      {/* CPI footer strip */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border shadow-card sm:grid-cols-4"
      >
        {[
          { label: "Budget (BAC)", value: "₹1,250 Cr" },
          { label: "Actual to Date", value: "₹858 Cr" },
          { label: "Forecast (EAC)", value: "₹1,271 Cr", tone: "warning" as const },
          { label: "Variance (VAC)", value: "-₹21.3 Cr", tone: "danger" as const },
        ].map((s) => (
          <button
            key={s.label}
            onClick={() => navigate("/predictions")}
            className={cn(
              "bg-card p-4 text-left transition-colors hover:bg-muted/40"
            )}
          >
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              {s.label}
            </p>
            <p
              className="mt-1 font-display text-lg font-bold tracking-tight"
              style={s.tone ? { color: toneHex[s.tone] } : undefined}
            >
              {s.value}
            </p>
          </button>
        ))}
      </motion.div>
    </div>
  );
}
