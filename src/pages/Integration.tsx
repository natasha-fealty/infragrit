import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Plug,
  RefreshCw,
  Download,
  Plus,
  Cable,
  UploadCloud,
  Keyboard,
  Sparkles,
  Activity,
  Users,
  Truck,
  Package,
  ShieldCheck,
  HardHat,
  FileText,
  Mic,
  MessageCircle,
  Plane,
  ScanLine,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Link2,
  Link2Off,
  GitCompareArrows,
  FileSpreadsheet,
  FileCode,
  Image as ImageIcon,
  FileDown,
  CircleDot,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StaggerGroup, StaggerItem, fadeInUp } from "@/components/shared/motion";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/Badges";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  connectors,
  uploadHistory,
  uploadTemplates,
  manualEntryForms,
  aiIngestionChannels,
} from "@/mock/data";
import type { Connector } from "@/types";
import { useRefresh } from "@/hooks/useSimulatedLoad";
import { formatNumber, cn } from "@/lib/utils";

/* -------------------------------------------------------------- */
/* Icon maps                                                      */
/* -------------------------------------------------------------- */
const manualIcons: Record<string, LucideIcon> = {
  activity: Activity,
  users: Users,
  truck: Truck,
  package: Package,
  "shield-check": ShieldCheck,
  "hard-hat": HardHat,
};

const aiIcons: Record<string, LucideIcon> = {
  pdf: FileText,
  voice: Mic,
  whatsapp: MessageCircle,
  drone: Plane,
  ocr: ScanLine,
};

const aiGradients: Record<string, string> = {
  pdf: "from-blue-500 to-indigo-600",
  voice: "from-violet-500 to-fuchsia-600",
  whatsapp: "from-emerald-500 to-teal-600",
  drone: "from-amber-500 to-orange-600",
  ocr: "from-cyan-500 to-sky-600",
};

const aiToast: Record<string, { title: string; description: string }> = {
  pdf: { title: "Parsing document…", description: "Extracting DPR & BOQ tables via AI." },
  voice: { title: "Listening…", description: "Speak a field update to log it hands-free." },
  whatsapp: { title: "Reading messages…", description: "Structuring supervisor field updates." },
  drone: { title: "Analysing imagery…", description: "Computing progress % from aerial flight." },
  ocr: { title: "Scanning…", description: "Extracting text from invoices & GRNs." },
};

const supportedFiles: { label: string; icon: LucideIcon }[] = [
  { label: "XLSX", icon: FileSpreadsheet },
  { label: "CSV", icon: FileSpreadsheet },
  { label: "XML", icon: FileCode },
  { label: "Primavera XER", icon: FileCode },
  { label: "PDF", icon: FileText },
  { label: "Images", icon: ImageIcon },
];

/* Field-mapping rows shown in the Map Fields dialog */
const fieldMap = [
  { source: "activity_id", master: "WBS Activity ID" },
  { source: "act_name", master: "Activity Name" },
  { source: "bl_finish", master: "Baseline Finish" },
  { source: "pct_complete", master: "% Complete" },
  { source: "cost_code", master: "Cost Account" },
];

/* -------------------------------------------------------------- */
/* Connector status pill                                          */
/* -------------------------------------------------------------- */
const statusPill: Record<
  Connector["status"],
  { cls: string; dot: string; pulse: boolean }
> = {
  Connected: {
    cls: "bg-success/10 text-success ring-1 ring-success/20",
    dot: "bg-success",
    pulse: true,
  },
  Syncing: {
    cls: "bg-warning/10 text-warning ring-1 ring-warning/20",
    dot: "bg-warning",
    pulse: true,
  },
  Error: {
    cls: "bg-destructive/10 text-destructive ring-1 ring-destructive/20",
    dot: "bg-destructive",
    pulse: false,
  },
  Disconnected: {
    cls: "bg-muted text-muted-foreground ring-1 ring-border",
    dot: "bg-muted-foreground",
    pulse: false,
  },
};

function ConnectorStatus({ status }: { status: Connector["status"] }) {
  const s = statusPill[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
        s.cls
      )}
    >
      <span className="relative flex h-2 w-2">
        {s.pulse && (
          <span
            className={cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
              s.dot
            )}
          />
        )}
        <span className={cn("relative inline-flex h-2 w-2 rounded-full", s.dot)} />
      </span>
      {status}
    </span>
  );
}

