import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import type { ColumnDef } from "@tanstack/react-table";
import {
  FileStack,
  RefreshCw,
  Download,
  Upload,
  FileText,
  FileCheck2,
  ClipboardCheck,
  Stamp,
  Building2,
  CircleDot,
  MoreHorizontal,
  Eye,
  History,
  Send,
  GitCompareArrows,
  Sparkles,
  Layers,
  CalendarClock,
  Wallet,
  Package,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  FileWarning,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { AiInsightPanel } from "@/components/shared/AiInsightPanel";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/Badges";
import { KpiGridSkeleton } from "@/components/shared/Skeletons";
import { StaggerGroup, fadeInUp } from "@/components/shared/motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  documentKpis,
  docRegister,
  documentWorkflow,
  drawingChangeAnalysis,
} from "@/mock/data";
import { useSimulatedLoad, useRefresh } from "@/hooks/useSimulatedLoad";
import { formatDate } from "@/lib/utils";
import type { DocRow } from "@/types";
import { useState } from "react";

const kpiIcons = [FileText, ClipboardCheck, FileCheck2, FileWarning, History];

const workflowIcons = [Send, Eye, ClipboardCheck, Stamp, Building2];
/** Current stage index in the documentWorkflow array (Approved with Comments). */
const currentStage = 2;
const workflowMeta = [
  { date: "10 Jul 2026", note: "Rev-C uploaded by K. Bose" },
  { date: "18 Jul 2026", note: "Design review — 4 comments raised" },
  { date: "28 Jul 2026", note: "Conditional approval issued" },
  { date: "—", note: "Pending clearance of comments" },
  { date: "—", note: "Awaiting field completion" },
];

const revisionHistory = [
  { rev: "Rev-A", date: "2026-05-22", status: "Approved", note: "Initial GA — Block A grid", author: "K. Bose" },
  { rev: "Rev-B", date: "2026-06-30", status: "AFC", note: "Foundation bolt pattern revised", author: "K. Bose" },
  { rev: "Rev-C", date: "2026-07-28", status: "Under Review", note: "+420 MT steel, span reconfigured", author: "K. Bose" },
];

const disciplineTone: Record<string, string> = {
  Structures: "info",
  Electrical: "warning",
  Civil: "neutral",
  Solar: "success",
  Cabling: "accent",
};

