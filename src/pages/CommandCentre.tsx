import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CalendarClock,
  Wallet,
  Package,
  Boxes,
  Users,
  HardHat,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Gauge,
  ArrowRight,
  RefreshCw,
  Download,
  TrendingUp,
  Target,
  Lightbulb,
  Zap,
  ChevronRight,
  Activity,
} from "lucide-react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { ChartCard } from "@/components/shared/ChartCard";
import { ChartTooltip, chartColors } from "@/components/shared/ChartTooltip";
import { HealthGauge, ScoreBar } from "@/components/shared/HealthGauge";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { StaggerGroup, fadeInUp } from "@/components/shared/motion";
import { SeverityBadge } from "@/components/shared/Badges";
import { KpiGridSkeleton } from "@/components/shared/Skeletons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { project, healthScores, overallHealthScore } from "@/mock/project";
import {
  commandKpis,
  sCurve,
  costBurn,
  aiPredictions,
  aiRecommendations,
  topRisks,
  topDelayedActivities,
  alerts,
  activityFeed,
} from "@/mock/data";
import { useSimulatedLoad, useRefresh } from "@/hooks/useSimulatedLoad";
import { formatDate, timeAgo } from "@/lib/utils";
import { toneHex } from "@/lib/tone";
import type { HealthTone } from "@/types";

const kpiIcons = [
  CalendarClock, Wallet, Package, Boxes, Users, HardHat, ShieldCheck, AlertTriangle,
];
const kpiRoutes = [
  "/schedule", "/cost", "/procurement", "/procurement", "/resources", "/hse", "/quality", "/predictions",
];

const priorityToTone: Record<string, HealthTone> = {
  critical: "danger",
  high: "warning",
  medium: "neutral",
  low: "neutral",
};