/* -------------------------------------------------------------- */
/* Connector card                                                */
/* -------------------------------------------------------------- */
function ConnectorCard({ c }: { c: Connector }) {
  const [syncing, setSyncing] = useState(false);
  const [connected, setConnected] = useState(c.status !== "Disconnected");
  const healthTone: "success" | "warning" | "danger" =
    c.health >= 90 ? "success" : c.health >= 70 ? "warning" : "danger";

  const doSync = () => {
    setSyncing(true);
    toast.success(`Syncing ${c.name}`, { description: "Pulling latest records into InfraGrit." });
    setTimeout(() => setSyncing(false), 1600);
  };

  return (
    <Card className="group relative h-full overflow-hidden transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-elevated">
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/5 opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />
      <CardContent className="relative flex h-full flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-display text-sm font-bold text-white shadow-card"
              style={{ background: c.logoColor }}
            >
              {c.logoText}
            </div>
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-semibold leading-tight">{c.name}</p>
              <p className="text-xs text-muted-foreground">{c.category}</p>
            </div>
          </div>
          <ConnectorStatus status={syncing ? "Syncing" : c.status} />
        </div>

        <div className="grid grid-cols-2 gap-3 rounded-lg bg-muted/40 p-3">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Records
            </p>
            <p className="font-display text-base font-bold tabular-nums">
              {c.records > 0 ? formatNumber(c.records) : "—"}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Last Sync
            </p>
            <p className="truncate text-sm font-medium">{syncing ? "syncing…" : c.lastSync}</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Connector Health</span>
            <span className="font-semibold tabular-nums">{c.health}%</span>
          </div>
          <Progress value={c.health} tone={healthTone} className="h-1.5" />
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
          <Button
            size="sm"
            variant="soft"
            className="flex-1"
            disabled={syncing || !connected}
            onClick={doSync}
          >
            <RefreshCw className={syncing ? "animate-spin" : ""} />
            {syncing ? "Syncing" : "Sync Now"}
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <GitCompareArrows />
                Map Fields
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <GitCompareArrows className="h-4 w-4 text-primary" />
                  Field Mapping — {c.name}
                </DialogTitle>
                <DialogDescription>
                  Source fields are auto-harmonized to the InfraGrit master data model.
                </DialogDescription>
              </DialogHeader>
              <div className="overflow-hidden rounded-lg border border-border">
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 bg-muted/60 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  <span>{c.name} field</span>
                  <span />
                  <span>InfraGrit master</span>
                </div>
                <div className="divide-y divide-border">
                  {fieldMap.map((f) => (
                    <div
                      key={f.source}
                      className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 py-2 text-sm"
                    >
                      <code className="truncate rounded bg-muted px-1.5 py-0.5 text-xs">
                        {f.source}
                      </code>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="truncate font-medium">{f.master}</span>
                    </div>
                  ))}
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Close</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button
                    variant="gradient"
                    onClick={() =>
                      toast.success("Mapping saved", {
                        description: `${c.name} fields harmonized to master model.`,
                      })
                    }
                  >
                    Save mapping
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button
            size="sm"
            variant={connected ? "ghost" : "gradient"}
            onClick={() => {
              setConnected((v) => !v);
              toast.success(connected ? `${c.name} disconnected` : `${c.name} connected`, {
                description: connected
                  ? "Data ingestion paused for this source."
                  : "Handshake complete — ingestion resumed.",
              });
            }}
          >
            {connected ? <Link2Off /> : <Link2 />}
            {connected ? "Disconnect" : "Connect"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------- */
/* Manual entry form dialog                                       */
/* -------------------------------------------------------------- */
function ManualEntryCard({ form }: { form: (typeof manualEntryForms)[number] }) {
  const Icon = manualIcons[form.icon] ?? Activity;
  return (
    <StaggerItem>
      <Card className="group h-full transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-elevated">
        <CardContent className="flex h-full flex-col gap-3 p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-sm font-semibold">{form.label}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{form.desc}</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="soft" className="mt-auto w-full">
                Open Form
                <ArrowRight />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-primary" />
                  {form.label}
                </DialogTitle>
                <DialogDescription>{form.desc}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="me-block">Block / WBS</Label>
                  <Select defaultValue="block-c">
                    <SelectTrigger id="me-block">
                      <SelectValue placeholder="Select block" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="block-a">Block A — Piling</SelectItem>
                      <SelectItem value="block-b">Block B — Structures</SelectItem>
                      <SelectItem value="block-c">Block C — Module Mounting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="me-plan">Planned Qty</Label>
                    <Input id="me-plan" type="number" placeholder="e.g. 480" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="me-actual">Actual Qty</Label>
                    <Input id="me-actual" type="number" placeholder="e.g. 420" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button
                    variant="gradient"
                    onClick={() =>
                      toast.success(`${form.label} recorded`, {
                        description: "Entry saved to the InfraGrit data lake.",
                      })
                    }
                  >
                    Submit entry
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </StaggerItem>
  );
}

/* -------------------------------------------------------------- */
/* Upload history columns                                          */
/* -------------------------------------------------------------- */
type UploadRow = (typeof uploadHistory)[number];

const uploadColumns: ColumnDef<UploadRow>[] = [
  {
    accessorKey: "file",
    header: "File",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <FileSpreadsheet className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="font-medium">{row.original.file}</span>
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <Badge variant="neutral">{row.original.type}</Badge>,
  },
  {
    accessorKey: "rows",
    header: "Rows",
    cell: ({ row }) => <span className="tabular-nums">{formatNumber(row.original.rows)}</span>,
  },
  {
    accessorKey: "accepted",
    header: "Accepted",
    cell: ({ row }) => (
      <span className="tabular-nums font-medium text-success">
        {formatNumber(row.original.accepted)}
      </span>
    ),
  },
  {
    accessorKey: "rejected",
    header: "Rejected",
    cell: ({ row }) => {
      const r = row.original.rejected;
      return r > 0 ? (
        <Badge variant="danger" className="tabular-nums">
          {r}
        </Badge>
      ) : (
        <span className="tabular-nums text-muted-foreground">0</span>
      );
    },
  },
  {
    accessorKey: "when",
    header: "When",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.when}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    id: "report",
    header: "",
    cell: ({ row }) =>
      row.original.rejected > 0 ? (
        <Button
          size="sm"
          variant="ghost"
          className="text-destructive"
          onClick={() =>
            toast.error("Error report", {
              description: `${row.original.rejected} rows rejected in ${row.original.file}. Download available.`,
            })
          }
        >
          <AlertTriangle />
          Error Report
        </Button>
      ) : null,
  },
];

/* -------------------------------------------------------------- */
/* Page                                                           */
/* -------------------------------------------------------------- */
export default function Integration() {
  const [refreshing, refresh] = useRefresh();

  const connected = connectors.filter((c) => c.status === "Connected").length;
  const syncingCount = connectors.filter((c) => c.status === "Syncing").length;
  const errorCount = connectors.filter((c) => c.status === "Error").length;
  const totalRecords = connectors.reduce((s, c) => s + c.records, 0);

  const summary = [
    { label: "Connected", value: connected, icon: CheckCircle2, cls: "text-success", bg: "bg-success/10" },
    { label: "Syncing", value: syncingCount, icon: RefreshCw, cls: "text-warning", bg: "bg-warning/10" },
    { label: "Errors", value: errorCount, icon: AlertTriangle, cls: "text-destructive", bg: "bg-destructive/10" },
    { label: "Records Ingested", value: totalRecords, icon: CircleDot, cls: "text-primary", bg: "bg-primary/10" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Data Integration Hub"
        description="Zero Additional Reporting — every system, spreadsheet and voice note flows into InfraGrit automatically."
        icon={<Plug className="h-5 w-5" />}
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
                toast.success("Add connector", { description: "Browse the 40+ pre-built connector library." })
              }
            >
              <Plus />
              Add Connector
            </Button>
          </>
        }
      />

      <Tabs defaultValue="connectors">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="connectors">
            <Cable className="h-4 w-4" />
            Enterprise Connectors
          </TabsTrigger>
          <TabsTrigger value="upload">
            <UploadCloud className="h-4 w-4" />
            Bulk Upload
          </TabsTrigger>
          <TabsTrigger value="manual">
            <Keyboard className="h-4 w-4" />
            Manual Entry
          </TabsTrigger>
          <TabsTrigger value="ai">
            <Sparkles className="h-4 w-4" />
            AI Ingestion
          </TabsTrigger>
        </TabsList>

        {/* ---------- A · Enterprise Connectors ---------- */}
        <TabsContent value="connectors" className="space-y-5">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border shadow-card lg:grid-cols-4"
          >
            {summary.map((s) => (
              <div key={s.label} className="flex items-center gap-3 bg-card p-4">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", s.bg)}>
                  <s.icon className={cn("h-5 w-5", s.cls)} />
                </div>
                <div>
                  <p className="font-display text-xl font-bold tabular-nums">
                    <AnimatedCounter value={s.value} />
                  </p>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    {s.label}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>

          <StaggerGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {connectors.map((c) => (
              <StaggerItem key={c.id}>
                <ConnectorCard c={c} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        </TabsContent>

        {/* ---------- B · Bulk Upload ---------- */}
        <TabsContent value="upload" className="space-y-5">
          <motion.div variants={fadeInUp} initial="hidden" animate="show">
            <Card
              className="group cursor-pointer border-2 border-dashed border-border bg-muted/20 transition-colors hover:border-primary/50 hover:bg-primary/5"
              onClick={() =>
                toast.success("Upload started", {
                  description: "Auto-detecting schema and validating rows…",
                })
              }
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                toast.success("Files received", { description: "Validating and mapping to master model…" });
              }}
            >
              <CardContent className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-105">
                  <UploadCloud className="h-8 w-8" />
                </div>
                <div>
                  <p className="font-display text-base font-semibold">Drag &amp; drop or browse</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Drop BOQ, DPR, schedules or scans — InfraGrit auto-detects the format.
                  </p>
                </div>
                <div className="mt-1 flex flex-wrap justify-center gap-2">
                  {supportedFiles.map((f) => (
                    <span
                      key={f.label}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground"
                    >
                      <f.icon className="h-3.5 w-3.5" />
                      {f.label}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-2">
                <FileDown className="h-4 w-4 text-primary" />
                Download Templates
              </CardTitle>
              <span className="text-xs text-muted-foreground">Standardized import formats</span>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {uploadTemplates.map((t) => (
                  <Button
                    key={t}
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      toast.success("Template downloaded", { description: `${t} import template (.xlsx).` })
                    }
                  >
                    <FileDown />
                    {t}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UploadCloud className="h-4 w-4 text-primary" />
                Upload History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={uploadColumns}
                data={uploadHistory}
                searchKey="file"
                searchPlaceholder="Search uploads…"
                pageSize={8}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* ---------- C · Manual Entry ---------- */}
        <TabsContent value="manual" className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Keyboard className="h-4 w-4 text-primary" />
            Fast structured forms for the field — only where a system feed doesn&apos;t already exist.
          </div>
          <StaggerGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {manualEntryForms.map((f) => (
              <ManualEntryCard key={f.key} form={f} />
            ))}
          </StaggerGroup>
        </TabsContent>

        {/* ---------- D · AI Ingestion ---------- */}
        <TabsContent value="ai" className="space-y-4">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="show"
            className="flex items-center gap-2 rounded-xl border border-accent/20 bg-gradient-to-r from-accent/10 to-transparent p-4"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-brand text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="font-display text-sm font-semibold">The InfraGrit differentiator</p>
              <p className="text-xs text-muted-foreground">
                Turn unstructured field reality — PDFs, voice, WhatsApp, drone imagery — into structured project data.
              </p>
            </div>
          </motion.div>

          <StaggerGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {aiIngestionChannels.map((ch) => {
              const Icon = aiIcons[ch.key] ?? Sparkles;
              const grad = aiGradients[ch.key] ?? "from-primary to-accent";
              const t = aiToast[ch.key] ?? { title: "Running…", description: "Processing input." };
              return (
                <StaggerItem key={ch.key}>
                  <Card className="group relative h-full overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-elevated">
                    <div
                      className={cn(
                        "pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br opacity-20 blur-2xl transition-opacity group-hover:opacity-40",
                        grad
                      )}
                    />
                    <div className={cn("h-1 w-full bg-gradient-to-r", grad)} />
                    <CardContent className="relative flex h-full flex-col gap-3 p-5">
                      <div className="flex items-start justify-between">
                        <div
                          className={cn(
                            "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-card",
                            grad
                          )}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        <Badge variant="accent" className="gap-1">
                          <Sparkles className="h-3 w-3" />
                          {ch.stat}
                        </Badge>
                      </div>
                      <div>
                        <p className="font-display text-sm font-semibold">{ch.label}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{ch.desc}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="gradient"
                        className="mt-auto w-full"
                        onClick={() => toast.success(t.title, { description: t.description })}
                      >
                        <Sparkles />
                        Try it
                      </Button>
                    </CardContent>
                  </Card>
                </StaggerItem>
              );
            })}
          </StaggerGroup>

          <Separator />
          <p className="text-center text-xs text-muted-foreground">
            All AI-ingested data is confidence-scored and routed through data-quality checks before it reaches your dashboards.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