export default function Documents() {
  const navigate = useNavigate();
  const loading = useSimulatedLoad(600);
  const [refreshing, refresh] = useRefresh();
  const [overlay, setOverlay] = useState(true);

  const columns: ColumnDef<DocRow>[] = [
    {
      accessorKey: "docNo",
      header: "Document No.",
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FileText className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="font-mono text-xs font-semibold">{row.original.docNo}</p>
            <p className="truncate text-xs text-muted-foreground">{row.original.title}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "discipline",
      header: "Discipline",
      cell: ({ row }) => (
        <Badge variant={(disciplineTone[row.original.discipline] ?? "neutral") as "info"}>
          {row.original.discipline}
        </Badge>
      ),
    },
    {
      accessorKey: "revision",
      header: "Rev",
      cell: ({ row }) => (
        <span className="font-mono text-xs font-semibold text-foreground">{row.original.revision}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "submitted",
      header: "Submitted",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{formatDate(row.original.submitted)}</span>
      ),
    },
    {
      accessorKey: "owner",
      header: "Owner",
      cell: ({ row }) => <span className="text-sm">{row.original.owner}</span>,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel>{row.original.docNo}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => toast.success("Opening viewer", { description: `${row.original.docNo} — ${row.original.revision}` })}
              >
                <Eye className="h-4 w-4" /> View drawing
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => toast.info("Revision history", { description: `Showing all revisions for ${row.original.docNo}.` })}
              >
                <History className="h-4 w-4" /> Revision history
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => toast.success("Sent for review", { description: `${row.original.docNo} routed to approver.` })}
              >
                <Send className="h-4 w-4" /> Send for review
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  const impactCards = [
    { label: "Schedule Impact", value: drawingChangeAnalysis.scheduleImpact, icon: CalendarClock, tone: "warning" },
    { label: "Cost Impact", value: drawingChangeAnalysis.costImpact, icon: Wallet, tone: "danger" },
    { label: "Procurement Impact", value: drawingChangeAnalysis.procurementImpact, icon: Package, tone: "info" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Engineering & Document Intelligence"
        description="Document register, revision control and AI-driven drawing change analysis for GreenSun Solar Park."
        icon={<FileStack className="h-5 w-5" />}
        breadcrumbs={[{ label: "Command Centre", to: "/command-centre" }, { label: "Documents" }]}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={refresh}>
              <RefreshCw className={refreshing ? "animate-spin" : ""} />
              {refreshing ? "Refreshing" : "Refresh"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.success("Upload started", { description: "Drag drawings into the register or pick from your device." })}
            >
              <Upload />
              Upload
            </Button>
            <Button
              variant="gradient"
              size="sm"
              onClick={() => toast.success("Register exported", { description: "Document register exported as XLSX." })}
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
          {documentKpis.map((kpi, i) => (
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

      {/* Tabs */}
      <Tabs defaultValue="register" className="space-y-4">
        <div className="no-scrollbar -mx-1 overflow-x-auto px-1">
          <TabsList className="w-max min-w-full justify-start">
            <TabsTrigger value="register" className="whitespace-nowrap">
              <FileText className="h-4 w-4" /> Document Register
            </TabsTrigger>
            <TabsTrigger value="revisions" className="whitespace-nowrap">
              <History className="h-4 w-4" /> Revision Tracker
            </TabsTrigger>
            <TabsTrigger value="comparison" className="whitespace-nowrap">
              <GitCompareArrows className="h-4 w-4" /> Drawing Comparison
            </TabsTrigger>
            <TabsTrigger value="ai" className="whitespace-nowrap">
              <Sparkles className="h-4 w-4" /> AI Change Analysis
            </TabsTrigger>
          </TabsList>
        </div>

        {/* --- Document Register --- */}
        <TabsContent value="register">
          <motion.div variants={fadeInUp} initial="hidden" animate="show">
            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Master Document Register
                </CardTitle>
                <Badge variant="neutral">{docRegister.length} of 1,284 shown</Badge>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={columns}
                  data={docRegister}
                  searchKey="docNo"
                  searchPlaceholder="Search by doc no, title, discipline…"
                  pageSize={8}
                />
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* --- Revision Tracker --- */}
        <TabsContent value="revisions">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
            {/* Timeline */}
            <motion.div variants={fadeInUp} initial="hidden" animate="show" className="lg:col-span-3">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-4 w-4 text-primary" />
                    Approval Workflow — MMS-STR-014
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative pl-2">
                    {documentWorkflow.map((stage, i) => {
                      const Icon = workflowIcons[i];
                      const done = i < currentStage;
                      const active = i === currentStage;
                      const last = i === documentWorkflow.length - 1;
                      return (
                        <motion.div
                          key={stage}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.08 * i, duration: 0.4 }}
                          className="relative flex gap-4 pb-7 last:pb-0"
                        >
                          {!last && (
                            <span
                              className={`absolute left-[18px] top-9 h-[calc(100%-1.5rem)] w-0.5 ${done ? "bg-primary" : "bg-border"}`}
                            />
                          )}
                          <div
                            className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                              done
                                ? "border-primary bg-primary text-white"
                                : active
                                ? "border-accent bg-accent/10 text-accent"
                                : "border-border bg-muted text-muted-foreground"
                            }`}
                          >
                            {active && (
                              <span className="absolute inset-0 animate-ping rounded-full bg-accent/30" />
                            )}
                            {done ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                          </div>
                          <div className="min-w-0 pt-1">
                            <div className="flex items-center gap-2">
                              <p className={`font-medium ${active ? "text-accent" : ""}`}>{stage}</p>
                              {active && <Badge variant="accent">Current</Badge>}
                              {done && <Badge variant="success">Done</Badge>}
                            </div>
                            <p className="mt-0.5 text-xs text-muted-foreground">{workflowMeta[i].note}</p>
                            <p className="mt-0.5 text-[11px] font-medium text-muted-foreground">{workflowMeta[i].date}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Revision history */}
            <motion.div variants={fadeInUp} initial="hidden" animate="show" className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader className="flex-row items-center justify-between space-y-0">
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-accent" />
                    Revision History
                  </CardTitle>
                  <Badge variant="neutral">Rev-A → Rev-C</Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  {revisionHistory.map((r, i) => (
                    <div key={r.rev}>
                      <div className="flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-muted/40">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted font-mono text-[11px] font-bold">
                          {r.rev.replace("Rev-", "")}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono text-xs font-semibold">{r.rev}</span>
                            <StatusBadge status={r.status} />
                          </div>
                          <p className="mt-0.5 text-xs text-muted-foreground">{r.note}</p>
                          <p className="mt-0.5 text-[11px] text-muted-foreground">
                            {formatDate(r.date)} · {r.author}
                          </p>
                        </div>
                      </div>
                      {i < revisionHistory.length - 1 && <Separator className="my-1" />}
                    </div>
                  ))}
                  <Button
                    variant="soft"
                    className="w-full"
                    onClick={() => toast.info("Comparing revisions", { description: "Rev-B vs Rev-C opened in Drawing Comparison." })}
                  >
                    <GitCompareArrows className="h-4 w-4" /> Compare Rev-B vs Rev-C
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        {/* --- Drawing Comparison --- */}
        <TabsContent value="comparison">
          <motion.div variants={fadeInUp} initial="hidden" animate="show">
            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <CardTitle className="flex items-center gap-2">
                  <GitCompareArrows className="h-4 w-4 text-primary" />
                  MMS-STR-014 — Rev-B vs Rev-C
                </CardTitle>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  Overlay
                  <Switch checked={overlay} onCheckedChange={setOverlay} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 items-stretch gap-3 lg:grid-cols-[1fr_auto_1fr]">
                  <DrawingPanel rev="Rev-B" label="Previous · AFC" tone="border-border" />

                  {/* Middle strip */}
                  <div className="flex flex-col items-center justify-center gap-3 lg:w-40">
                    <div className="hidden h-full w-0.5 bg-gradient-to-b from-transparent via-accent/40 to-transparent lg:block" />
                    <div className="w-full rounded-xl border border-accent/30 bg-accent/5 p-3 text-center">
                      <div className="mx-auto mb-1.5 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand text-white">
                        <GitCompareArrows className="h-4 w-4" />
                      </div>
                      <p className="font-display text-lg font-bold text-accent">4</p>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        Changes detected
                      </p>
                    </div>
                    <div className="hidden h-full w-0.5 bg-gradient-to-b from-transparent via-accent/40 to-transparent lg:block" />
                  </div>

                  <DrawingPanel rev="Rev-C" label="Latest · Under Review" tone="border-accent/40" highlight overlay={overlay} />
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-muted/30 p-3">
                  <div className="flex flex-wrap items-center gap-4 text-xs">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-sm bg-success" /> Added geometry
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-sm bg-destructive" /> Removed geometry
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-sm bg-warning" /> Modified dimension
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toast.success("Comparison exported", { description: "Overlay diff exported as PDF markup." })}
                  >
                    <Download className="h-4 w-4" /> Export diff
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* --- AI Change Analysis --- */}
        <TabsContent value="ai">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
            {/* Detected changes */}
            <motion.div variants={fadeInUp} initial="hidden" animate="show" className="lg:col-span-3">
              <Card className="h-full">
                <CardHeader className="flex-row items-center justify-between space-y-0">
                  <CardTitle className="flex items-center gap-2">
                    <GitCompareArrows className="h-4 w-4 text-primary" />
                    Detected Changes
                  </CardTitle>
                  <Badge variant="neutral" className="font-mono text-[11px]">
                    {drawingChangeAnalysis.document}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  {drawingChangeAnalysis.detected.map((d, i) => {
                    const isRemoval = d.delta.trim().startsWith("-");
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * i, duration: 0.35 }}
                        className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:bg-muted/30"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <CircleDot className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium">{d.item}</p>
                            <p className="text-xs text-muted-foreground">{d.type}</p>
                          </div>
                        </div>
                        <Badge variant={isRemoval ? "danger" : "success"} className="shrink-0 gap-1 font-mono">
                          {isRemoval ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                          {d.delta}
                        </Badge>
                      </motion.div>
                    );
                  })}
                </CardContent>
              </Card>
            </motion.div>

            {/* Impact cards */}
            <motion.div variants={fadeInUp} initial="hidden" animate="show" className="lg:col-span-2">
              <div className="grid grid-cols-1 gap-3">
                {impactCards.map((c) => {
                  const Icon = c.icon;
                  return (
                    <div
                      key={c.label}
                      className="rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-card"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                            c.tone === "danger"
                              ? "bg-destructive/10 text-destructive"
                              : c.tone === "warning"
                              ? "bg-warning/10 text-warning"
                              : "bg-primary/10 text-primary"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          {c.label}
                        </p>
                      </div>
                      <p className="mt-2 text-sm font-medium leading-snug">{c.value}</p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* AI summary */}
          <div className="mt-4">
            <AiInsightPanel
              title="AI Drawing Change Analysis"
              confidence={88}
              sections={[
                {
                  icon: FileWarning,
                  label: "What changed",
                  body: (
                    <>
                      Rev-C of <span className="font-medium">MMS-STR-014</span> introduces{" "}
                      <span className="font-medium">+420 MT structural steel</span> and{" "}
                      <span className="font-medium">+1.8 km DC cable</span> across Block A, driven by a
                      reconfigured module span and revised M24 bolt pattern.
                    </>
                  ),
                },
                {
                  icon: CalendarClock,
                  label: "Projected impact",
                  body: (
                    <>
                      Adds <span className="font-medium">+3 days</span> to MMS Assembly (Block A) and{" "}
                      <span className="font-medium">₹3.8 Cr</span> cost via change order CO-007. A fresh RFQ is
                      required for steel and cable before procurement can proceed.
                    </>
                  ),
                },
                {
                  icon: Sparkles,
                  label: "Recommended action",
                  body: "Raise change order CO-007, freeze Rev-B fabrication for Block A, and issue an expedited RFQ to shortlisted steel vendors to protect the critical path.",
                },
              ]}
              actions={
                <>
                  <Button
                    variant="gradient"
                    size="sm"
                    onClick={() => toast.success("Change order raised", { description: "CO-007 created and routed to Cost Control for approval." })}
                  >
                    <ArrowUpRight className="h-4 w-4" /> Raise Change Order
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigate("/procurement")}>
                    <Package className="h-4 w-4" /> Open Procurement
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => navigate("/cost")}>
                    View cost impact <ArrowRight className="h-4 w-4" />
                  </Button>
                </>
              }
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function DrawingPanel({
  rev,
  label,
  tone,
  highlight,
  overlay = true,
}: {
  rev: string;
  label: string;
  tone: string;
  highlight?: boolean;
  overlay?: boolean;
}) {
  return (
    <div className={`overflow-hidden rounded-xl border ${tone} bg-card`}>
      <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <FileStack className="h-4 w-4 text-muted-foreground" />
          <span className="font-mono text-xs font-semibold">{rev}</span>
        </div>
        <Badge variant={highlight ? "accent" : "neutral"}>{label}</Badge>
      </div>
      <div className="relative aspect-[4/3] w-full bg-[linear-gradient(hsl(var(--border))_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border))_1px,transparent_1px)] bg-[size:18px_18px]">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
              highlight ? "bg-gradient-brand text-white shadow-glow" : "bg-muted text-muted-foreground"
            }`}
          >
            <FileStack className="h-7 w-7" />
          </div>
          <p className="text-sm font-medium">Blueprint {rev}</p>
          <p className="max-w-[14rem] text-xs text-muted-foreground">
            MMS Structural GA — Block A · rendered preview placeholder
          </p>
        </div>
        {highlight && overlay && (
          <>
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute left-[22%] top-[28%] h-10 w-16 rounded-sm border-2 border-success bg-success/10"
            />
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.32 }}
              className="absolute bottom-[22%] right-[24%] h-9 w-12 rounded-sm border-2 border-warning bg-warning/10"
            />
          </>
        )}
      </div>
    </div>
  );
}
