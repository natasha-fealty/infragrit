import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  FileBarChart,
  RefreshCw,
  Plus,
  LayoutDashboard,
  CalendarDays,
  BarChart3,
  ShieldAlert,
  Wallet,
  Package,
  FileText,
  FileSpreadsheet,
  Mail,
  CalendarClock,
  Download,
  Loader2,
  Clock,
  CheckCircle2,
  History,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { StaggerGroup, fadeInUp } from "@/components/shared/motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRefresh } from "@/hooks/useSimulatedLoad";
import { cn } from "@/lib/utils";
import { reports } from "@/mock/data";
import { project } from "@/mock/project";

const iconMap: Record<string, LucideIcon> = {
  "layout-dashboard": LayoutDashboard,
  "calendar-days": CalendarDays,
  "bar-chart-3": BarChart3,
  "file-bar-chart": FileBarChart,
  "shield-alert": ShieldAlert,
  wallet: Wallet,
  package: Package,
};

type Report = (typeof reports)[number];

const scheduleVariant: Record<string, "info" | "accent" | "secondary"> = {
  Daily: "info",
  Weekly: "accent",
  Monthly: "secondary",
};

const slug = (s: string) => s.replace(/[^a-z0-9]+/gi, "_").replace(/^_|_$/g, "");
const fileFor = (title: string, ext: string) =>
  `${slug(title)}_${"2026-07-02"}.${ext}`;

const recentRuns = [
  { id: "run1", title: "Executive Summary Report", file: "Executive_Summary_Report_2026-07-02.pdf", size: "2.4 MB", when: "Today, 07:00", ext: "PDF" },
  { id: "run2", title: "Daily Progress Report (DPR)", file: "Daily_Progress_Report_2026-07-02.pdf", size: "1.1 MB", when: "Today, 06:30", ext: "PDF" },
  { id: "run3", title: "Cost Report", file: "Cost_Report_2026-07-02.xlsx", size: "864 KB", when: "Today, 07:20", ext: "Excel" },
  { id: "run4", title: "Risk Report", file: "Risk_Report_2026-07-02.pdf", size: "1.6 MB", when: "Today, 07:15", ext: "PDF" },
  { id: "run5", title: "Weekly MIS", file: "Weekly_MIS_2026-06-30.pdf", size: "3.2 MB", when: "Mon, 08:00", ext: "PDF" },
];