export default function CommandCentre() {
  const navigate = useNavigate();
  const loading = useSimulatedLoad(600);
  const [refreshing, refresh] = useRefresh();

  const ribbon = [
    { label: "Contract Value", value: `₹${project.contractValue} Cr` },
    { label: "Planned COD", value: formatDate(project.plannedCod) },
    { label: "Forecast COD", value: formatDate(project.forecastCod), tone: "warning" as const },
    { label: "Overall Progress", value: `${project.overallProgress}%` },
    { label: "Overall Health", value: `${project.overallHealth}/100`, tone: "warning" as const },
    { label: "Data Completeness", value: `${project.dataCompleteness}%`, tone: "success" as const },
    { label: "AI Confidence", value: `${project.aiConfidence}%`, tone: "success" as const },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Command Centre"
        description="CXO-level intelligence across the entire GreenSun Solar Park project."
        icon={<Gauge className="h-5 w-5" />}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={refresh}>
              <RefreshCw className={refreshing ? "animate-spin" : ""} />
              {refreshing ? "Refreshing" : "Refresh"}
            </Button>
            <Button
              variant="gradient"
              size="sm"
              onClick={() => toast.success("Executive report exported", { description: "PDF generated for GreenSun Solar Park." })}
            >
              <Download />
              Export
            </Button>
          </>
        }
      />

      {/* Top Ribbon */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border shadow-card sm:grid-cols-3 lg:grid-cols-7"
      >
        {ribbon.map((r) => (
          <div key={r.label} className="bg-card p-4">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              {r.label}
            </p>
            <p
              className="mt-1 font-display text-lg font-bold tracking-tight"
              style={r.tone ? { color: toneHex[r.tone] } : undefined}
            >
              {r.value}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Section A — Execution Overview KPIs */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          <h2 className="font-display text-lg font-semibold">Project Execution Overview</h2>
        </div>
        {loading ? (
          <KpiGridSkeleton count={8} />
        ) : (
          <StaggerGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {commandKpis.map((kpi, i) => (
              <StatCard
                key={kpi.id}
                title={kpi.title}
                value={kpi.value}
                sub={kpi.sub}
                delta={kpi.delta}
                metric={kpi.metric}
                trend={kpi.trend}
                tone={kpi.tone}
                icon={kpiIcons[i]}
                spark={kpi.spark}
                onClick={() => navigate(kpiRoutes[i])}
              />
            ))}
          </StaggerGroup>
        )}
      </section>

      {/* Section B + C — Health + AI Predictions */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Health */}
        <motion.div variants={fadeInUp} initial="hidden" animate="show">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="h-4 w-4 text-primary" />
                Overall Project Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex justify-center">
                <HealthGauge
                  score={overallHealthScore.score}
                  tone={overallHealthScore.tone}
                  size={150}
                  label="Overall"
                />
              </div>
              <Separator />
              <div className="space-y-3">
                {healthScores.map((h) => (
                  <ScoreBar key={h.label} label={h.label} score={h.score} tone={h.tone} />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Predictions */}
        <motion.div variants={fadeInUp} initial="hidden" animate="show" className="lg:col-span-2">
          <Card className="relative h-full overflow-hidden">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />
            <CardHeader className="relative flex-row flex-wrap items-center justify-between gap-2 space-y-0">
              <CardTitle className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-brand text-white">
                  <Sparkles className="h-4 w-4" />
                </div>
                AI Predictions
              </CardTitle>
              <Badge variant="accent" className="gap-1">
                <TrendingUp className="h-3 w-3" /> {project.aiConfidence}% confidence
              </Badge>
            </CardHeader>
            <CardContent className="relative space-y-5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {aiPredictions.map((p) => (
                  <div
                    key={p.id}
                    className="rounded-xl border border-border bg-muted/30 p-4"
                  >
                    <p className="text-xs font-medium text-muted-foreground">{p.label}</p>
                    <p
                      className="mt-1 font-display text-xl font-bold"
                      style={{ color: toneHex[p.tone] }}
                    >
                      {p.value}
                    </p>
                    <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
                      {p.detail}
                    </p>
                    <div className="mt-2">
                      <Progress value={p.confidence} tone={p.tone === "danger" ? "danger" : "accent"} className="h-1" />
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <Target className="h-3.5 w-3.5" /> Top 5 Risks
                </p>
                <div className="space-y-2">
                  {topRisks.map((r, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-lg bg-muted/30 px-3 py-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-[11px] font-bold text-destructive">
                        {i + 1}
                      </span>
                      <p className="text-sm">{r}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Button variant="soft" className="w-full" onClick={() => navigate("/predictions")}>
                Open AI Insights & Predictions
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Section D — AI Recommendations */}
      <motion.div variants={fadeInUp} initial="hidden" animate="show">
        <Card>
          <CardHeader className="flex-row flex-wrap items-center justify-between gap-2 space-y-0">
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-accent" />
              AI Recommendations
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate("/copilot")}>
              Ask Copilot <ChevronRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {aiRecommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="group flex flex-col justify-between rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-card"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium leading-snug">{rec.action}</p>
                      <SeverityBadge severity={rec.priority} />
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{rec.detail}</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                      <span className="flex items-center gap-1 font-semibold text-success">
                        <Zap className="h-3.5 w-3.5" /> {rec.benefit}
                      </span>
                      <span className="text-muted-foreground">Impact: {rec.impact}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        toast.success("Action initiated", {
                          description: `${rec.action} — routed to owner for execution.`,
                        })
                      }
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Section E — Charts + Activity */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard
          title="Planned vs Actual vs Forecast"
          description="Cumulative progress S-curve (%)"
          icon={<TrendingUp className="h-4 w-4" />}
        >
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={sCurve} margin={{ left: -20, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="cc-planned" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColors.primary} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={chartColors.primary} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
              <XAxis dataKey="period" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={40} />
              <Tooltip content={<ChartTooltip valueSuffix="%" />} />
              <Area type="monotone" dataKey="Planned" stroke={chartColors.primary} strokeWidth={2} fill="url(#cc-planned)" />
              <Line type="monotone" dataKey="Actual" stroke={chartColors.secondary} strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="Forecast" stroke={chartColors.accent} strokeWidth={2} strokeDasharray="5 4" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Cost Burn Curve"
          description="Cumulative budget vs actual (₹ Cr)"
          icon={<Wallet className="h-4 w-4" />}
        >
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={costBurn} margin={{ left: -20, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="cc-actual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColors.accent} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={chartColors.accent} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
              <XAxis dataKey="period" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={40} />
              <Tooltip content={<ChartTooltip valuePrefix="₹" valueSuffix=" Cr" />} />
              <Area type="monotone" dataKey="Budget" stroke={chartColors.primary} strokeWidth={2} fillOpacity={0} />
              <Area type="monotone" dataKey="Actual" stroke={chartColors.accent} strokeWidth={2.5} fill="url(#cc-actual)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Top Delayed Activities */}
        <ChartCard
          title="Top Delayed Activities"
          description="Critical path slippage (days)"
          icon={<CalendarClock className="h-4 w-4" />}
          actions={
            <Button variant="ghost" size="sm" onClick={() => navigate("/schedule")}>
              View all
            </Button>
          }
        >
          <div className="space-y-3">
            {topDelayedActivities.map((a) => {
              const pct = Math.min((a.delay / 12) * 100, 100);
              return (
                <div key={a.activity} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="truncate font-medium">{a.activity}</span>
                    <span className="shrink-0 font-semibold text-destructive">
                      +<AnimatedCounter value={a.delay} /> days
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={pct} tone="danger" className="h-1.5" />
                    <Badge variant="neutral" className="shrink-0 text-[10px]">
                      {a.package}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>

        {/* Recent Alerts + Activity */}
        <ChartCard
          title="Recent Activity"
          description="Live project & AI events"
          icon={<Sparkles className="h-4 w-4" />}
          actions={
            <Button variant="ghost" size="sm" onClick={() => navigate("/alerts")}>
              Alerts
            </Button>
          }
        >
          <div className="space-y-1">
            {activityFeed.slice(0, 6).map((a) => (
              <div key={a.id} className="flex items-start gap-3 rounded-lg px-1 py-2 transition-colors hover:bg-muted/40">
                <span
                  className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                  style={{ background: toneHex[a.tone === "danger" ? "danger" : a.tone === "warning" ? "warning" : a.tone === "success" ? "success" : "neutral"] }}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-snug">
                    <span className="font-semibold">{a.actor}</span>{" "}
                    <span className="text-muted-foreground">{a.action}</span>{" "}
                    <span className="font-medium">{a.target}</span>
                  </p>
                  <div className="mt-0.5 flex items-center gap-2">
                    <Badge variant="neutral" className="text-[10px]">{a.module}</Badge>
                    <span className="text-[11px] text-muted-foreground">{timeAgo(a.minutesAgo)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Recent critical alerts strip */}
      <motion.div variants={fadeInUp} initial="hidden" animate="show">
        <Card>
          <CardHeader className="flex-row flex-wrap items-center justify-between gap-2 space-y-0">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              Recent Critical Alerts
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate("/alerts")}>
              View all <ArrowRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {alerts.filter((a) => a.severity === "critical" || a.severity === "high").slice(0, 3).map((a) => (
              <div
                key={a.id}
                className="flex items-start gap-3 rounded-xl border border-border p-3 transition-colors hover:bg-muted/40"
              >
                <SeverityBadge severity={a.severity} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-snug">{a.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {a.impact} · {a.recommendedAction}
                  </p>
                </div>
                <span className="shrink-0 text-[11px] text-muted-foreground">{timeAgo(a.minutesAgo)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
