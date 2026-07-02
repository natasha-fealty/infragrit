import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Package,
  RefreshCw,
  Download,
  Filter,
  Truck,
  Boxes,
  Timer,
  AlertTriangle,
  ShieldAlert,
  Plane,
  Zap,
  TrendingDown,
  PackageCheck,
  Warehouse,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { ChartCard } from "@/components/shared/ChartCard";
import { ChartTooltip, chartColors } from "@/components/shared/ChartTooltip";
import { ScoreBar } from "@/components/shared/HealthGauge";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/Badges";
import { StaggerGroup, fadeInUp } from "@/components/shared/motion";
import { KpiGridSkeleton } from "@/components/shared/Skeletons";
import { AiInsightPanel } from "@/components/shared/AiInsightPanel";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  procurementKpis,
  procurementFunnel,
  materialDeliveryTrend,
  inventoryTrend,
  poRegister,
  vendors,
  materialRegister,
} from "@/mock/data";
import { useSimulatedLoad, useRefresh } from "@/hooks/useSimulatedLoad";
import { formatDate } from "@/lib/utils";
import { toneHex } from "@/lib/tone";
import type { HealthTone, PoRow } from "@/types";

const kpiIcons = [Truck, Timer, PackageCheck, AlertTriangle, Warehouse];
const kpiRoutes = ["/procurement", "/procurement", "/procurement", "/schedule", "/schedule"];

type Vendor = (typeof vendors)[number];
type MaterialRow = (typeof materialRegister)[number];

const riskTone: Record<string, HealthTone> = {
  High: "danger",
  Medium: "warning",
  Low: "success",
};
const riskBadge: Record<string, "danger" | "warning" | "success"> = {
  High: "danger",
  Medium: "warning",
  Low: "success",
};

function agingTone(days: number): HealthTone {
  if (days >= 45) return "danger";
  if (days >= 35) return "warning";
  return "neutral";
}