export default function Reports() {
  const navigate = useNavigate();
  const [refreshing, refresh] = useRefresh();
  const builderRef = useRef<HTMLDivElement>(null);

  // Schedule dialog
  const [scheduleTarget, setScheduleTarget] = useState<Report | null>(null);
  const [frequency, setFrequency] = useState("Weekly");

  // Report builder
  const [builderReport, setBuilderReport] = useState(reports[0].title);
  const [fromDate, setFromDate] = useState("2026-06-01");
  const [toDate, setToDate] = useState("2026-07-02");
  const [format, setFormat] = useState<"PDF" | "Excel">("PDF");
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      const ext = format === "PDF" ? "pdf" : "xlsx";
      toast.success("Report generated", {
        description: `${fileFor(builderReport, ext)} · ${fromDate} → ${toDate}`,
      });
    }, 1000);
  };

  const confirmSchedule = () => {
    const title = scheduleTarget?.title ?? "";
    setScheduleTarget(null);
    toast.success("Report scheduled", {
      description: `${title} will be generated ${frequency.toLowerCase()} and emailed to stakeholders.`,
    });
  };

  const scrollToBuilder = () => {
    builderRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    toast.success("Report Builder ready", { description: "Configure and generate a custom report below." });
  };

  const stats = [
    { title: "Reports Generated", value: "1,248", sub: "all-time across project", tone: "neutral" as const, icon: FileBarChart, spark: [180, 210, 240, 260, 300, 340, 360, 380] },
    { title: "Scheduled Reports", value: "7", sub: "automated deliveries active", tone: "success" as const, icon: CalendarClock, delta: "3 daily · 4 weekly", trend: "flat" as const },
    { title: "Last Generated", value: "Today", sub: "07:00 — Executive Summary", tone: "neutral" as const, icon: Clock, delta: "on schedule", trend: "up" as const },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Analytics"
        description="Generate, schedule and export executive-grade reports for GreenSun Solar Park."
        icon={<FileBarChart className="h-5 w-5" />}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={refresh}>
              <RefreshCw className={refreshing ? "animate-spin" : ""} />
              {refreshing ? "Refreshing" : "Refresh"}
            </Button>
            <Button variant="gradient" size="sm" onClick={scrollToBuilder}>
              <Plus />
              New Report
            </Button>
          </>
        }
      />

      {/* Stats strip */}
      <StaggerGroup className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <StatCard
            key={s.title}
            title={s.title}
            value={s.value}
            sub={s.sub}
            tone={s.tone}
            icon={s.icon}
            delta={s.delta}
            trend={s.trend}
            spark={s.spark}
          />
        ))}
      </StaggerGroup>

      {/* Report library */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          <h2 className="font-display text-lg font-semibold">Report Library</h2>
          <Badge variant="neutral" className="ml-1">{reports.length}</Badge>
        </div>
        <StaggerGroup className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {reports.map((r) => {
            const Icon = iconMap[r.icon] ?? FileBarChart;
            return (
              <motion.div key={r.id} variants={fadeInUp}>
                <Card className="group flex h-full flex-col p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-elevated">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-soft transition-transform group-hover:scale-105">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-display font-semibold leading-tight">{r.title}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">{r.desc}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Badge variant={scheduleVariant[r.schedule] ?? "neutral"}>{r.schedule}</Badge>
                    <Badge variant="outline">{r.format}</Badge>
                    <span className="ml-auto text-[11px] text-muted-foreground">Updated {r.updated}</span>
                  </div>

                  <Separator className="my-4" />

                  <div className="mt-auto grid grid-cols-2 gap-2">
                    <Button
                      variant="soft"
                      size="sm"
                      onClick={() =>
                        toast.success("PDF generated", { description: fileFor(r.title, "pdf") })
                      }
                    >
                      <FileText />
                      Generate PDF
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        toast.success("Excel exported", { description: fileFor(r.title, "xlsx") })
                      }
                    >
                      <FileSpreadsheet />
                      Export Excel
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        toast("Report emailed", {
                          description: `${r.title} sent to project stakeholders.`,
                          icon: <Mail className="h-4 w-4" />,
                        })
                      }
                    >
                      <Mail />
                      Email
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setFrequency(r.schedule);
                        setScheduleTarget(r);
                      }}
                    >
                      <CalendarClock />
                      Schedule
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </StaggerGroup>
      </section>

      {/* Report builder + preview */}
      <div ref={builderRef} className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <motion.div variants={fadeInUp} initial="hidden" animate="show" className="lg:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent" />
                Report Builder
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label>Report type</Label>
                <Select value={builderReport} onValueChange={setBuilderReport}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report" />
                  </SelectTrigger>
                  <SelectContent>
                    {reports.map((r) => (
                      <SelectItem key={r.id} value={r.title}>
                        {r.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="from">From</Label>
                  <Input id="from" type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="to">To</Label>
                  <Input id="to" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Format</Label>
                <div className="inline-flex rounded-lg border border-border bg-muted/40 p-1">
                  {(["PDF", "Excel"] as const).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFormat(f)}
                      className={cn(
                        "flex items-center gap-1.5 rounded-md px-4 py-1.5 text-sm font-medium transition-all",
                        format === f
                          ? "bg-card text-foreground shadow-soft"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {f === "PDF" ? <FileText className="h-4 w-4" /> : <FileSpreadsheet className="h-4 w-4" />}
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                variant="gradient"
                className="w-full"
                onClick={handleGenerate}
                disabled={generating}
              >
                {generating ? <Loader2 className="animate-spin" /> : <Download />}
                {generating ? "Generating…" : "Generate Report"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* PDF preview */}
        <motion.div variants={fadeInUp} initial="hidden" animate="show" className="lg:col-span-2">
          <Card className="flex h-full flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 items-center justify-center rounded-b-2xl bg-muted/30 p-6">
              <div className="w-full max-w-[240px] overflow-hidden rounded-lg border border-border bg-white shadow-elevated dark:bg-slate-900">
                {/* Document header */}
                <div className="flex items-center justify-between bg-gradient-brand px-4 py-3 text-white">
                  <div className="flex items-center gap-1.5">
                    <div className="flex h-5 w-5 items-center justify-center rounded bg-white/20">
                      <FileBarChart className="h-3 w-3" />
                    </div>
                    <span className="text-[11px] font-bold tracking-tight">InfraGrit</span>
                  </div>
                  <span className="text-[8px] uppercase tracking-widest opacity-80">{format}</span>
                </div>
                <div className="space-y-3 p-4">
                  <div>
                    <p className="text-[11px] font-bold leading-tight text-slate-900 dark:text-slate-100">
                      {builderReport}
                    </p>
                    <p className="mt-0.5 text-[8px] text-slate-500">
                      {project.name} · {project.capacity}
                    </p>
                  </div>
                  {/* skeleton lines */}
                  <div className="space-y-1.5">
                    <div className="h-1.5 w-full rounded bg-slate-200 dark:bg-slate-700" />
                    <div className="h-1.5 w-5/6 rounded bg-slate-200 dark:bg-slate-700" />
                    <div className="h-1.5 w-4/6 rounded bg-slate-200 dark:bg-slate-700" />
                  </div>
                  {/* mini bar chart */}
                  <div className="flex h-14 items-end gap-1.5 rounded bg-slate-50 p-2 dark:bg-slate-800">
                    {[45, 70, 55, 85, 60, 95].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-sm bg-gradient-to-t from-primary/50 to-primary"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="rounded bg-slate-50 p-1.5 dark:bg-slate-800">
                      <div className="h-1 w-2/3 rounded bg-slate-300 dark:bg-slate-600" />
                      <div className="mt-1 h-1.5 w-1/2 rounded bg-primary/60" />
                    </div>
                    <div className="rounded bg-slate-50 p-1.5 dark:bg-slate-800">
                      <div className="h-1 w-2/3 rounded bg-slate-300 dark:bg-slate-600" />
                      <div className="mt-1 h-1.5 w-1/2 rounded bg-accent/60" />
                    </div>
                  </div>
                  <p className="text-[7px] text-slate-400">
                    Generated {fromDate} → {toDate}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recently generated */}
      <motion.div variants={fadeInUp} initial="hidden" animate="show">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2">
              <History className="h-4 w-4 text-primary" />
              Recently Generated
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate("/documents")}>
              View archive
            </Button>
          </CardHeader>
          <CardContent className="space-y-1">
            {recentRuns.map((run) => {
              const isExcel = run.ext === "Excel";
              return (
                <div
                  key={run.id}
                  className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-muted/40"
                >
                  <div
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                      isExcel ? "bg-success/10 text-success" : "bg-primary/10 text-primary"
                    )}
                  >
                    {isExcel ? <FileSpreadsheet className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{run.file}</p>
                    <p className="text-xs text-muted-foreground">{run.title}</p>
                  </div>
                  <div className="hidden shrink-0 items-center gap-4 text-xs text-muted-foreground sm:flex">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                      {run.size}
                    </span>
                    <span>{run.when}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() =>
                      toast.success("Download started", { description: run.file })
                    }
                  >
                    <Download />
                  </Button>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>

      {/* Schedule dialog */}
      <Dialog open={!!scheduleTarget} onOpenChange={(open) => !open && setScheduleTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule report</DialogTitle>
            <DialogDescription>
              {scheduleTarget?.title} — automated generation and email delivery to stakeholders.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label>Frequency</Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                {["Daily", "Weekly", "Fortnightly", "Monthly"].map((f) => (
                  <SelectItem key={f} value={f}>
                    {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduleTarget(null)}>
              Cancel
            </Button>
            <Button variant="gradient" onClick={confirmSchedule}>
              <CalendarClock />
              Confirm Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
