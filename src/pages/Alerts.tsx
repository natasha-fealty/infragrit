import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  AlertOctagon,
  AlertTriangle,
  Info,
  RefreshCw,
  Settings,
  Search,
  Lightbulb,
  Zap,
  CheckCircle2,
  Eye,
  CheckCheck,
  Clock,
  Radio,
  Filter,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { KpiGridSkeleton } from "@/components/shared/Skeletons";
import { SeverityBadge, StatusBadge } from "@/components/shared/Badges";
import { EmptyState } from "@/components/shared/EmptyState";
import { StaggerGroup, fadeInUp } from "@/components/shared/motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { alerts as seedAlerts } from "@/mock/data";
import { useSimulatedLoad, useRefresh } from "@/hooks/useSimulatedLoad";
import { timeAgo, initials, cn } from "@/lib/utils";
import type { Alert, HealthTone, Severity } from "@/types";

/* Severity → visual mapping (StatCard tone is HealthTone only) */
const severityTone: Record<Severity, HealthTone> = {
  critical: "danger",
  high: "warning",
  medium: "neutral",
  low: "neutral",
};

/* Distinct stripe / accent colour per severity (info-blue for medium) */
const severityColor: Record<Severity, string> = {
  critical: "#EF4444",
  high: "#F59E0B",
  medium: "#2563EB",
  low: "#64748B",
};

type TabKey = "all" | Severity;

const tabs: { key: TabKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "critical", label: "Critical" },
  { key: "high", label: "High" },
  { key: "medium", label: "Medium" },
  { key: "low", label: "Low" },
];

