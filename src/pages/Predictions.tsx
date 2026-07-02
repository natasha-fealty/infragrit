import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import {
  Sparkles,
  RefreshCw,
  Download,
  CalendarClock,
  Wallet,
  ShieldAlert,
  Gauge,
  TrendingUp,
  Activity,
  Target,
  SlidersHorizontal,
  Users,
  Cpu,
  Zap,
  Plus,
  Minus,
  RotateCcw,
  Play,
  ArrowRight,
  Workflow,
  Lightbulb,
  CheckCircle2,
  Route,
} from "lucide-react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { ChartCard } from "@/components/shared/ChartCard";
import { ChartTooltip, chartColors } from "@/components/shared/ChartTooltip";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { AiInsightPanel } from "@/components/shared/AiInsightPanel";
import { StaggerGroup, fadeInUp } from "@/components/shared/motion";
import { KpiGridSkeleton } from "@/components/shared/Skeletons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  predictionKpis,
  riskTrend,
  predictionTrend,
  riskHeatMatrix,
  useCases,
} from "@/mock/data";
import { useSimulatedLoad, useRefresh } from "@/hooks/useSimulatedLoad";
import { toneHex } from "@/lib/tone";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import type { HealthTone, UseCase } from "@/types";

const kpiIcons: LucideIcon[] = [CalendarClock, Wallet, ShieldAlert, Gauge];

const severityColor: Record<string, string> = {
  critical: chartColors.red,
  high: chartColors.amber,
  medium: chartColors.primary,
  low: chartColors.green,
};

/* -------- What-If baseline -------- */
const BASE_DELAY = 8;
const BASE_COST = 21.3;
const BASE_RISK = 62;

function HeatTooltip({ active, payload }: { active?: boolean; payload?: any[] }) {
  if (!active || !payload || !payload.length) return null;
  const p = payload[0].payload as (typeof riskHeatMatrix)[number];
  return (
    <div className="rounded-xl border border-border bg-popover/95 px-3 py-2 shadow-elevated backdrop-blur">
      <p className="mb-1 text-xs font-semibold text-foreground">{p.name}</p>
      <div className="space-y-0.5 text-xs text-muted-foreground">
        <p>Probability: <span className="font-semibold text-foreground">{p.probability}%</span></p>
        <p>Impact: <span className="font-semibold text-foreground">{p.impact}%</span></p>
        <p className="capitalize">
          Severity: <span className="font-semibold" style={{ color: severityColor[p.severity] }}>{p.severity}</span>
        </p>
      </div>
    </div>
  );
}