const poColumns: ColumnDef<PoRow>[] = [
  {
    accessorKey: "poNo",
    header: "PO No.",
    cell: ({ row }) => <span className="font-medium">{row.original.poNo}</span>,
  },
  {
    accessorKey: "material",
    header: "Material",
    cell: ({ row }) => (
      <span className="block max-w-[190px] truncate">{row.original.material}</span>
    ),
  },
  { accessorKey: "vendor", header: "Vendor" },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => (
      <span className="font-medium tabular-nums">₹{row.original.value} Cr</span>
    ),
  },
  {
    accessorKey: "promised",
    header: "Promised",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{formatDate(row.original.promised)}</span>
    ),
  },
  {
    accessorKey: "agingDays",
    header: "Aging",
    cell: ({ row }) => {
      const tone = agingTone(row.original.agingDays);
      return (
        <span className="font-semibold tabular-nums" style={{ color: toneHex[tone] }}>
          {row.original.agingDays}d
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
];

const materialColumns: ColumnDef<MaterialRow>[] = [
  {
    accessorKey: "material",
    header: "Material",
    cell: ({ row }) => <span className="font-medium">{row.original.material}</span>,
  },
  {
    id: "progress",
    header: "Received vs Required",
    cell: ({ row }) => {
      const { received, required, unit, status } = row.original;
      const pct = Math.min(Math.round((received / required) * 100), 100);
      const tone =
        status === "Critical" ? "danger" : status === "Watch" ? "warning" : "success";
      return (
        <div className="min-w-[170px] space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="tabular-nums text-muted-foreground">
              {received.toLocaleString("en-IN")} / {required.toLocaleString("en-IN")} {unit}
            </span>
            <span className="font-semibold tabular-nums">{pct}%</span>
          </div>
          <Progress value={pct} tone={tone} className="h-1.5" />
        </div>
      );
    },
  },
  {
    accessorKey: "coverage",
    header: "Coverage",
    cell: ({ row }) => {
      const { coverage, status } = row.original;
      const tone =
        status === "Critical" ? "danger" : status === "Watch" ? "warning" : "success";
      return (
        <span className="font-semibold tabular-nums" style={{ color: toneHex[tone] }}>
          {coverage} days
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
];

export default function Procurement() {
  const navigate = useNavigate();
  const loading = useSimulatedLoad(600);
  const [refreshing, refresh] = useRefresh();

  const conversion = Math.round(
    (procurementFunnel[procurementFunnel.length - 1].value / procurementFunnel[0].value) * 100
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Procurement Intelligence"
        description="Purchase orders, vendor performance and material readiness for GreenSun Solar Park."
        icon={<Package className="h-5 w-5" />}
        breadcrumbs={[{ label: "Command Centre", to: "/command-centre" }, { label: "Procurement" }]}
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
                toast.success("Procurement report exported", {
                  description: "PO register, vendor scorecard & material readiness (PDF).",
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
        <StaggerGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {procurementKpis.map((kpi, i) => (
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

      {/* Funnel + Inventory */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard
          title="Procurement Status Funnel"
          description={`Requisition → Delivered · ${conversion}% conversion`}
          icon={<Filter className="h-4 w-4" />}
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={procurementFunnel}
              layout="vertical"
              margin={{ left: 8, right: 32, top: 4, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} horizontal={false} />
              <XAxis type="number" tickLine={false} axisLine={false} />
              <YAxis
                type="category"
                dataKey="stage"
                tickLine={false}
                axisLine={false}
                width={92}
                tick={{ fontSize: 12 }}
              />
              <Tooltip cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }} content={<ChartTooltip />} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={26}>
                {procurementFunnel.map((s) => (
                  <Cell key={s.stage} fill={s.color} />
                ))}
                <LabelList
                  dataKey="value"
                  position="right"
                  fill="hsl(var(--muted-foreground))"
                  fontSize={12}
                  fontWeight={600}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Module Inventory Trend"
          description="Weekly module stock vs stockout threshold (units, '000)"
          icon={<TrendingDown className="h-4 w-4" />}
          actions={
            <Badge variant="danger" className="gap-1">
              <AlertTriangle className="h-3 w-3" /> Stockout risk
            </Badge>
          }
        >
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={inventoryTrend} margin={{ left: -20, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="pc-inv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColors.red} stopOpacity={0.28} />
                  <stop offset="100%" stopColor={chartColors.red} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
              <XAxis dataKey="period" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={40} />
              <Tooltip content={<ChartTooltip />} />
              <ReferenceLine
                y={60}
                stroke={chartColors.red}
                strokeDasharray="5 4"
                label={{
                  value: "Threshold 60",
                  position: "insideTopRight",
                  fill: chartColors.red,
                  fontSize: 11,
                }}
              />
              <Area
                type="monotone"
                dataKey="Modules"
                stroke={chartColors.red}
                strokeWidth={2.5}
                fill="url(#pc-inv)"
              />
            </AreaChart>
          </ResponsiveContainer>
          <p className="mt-2 text-xs text-muted-foreground">
            Modules declining toward the 60k threshold — projected exhaustion 12-Aug.
          </p>
        </ChartCard>
      </div>

      {/* Material delivery + Vendor performance */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard
          title="Material Delivery Trend"
          description="Cumulative planned vs actual deliveries (₹ Cr)"
          icon={<Truck className="h-4 w-4" />}
        >
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={materialDeliveryTrend} margin={{ left: -20, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="pc-plan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColors.primary} stopOpacity={0.22} />
                  <stop offset="100%" stopColor={chartColors.primary} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="pc-act" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColors.secondary} stopOpacity={0.22} />
                  <stop offset="100%" stopColor={chartColors.secondary} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
              <XAxis dataKey="period" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={40} />
              <Tooltip content={<ChartTooltip valuePrefix="₹" valueSuffix=" Cr" />} />
              <Area
                type="monotone"
                dataKey="Planned"
                stroke={chartColors.primary}
                strokeWidth={2}
                fill="url(#pc-plan)"
              />
              <Area
                type="monotone"
                dataKey="Actual"
                stroke={chartColors.secondary}
                strokeWidth={2.5}
                fill="url(#pc-act)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Vendor Heat Map"
          description="On-time delivery & quality, coloured by risk"
          icon={<Boxes className="h-4 w-4" />}
          bodyClassName="max-h-[300px] overflow-y-auto"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {vendors.map((v: Vendor) => {
              const tone = riskTone[v.risk] ?? "neutral";
              return (
                <motion.div
                  key={v.id}
                  variants={fadeInUp}
                  className="rounded-xl border bg-card p-3 transition-shadow hover:shadow-card"
                  style={{ borderColor: `${toneHex[tone]}55` }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{v.name}</p>
                      <p className="text-[11px] text-muted-foreground">{v.category}</p>
                    </div>
                    <Badge variant={riskBadge[v.risk]} className="shrink-0 text-[10px]">
                      {v.risk}
                    </Badge>
                  </div>
                  <div className="mt-3 space-y-2">
                    <ScoreBar label="OTD" score={v.otd} tone={v.otd >= 85 ? "success" : v.otd >= 70 ? "warning" : "danger"} />
                    <ScoreBar label="Quality" score={v.quality} tone={v.quality >= 88 ? "success" : "warning"} />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="font-medium text-foreground">₹{v.spend} Cr</span>
                    <span>{v.openPos} open POs</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </ChartCard>
      </div>

      {/* PO Register */}
      <motion.div variants={fadeInUp} initial="hidden" animate="show">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2">
              <PackageCheck className="h-4 w-4 text-primary" />
              Purchase Order Register
            </CardTitle>
            <Badge variant="neutral">{poRegister.length} active POs</Badge>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={poColumns}
              data={poRegister}
              searchKey="material"
              searchPlaceholder="Search PO, material or vendor…"
              pageSize={8}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Material Register */}
      <motion.div variants={fadeInUp} initial="hidden" animate="show">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2">
              <Warehouse className="h-4 w-4 text-primary" />
              Material Register
            </CardTitle>
            <Badge variant="danger">3 at stockout risk</Badge>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={materialColumns}
              data={materialRegister}
              searchKey="material"
              searchPlaceholder="Search material…"
              pageSize={8}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Insights */}
      <AiInsightPanel
        title="AI Procurement Intelligence"
        confidence={88}
        sections={[
          {
            icon: AlertTriangle,
            label: "Material Exhaustion Prediction",
            body: (
              <>
                Solar modules exhaust <span className="font-semibold text-destructive">12-Aug</span>; balance
                delivery only <span className="font-semibold">15-Aug</span> → a{" "}
                <span className="font-semibold">3-day stoppage</span> on the critical path (Module Installation).
              </>
            ),
          },
          {
            icon: ShieldAlert,
            label: "Vendor Delay Risk",
            body: (
              <>
                <span className="font-semibold">SunTech Global</span> (modules, 72% OTD) and{" "}
                <span className="font-semibold">PowerVolt Inc</span> (inverters, 64% OTD) are flagged{" "}
                <span className="font-semibold text-destructive">High risk</span> — both drive critical-path materials.
              </>
            ),
          },
          {
            icon: Plane,
            label: "Expediting Recommendations",
            body: (
              <>
                Air-freight <span className="font-semibold">40,000 modules</span> to recover{" "}
                <span className="font-semibold text-success">+3 days</span>, and escalate the{" "}
                <span className="font-semibold">PCU-3 inverter</span> PO to the vendor with an alternate-source contingency.
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
                toast.success("Expedite request raised", {
                  description: "Air-freight charter for 40,000 modules routed to vendor & logistics.",
                })
              }
            >
              <Plane className="h-4 w-4" /> Expedite
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                toast.success("RFQ initiated", {
                  description: "Alternate-source RFQ issued for critical materials.",
                })
              }
            >
              <Zap className="h-4 w-4" /> Raise RFQ
            </Button>
          </>
        }
      />
    </div>
  );
}