export default function Alerts() {
  const navigate = useNavigate();
  const loading = useSimulatedLoad(600);
  const [refreshing, refresh] = useRefresh();

  const [alerts, setAlerts] = useState<Alert[]>(seedAlerts);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [active, setActive] = useState<Alert | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(seedAlerts.map((a) => a.category))).sort(),
    []
  );

  /* Severity counts (over full set, not filtered) */
  const counts = useMemo(() => {
    const base: Record<Severity, number> = { critical: 0, high: 0, medium: 0, low: 0 };
    for (const a of alerts) base[a.severity] += 1;
    return base;
  }, [alerts]);

  const summary: { severity: Severity; title: string; icon: typeof Bell }[] = [
    { severity: "critical", title: "Critical", icon: AlertOctagon },
    { severity: "high", title: "High", icon: AlertTriangle },
    { severity: "medium", title: "Medium", icon: Info },
    { severity: "low", title: "Low", icon: Bell },
  ];

  /* Search + category filter (applied inside every tab) */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return alerts.filter((a) => {
      if (category !== "all" && a.category !== category) return false;
      if (!q) return true;
      return (
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.owner.toLowerCase().includes(q) ||
        a.source.toLowerCase().includes(q)
      );
    });
  }, [alerts, query, category]);

  const tabCount = (key: TabKey) =>
    key === "all" ? filtered.length : filtered.filter((a) => a.severity === key).length;

  const listFor = (key: TabKey) =>
    key === "all" ? filtered : filtered.filter((a) => a.severity === key);

  const setStatus = (id: string, status: Alert["status"], verb: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    setActive((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
    const a = alerts.find((x) => x.id === id);
    toast.success(`Alert ${verb}`, {
      description: a ? `${a.id} — ${a.title}` : id,
    });
  };

  const markAllRead = () => {
    setAlerts((prev) =>
      prev.map((a) => (a.status === "New" ? { ...a, status: "Acknowledged" } : a))
    );
    toast.success("All alerts acknowledged", {
      description: "New alerts moved to Acknowledged.",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Alerts & Notifications"
        description="Real-time signals across schedule, cost, procurement, quality and HSE for GreenSun Solar Park."
        icon={<Bell className="h-5 w-5" />}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={refresh}>
              <RefreshCw className={refreshing ? "animate-spin" : ""} />
              {refreshing ? "Refreshing" : "Refresh"}
            </Button>
            <Button variant="gradient" size="sm" onClick={() => navigate("/settings")}>
              <Settings />
              Alert Settings
            </Button>
          </>
        }
      />

      {/* Severity summary KPI row */}
      {loading ? (
        <KpiGridSkeleton count={4} />
      ) : (
        <StaggerGroup className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {summary.map((s) => (
            <StatCard
              key={s.severity}
              title={`${s.title} alerts`}
              value={String(counts[s.severity])}
              sub={counts[s.severity] === 1 ? "active alert" : "active alerts"}
              tone={severityTone[s.severity]}
              icon={s.icon}
            />
          ))}
        </StaggerGroup>
      )}

      {/* Filter / search / actions bar */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3 shadow-card sm:flex-row sm:items-center"
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search alerts, owners, sources…"
            className="pl-9"
          />
        </div>
        <div className="flex flex-1 items-center gap-2 sm:flex-none">
          <Filter className="h-4 w-4 shrink-0 text-muted-foreground" />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="soft" size="sm" onClick={markAllRead}>
          <CheckCheck />
          Mark all read
        </Button>
      </motion.div>

      {/* Tabs by severity */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="flex-wrap">
          {tabs.map((t) => (
            <TabsTrigger key={t.key} value={t.key} className="gap-2">
              {t.label}
              <Badge
                variant={t.key === "all" ? "neutral" : "outline"}
                className="h-5 min-w-5 justify-center px-1.5 text-[11px]"
              >
                {tabCount(t.key)}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((t) => {
          const rows = listFor(t.key);
          return (
            <TabsContent key={t.key} value={t.key} className="space-y-3">
              {rows.length === 0 ? (
                <EmptyState
                  icon={CheckCircle2}
                  title="No matching alerts"
                  description="You're all caught up for this filter."
                />
              ) : (
                <AnimatePresence mode="popLayout" initial={false}>
                  {rows.map((a) => (
                    <AlertRow
                      key={a.id}
                      alert={a}
                      onAcknowledge={() => setStatus(a.id, "Acknowledged", "acknowledged")}
                      onResolve={() => setStatus(a.id, "Resolved", "resolved")}
                      onView={() => setActive(a)}
                    />
                  ))}
                </AnimatePresence>
              )}
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Detail dialog */}
      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-lg">
          {active && (
            <>
              <DialogHeader>
                <div className="mb-1 flex items-center gap-2">
                  <SeverityBadge severity={active.severity} />
                  <StatusBadge status={active.status} />
                  <span className="ml-auto font-mono text-xs text-muted-foreground">
                    {active.id}
                  </span>
                </div>
                <DialogTitle className="leading-snug">{active.title}</DialogTitle>
                <DialogDescription>{active.description}</DialogDescription>
              </DialogHeader>

              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Category" value={active.category} />
                  <Field label="Source" value={active.source} />
                  <Field label="Owner" value={active.owner} />
                  <Field label="Raised" value={timeAgo(active.minutesAgo)} />
                </div>
                <Separator />
                <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-destructive">
                    Impact
                  </p>
                  <p className="mt-0.5 font-medium">{active.impact}</p>
                </div>
                <div className="rounded-lg border border-accent/20 bg-accent/5 px-3 py-2">
                  <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-accent">
                    <Lightbulb className="h-3.5 w-3.5" /> Recommended action
                  </p>
                  <p className="mt-0.5 font-medium">{active.recommendedAction}</p>
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Close</Button>
                </DialogClose>
                <Button
                  variant="gradient"
                  onClick={() =>
                    toast.success("Recommendation applied", {
                      description: `${active.recommendedAction} — routed to ${active.owner}.`,
                    })
                  }
                >
                  <Zap />
                  Apply Recommendation
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 font-medium">{value}</p>
    </div>
  );
}

function AlertRow({
  alert: a,
  onAcknowledge,
  onResolve,
  onView,
}: {
  alert: Alert;
  onAcknowledge: () => void;
  onResolve: () => void;
  onView: () => void;
}) {
  const resolved = a.status === "Resolved";
  const acknowledged = a.status === "Acknowledged" || resolved;
  return (
    <motion.div
      layout
      variants={fadeInUp}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, x: 24, transition: { duration: 0.2 } }}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-card shadow-card transition-colors hover:border-primary/30",
        resolved && "opacity-70"
      )}
    >
      {/* left severity stripe */}
      <span
        className="absolute inset-y-0 left-0 w-1"
        style={{ background: severityColor[a.severity] }}
      />

      <div className="flex flex-col gap-3 p-4 pl-5 sm:flex-row sm:items-start">
        {/* severity dot */}
        <span
          className={cn(
            "mt-1 hidden h-2.5 w-2.5 shrink-0 rounded-full sm:block",
            a.severity === "critical" && "animate-pulse"
          )}
          style={{ background: severityColor[a.severity] }}
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <SeverityBadge severity={a.severity} />
            <StatusBadge status={a.status} />
            <span className="font-mono text-[11px] text-muted-foreground">{a.id}</span>
          </div>

          <p className="mt-2 font-medium leading-snug">{a.title}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">{a.description}</p>

          {/* meta row */}
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <Badge variant="neutral" className="text-[10px]">
              {a.category}
            </Badge>
            <span className="flex items-center gap-1">
              <Radio className="h-3 w-3" /> {a.source}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> {timeAgo(a.minutesAgo)}
            </span>
          </div>

          {/* impact + recommended action */}
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <div className="rounded-lg bg-destructive/5 px-2.5 py-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-destructive">
                Impact
              </span>
              <p className="text-xs font-medium">{a.impact}</p>
            </div>
            <div className="rounded-lg bg-accent/5 px-2.5 py-1.5">
              <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-accent">
                <Lightbulb className="h-3 w-3" /> Recommended
              </span>
              <p className="text-xs font-medium">{a.recommendedAction}</p>
            </div>
          </div>
        </div>

        {/* owner + actions */}
        <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="text-[10px]">{initials(a.owner)}</AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium">{a.owner}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            <Button variant="ghost" size="sm" onClick={onView}>
              <Eye />
              View
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onAcknowledge}
              disabled={acknowledged}
            >
              <CheckCheck />
              Acknowledge
            </Button>
            <Button
              variant="soft"
              size="sm"
              onClick={onResolve}
              disabled={resolved}
            >
              <CheckCircle2 />
              Resolve
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