/* -------- Animated flow step chain -------- */
function FlowChain({ flow }: { flow: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-y-3">
      {flow.map((step, i) => {
        const isLast = i === flow.length - 1;
        return (
          <div key={step} className="flex items-center">
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.07, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-xs font-medium",
                isLast
                  ? "border-accent/40 bg-gradient-brand text-white shadow-soft"
                  : "border-border bg-muted/40 text-foreground"
              )}
            >
              {step}
            </motion.div>
            {!isLast && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.07 + 0.05 }}
              >
                <ArrowRight className="mx-1 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              </motion.div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* -------- Use case detail (shared by inline panel + dialog) -------- */
function UseCaseDetail({ uc }: { uc: UseCase }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="warning" className="gap-1">
          <CalendarClock className="h-3 w-3" /> COD {uc.codDelay}
        </Badge>
        <Badge variant="danger" className="gap-1">
          <Wallet className="h-3 w-3" /> {uc.costImpact}
        </Badge>
        <Badge variant="accent" className="gap-1">
          <TrendingUp className="h-3 w-3" /> {uc.confidence}% confidence
        </Badge>
      </div>

      <div>
        <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <Zap className="h-3.5 w-3.5" /> Trigger
        </p>
        <p className="text-sm leading-relaxed">{uc.trigger}</p>
      </div>

      <div>
        <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <Target className="h-3.5 w-3.5" /> Key Drivers
        </p>
        <div className="flex flex-wrap gap-2">
          {uc.drivers.map((d) => (
            <Badge key={d} variant="secondary">{d}</Badge>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <Workflow className="h-3.5 w-3.5" /> AI Decision Flow
        </p>
        <FlowChain flow={uc.flow} />
      </div>

      <div>
        <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <Lightbulb className="h-3.5 w-3.5" /> Recovery Options
        </p>
        <div className="space-y-2">
          {uc.recovery.map((r) => (
            <div
              key={r.option}
              className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                <span className="truncate text-sm">{r.option}</span>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="text-xs font-semibold text-success">{r.recovery}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    toast.success("Recovery scenario applied", {
                      description: `${r.option} — projected ${r.recovery}. Routed to planning.`,
                    })
                  }
                >
                  Apply
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Predictions() {
  const navigate = useNavigate();
  const loading = useSimulatedLoad(600);
  const [refreshing, refresh] = useRefresh();

  /* What-If state */
  const [labour, setLabour] = useState(0);
  const [equipment, setEquipment] = useState(0);
  const [altVendor, setAltVendor] = useState(false);
  const [resequence, setResequence] = useState(false);

  /* Use case selection */
  const [selectedId, setSelectedId] = useState(useCases[0].id);
  const [dialogId, setDialogId] = useState<string | null>(null);
  const selected = useCases.find((u) => u.id === selectedId) ?? useCases[0];
  const dialogUc = useCases.find((u) => u.id === dialogId) ?? null;

  const sim = useMemo(() => {
    const rawRecover =
      Math.round(labour / 40) + equipment * 1 + (altVendor ? 2 : 0) + (resequence ? 2 : 0);
    const newDelay = Math.max(0, BASE_DELAY - rawRecover);
    const daysRecovered = BASE_DELAY - newDelay;
    const newCost = Math.max(0, BASE_COST - daysRecovered * 0.5);
    const newRisk = Math.max(0, BASE_RISK - daysRecovered * 2);
    return { newDelay, daysRecovered, newCost, newRisk };
  }, [labour, equipment, altVendor, resequence]);

  const resetSim = () => {
    setLabour(0);
    setEquipment(0);
    setAltVendor(false);
    setResequence(false);
    toast("Simulation reset", { description: "Inputs restored to baseline." });
  };

  const resultTiles: {
    label: string;
    icon: LucideIcon;
    before: string;
    after: number;
    decimals: number;
    prefix?: string;
    suffix?: string;
    improved: string;
    tone: HealthTone;
  }[] = [
    {
      label: "COD Delay",
      icon: CalendarClock,
      before: `${BASE_DELAY} days`,
      after: sim.newDelay,
      decimals: 0,
      suffix: " days",
      improved: `-${sim.daysRecovered} days`,
      tone: sim.newDelay === 0 ? "success" : "warning",
    },
    {
      label: "Forecast Cost Overrun",
      icon: Wallet,
      before: `₹${BASE_COST} Cr`,
      after: sim.newCost,
      decimals: 1,
      prefix: "₹",
      suffix: " Cr",
      improved: `-₹${(BASE_COST - sim.newCost).toFixed(1)} Cr`,
      tone: "warning",
    },
    {
      label: "Top Risk Score",
      icon: ShieldAlert,
      before: `${BASE_RISK} / 100`,
      after: sim.newRisk,
      decimals: 0,
      suffix: " / 100",
      improved: `-${BASE_RISK - sim.newRisk} pts`,
      tone: sim.newRisk < 50 ? "success" : "danger",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Insights & Predictions"
        description="Predictive intelligence, risk forecasting and what-if simulation for GreenSun Solar Park."
        icon={<Sparkles className="h-5 w-5" />}
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
                toast.success("AI insights exported", {
                  description: "Predictions & risk report generated for GreenSun Solar Park.",
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
          {predictionKpis.map((k, i) => (
            <StatCard
              key={k.id}
              title={k.title}
              value={k.value}
              sub={k.sub}
              delta={k.delta}
              tone={k.tone}
              trend="flat"
              icon={kpiIcons[i]}
            />
          ))}
        </StaggerGroup>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard
          title="Risk Trend"
          description="Composite project risk score by month"
          icon={<TrendingUp className="h-4 w-4" />}
        >
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={riskTrend} margin={{ left: -20, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="pred-risk" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColors.red} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={chartColors.red} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
              <XAxis dataKey="period" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={40} domain={[0, 100]} />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="Score"
                stroke={chartColors.red}
                strokeWidth={2.5}
                fill="url(#pred-risk)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Prediction Trend"
          description="Forecast COD delay & cost overrun evolution"
          icon={<Activity className="h-4 w-4" />}
        >
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={predictionTrend} margin={{ left: -20, right: 8, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
              <XAxis dataKey="period" tickLine={false} axisLine={false} />
              <YAxis yAxisId="left" tickLine={false} axisLine={false} width={36} />
              <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} width={36} />
              <Tooltip content={<ChartTooltip />} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="CODDelay"
                name="COD Delay (days)"
                stroke={chartColors.amber}
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="CostOverrun"
                name="Cost Overrun (₹Cr)"
                stroke={chartColors.accent}
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Risk Heat Matrix */}
      <ChartCard
        title="Risk Heat Matrix"
        description="Probability vs impact — bubble color by severity (top-right = highest exposure)"
        icon={<Target className="h-4 w-4" />}
      >
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart margin={{ left: -8, right: 16, top: 12, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
            <XAxis
              type="number"
              dataKey="probability"
              name="Probability"
              domain={[0, 100]}
              tickLine={false}
              axisLine={false}
              label={{ value: "Probability →", position: "insideBottom", offset: -4, fontSize: 11, fill: chartColors.axis }}
            />
            <YAxis
              type="number"
              dataKey="impact"
              name="Impact"
              domain={[0, 100]}
              tickLine={false}
              axisLine={false}
              width={40}
              label={{ value: "Impact →", angle: -90, position: "insideLeft", fontSize: 11, fill: chartColors.axis }}
            />
            <ZAxis type="number" range={[220, 220]} />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} content={<HeatTooltip />} />
            <Scatter data={riskHeatMatrix}>
              {riskHeatMatrix.map((r) => (
                <Cell key={r.name} fill={severityColor[r.severity]} fillOpacity={0.8} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
        <div className="mt-2 flex flex-wrap gap-4 px-1">
          {(["critical", "high", "medium"] as const).map((s) => (
            <div key={s} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: severityColor[s] }} />
              <span className="capitalize">{s}</span>
            </div>
          ))}
        </div>
      </ChartCard>

      {/* What-If Simulation */}
      <motion.div variants={fadeInUp} initial="hidden" animate="show">
        <Card className="relative overflow-hidden">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
          <CardHeader className="relative flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-brand text-white">
                <SlidersHorizontal className="h-4 w-4" />
              </div>
              What-If Simulation
            </CardTitle>
            <Badge variant="info" className="gap-1">
              <Cpu className="h-3 w-3" /> Live AI recompute
            </Badge>
          </CardHeader>
          <CardContent className="relative grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Inputs */}
            <div className="space-y-5">
              {/* Labour slider */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <Users className="h-4 w-4 text-primary" /> Additional Labour
                  </span>
                  <span className="font-display text-sm font-bold">{labour} workers</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={300}
                  step={10}
                  value={labour}
                  onChange={(e) => setLabour(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
                />
                <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                  <span>0</span>
                  <span>300</span>
                </div>
              </div>

              {/* Equipment stepper */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <Cpu className="h-4 w-4 text-primary" /> Extra Equipment
                  </span>
                  <span className="font-display text-sm font-bold">{equipment} rigs</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => setEquipment((v) => Math.max(0, v - 1))}
                    disabled={equipment === 0}
                  >
                    <Minus />
                  </Button>
                  <div className="flex h-2 flex-1 items-center gap-1">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <span
                        key={i}
                        className={cn(
                          "h-2 flex-1 rounded-full transition-colors",
                          i < equipment ? "bg-primary" : "bg-muted"
                        )}
                      />
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => setEquipment((v) => Math.min(6, v + 1))}
                    disabled={equipment === 6}
                  >
                    <Plus />
                  </Button>
                </div>
              </div>

              {/* Switches */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-border bg-muted/30 px-3 py-3">
                  <span className="text-sm font-medium">Alternate Vendor</span>
                  <Switch checked={altVendor} onCheckedChange={setAltVendor} />
                </label>
                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-border bg-muted/30 px-3 py-3">
                  <span className="text-sm font-medium">Resequencing</span>
                  <Switch checked={resequence} onCheckedChange={setResequence} />
                </label>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="gradient"
                  className="flex-1"
                  onClick={() =>
                    toast.success("Simulation complete", {
                      description: `Projected COD delay ${sim.newDelay} days · overrun ₹${sim.newCost.toFixed(1)} Cr · risk ${sim.newRisk}.`,
                    })
                  }
                >
                  <Play className="h-4 w-4" /> Run Simulation
                </Button>
                <Button variant="outline" onClick={resetSim}>
                  <RotateCcw className="h-4 w-4" /> Reset
                </Button>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-3">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <Zap className="h-3.5 w-3.5" /> Projected Outcome
              </p>
              {resultTiles.map((t) => {
                const Icon = t.icon;
                const hasGain = t.improved !== "-0 days" && t.improved !== "-₹0.0 Cr" && t.improved !== "-0 pts";
                return (
                  <div
                    key={t.label}
                    className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-lg"
                        style={{ background: `${toneHex[t.tone]}1a`, color: toneHex[t.tone] }}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{t.label}</p>
                        <p className="text-xs text-muted-foreground">
                          <span className="line-through">{t.before}</span>
                          <ArrowRight className="mx-1 inline h-3 w-3" />
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <AnimatedCounter
                        value={t.after}
                        decimals={t.decimals}
                        prefix={t.prefix}
                        suffix={t.suffix}
                        className="font-display text-lg font-bold"
                      />
                      {hasGain && (
                        <p className="text-xs font-semibold text-success">{t.improved}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Decision Flow / Use Cases */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <Route className="h-4 w-4 text-accent" />
          <h2 className="font-display text-lg font-semibold">AI Decision Flow — Use Cases</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Selectable cards */}
          <div className="space-y-2 lg:col-span-1">
            {useCases.map((uc) => {
              const active = uc.id === selectedId;
              return (
                <button
                  key={uc.id}
                  onClick={() => setSelectedId(uc.id)}
                  onDoubleClick={() => setDialogId(uc.id)}
                  className={cn(
                    "w-full rounded-xl border p-3 text-left transition-all",
                    active
                      ? "border-primary/40 bg-primary/[0.06] shadow-card"
                      : "border-border bg-card hover:border-primary/30 hover:bg-muted/40"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold">{uc.title}</p>
                    <Badge variant="warning" className="shrink-0">{uc.codDelay}</Badge>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{uc.trigger}</p>
                  <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1 text-destructive">
                      <Wallet className="h-3 w-3" /> {uc.costImpact}
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" /> {uc.confidence}%
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detail panel */}
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-2"
          >
            <Card className="h-full">
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <CardTitle className="flex items-center gap-2">
                  <Workflow className="h-4 w-4 text-primary" />
                  {selected.title}
                </CardTitle>
                <Button variant="soft" size="sm" onClick={() => setDialogId(selected.id)}>
                  Expand flow <ArrowRight className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <UseCaseDetail uc={selected} />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* AI outlook */}
      <AiInsightPanel
        title="Overall AI Outlook"
        confidence={88}
        sections={[
          {
            icon: TrendingUp,
            label: "Prediction",
            body: "COD is forecast at 23-Jan-2027 — an 8-day slip driven primarily by module inventory exhaustion on the critical path, with a ₹21.3 Cr cost overrun (1.7% of budget).",
          },
          {
            icon: Target,
            label: "Root Cause",
            body: "Procurement-led risk dominates: module delivery, PCU-3 inverter slip and piling productivity together account for the majority of the composite risk score of 62/100.",
          },
          {
            icon: Lightbulb,
            label: "Recommended Action",
            body: "A combined recovery of +150 labour, 2 additional piling rigs and Block C/D resequencing can recover up to 8 days and bring the risk score below 50.",
          },
        ]}
        actions={
          <>
            <Button variant="gradient" size="sm" onClick={() => navigate("/copilot")}>
              <Sparkles className="h-4 w-4" /> Ask AI Copilot
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                toast.success("Recovery plan drafted", {
                  description: "Optimal scenario routed to planning for approval.",
                })
              }
            >
              Generate Recovery Plan
            </Button>
          </>
        }
      />

      {/* Use case dialog */}
      <Dialog open={dialogUc !== null} onOpenChange={(o) => !o && setDialogId(null)}>
        <DialogContent className="max-w-2xl">
          {dialogUc && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Workflow className="h-5 w-5 text-primary" />
                  {dialogUc.title}
                </DialogTitle>
                <DialogDescription>End-to-end AI decision flow and recovery scenarios.</DialogDescription>
              </DialogHeader>
              <Separator />
              <div className="max-h-[70vh] overflow-y-auto pr-1">
                <UseCaseDetail uc={dialogUc} />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
