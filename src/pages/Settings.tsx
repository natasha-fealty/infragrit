import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { ColumnDef } from "@tanstack/react-table";
import { motion } from "framer-motion";
import {
  Settings as SettingsIcon,
  Users as UsersIcon,
  ShieldCheck,
  Database,
  SlidersHorizontal,
  Plug,
  Bell,
  Sparkles,
  ScrollText,
  UserPlus,
  MoreHorizontal,
  Pencil,
  Ban,
  Plus,
  Save,
  RefreshCw,
  ArrowRight,
  Boxes,
  Network,
  Layers,
  Package,
  MapPin,
  Truck,
  Wallet,
  Wrench,
  Building2,
  Mail,
  Smartphone,
  MessageSquare,
  Globe,
  Check,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/Badges";
import { StaggerGroup, StaggerItem, fadeInUp } from "@/components/shared/motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { users, roles, thresholds, masters, auditLogs } from "@/mock/data";
import { project } from "@/mock/project";
import { useRefresh } from "@/hooks/useSimulatedLoad";
import { initials, formatNumber } from "@/lib/utils";
import { toneHex } from "@/lib/tone";
import type { HealthTone, UserRow } from "@/types";

/* ---------------------------------------------------------------- */
/* Static config                                                    */
/* ---------------------------------------------------------------- */

const tabs = [
  { value: "users", label: "Users", icon: UsersIcon },
  { value: "roles", label: "Roles", icon: ShieldCheck },
  { value: "masters", label: "Masters", icon: Database },
  { value: "thresholds", label: "Thresholds", icon: SlidersHorizontal },
  { value: "integrations", label: "Integrations", icon: Plug },
  { value: "notifications", label: "Notifications", icon: Bell },
  { value: "ai", label: "AI Configuration", icon: Sparkles },
  { value: "audit", label: "Audit Logs", icon: ScrollText },
];

const masterIcons: Record<string, LucideIcon> = {
  "Activity Master": Layers,
  "WBS Master": Network,
  "Resource Master": UsersIcon,
  "Material Master": Package,
  "Vendor Master": Truck,
  "Equipment Master": Wrench,
  "Location Master": MapPin,
  "Cost Head Master": Wallet,
};

const roleNames = [
  "Admin",
  "Project Director",
  "Project Manager",
  "Planning Engineer",
  "QA Engineer",
  "HSE Officer",
  "Procurement Engineer",
  "Viewer",
];

const notificationPrefs = [
  { key: "email", label: "Email notifications", desc: "Alerts & digests to your inbox", icon: Mail, on: true },
  { key: "inapp", label: "In-app notifications", desc: "Bell alerts inside InfraGrit", icon: Bell, on: true },
  { key: "sms", label: "SMS alerts", desc: "Critical alerts via text message", icon: Smartphone, on: false },
  { key: "whatsapp", label: "WhatsApp updates", desc: "Field summaries to WhatsApp", icon: MessageSquare, on: true },
  { key: "critical", label: "Critical only", desc: "Suppress low & medium severity", icon: ShieldCheck, on: false },
  { key: "digest", label: "Daily digest", desc: "Consolidated 07:00 IST summary", icon: Mail, on: true },
];

const notifyTone = (t: string): HealthTone =>
  t === "danger" || t === "warning" || t === "success" ? (t as HealthTone) : "neutral";

/* ---------------------------------------------------------------- */
/* Reusable rows                                                    */
/* ---------------------------------------------------------------- */

function ToggleRow({
  icon: Icon,
  label,
  desc,
  defaultChecked,
  onCheckedChange,
}: {
  icon: LucideIcon;
  label: string;
  desc: string;
  defaultChecked?: boolean;
  onCheckedChange?: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/40">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs text-muted-foreground">{desc}</p>
        </div>
      </div>
      <Switch defaultChecked={defaultChecked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Page                                                             */
/* ---------------------------------------------------------------- */

export default function Settings() {
  const navigate = useNavigate();
  const [refreshing, refresh] = useRefresh();
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("");

  const saved = (title: string, description: string) => toast.success(title, { description });

  const userColumns: ColumnDef<UserRow>[] = [
    {
      accessorKey: "name",
      header: "User",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-[11px]">{initials(row.original.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{row.original.name}</p>
            <p className="truncate text-xs text-muted-foreground">{row.original.email}</p>
          </div>
        </div>
      ),
    },
    { accessorKey: "role", header: "Role", cell: ({ row }) => <span className="text-sm">{row.original.role}</span> },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "lastActive",
      header: "Last Active",
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.lastActive}</span>,
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{row.original.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => saved("User updated", `Opened editor for ${row.original.name}.`)}
              >
                <Pencil className="h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  toast.success("Access suspended", {
                    description: `${row.original.name} can no longer sign in.`,
                  })
                }
              >
                <Ban className="h-4 w-4" /> Suspend
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  const auditColumns: ColumnDef<(typeof auditLogs)[number]>[] = [
    {
      accessorKey: "user",
      header: "User",
      cell: ({ row }) => <span className="text-sm font-medium">{row.original.user}</span>,
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.action}</span>,
    },
    {
      accessorKey: "when",
      header: "Timestamp",
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground">{row.original.when}</span>
      ),
    },
    {
      accessorKey: "ip",
      header: "IP Address",
      cell: ({ row }) => (
        <Badge variant="neutral" className="font-mono text-[11px]">
          {row.original.ip}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage users, roles, master data, thresholds and platform configuration."
        icon={<SettingsIcon className="h-5 w-5" />}
        breadcrumbs={[{ label: "InfraGrit", to: "/command-centre" }, { label: "Settings" }]}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={refresh}>
              <RefreshCw className={refreshing ? "animate-spin" : ""} />
              {refreshing ? "Refreshing" : "Refresh"}
            </Button>
            <Button
              variant="gradient"
              size="sm"
              onClick={() => saved("Changes saved", "All configuration updates applied to the workspace.")}
            >
              <Save />
              Save Changes
            </Button>
          </>
        }
      />

      {/* Profile / Org summary */}
      <motion.div variants={fadeInUp} initial="hidden" animate="show">
        <Card className="relative overflow-hidden">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
          <CardContent className="relative flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-card">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-lg font-bold tracking-tight">InfraGrit</h2>
                  <Badge variant="info" className="text-[10px] uppercase">
                    {project.environment}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {project.name} · {project.capacity} · {project.location}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 sm:gap-6 sm:text-right">
              {[
                { label: "Workspace", value: project.epc },
                { label: "Project Code", value: project.code },
                { label: "Version", value: project.version },
              ].map((m) => (
                <div key={m.label}>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    {m.label}
                  </p>
                  <p className="mt-0.5 text-sm font-semibold">{m.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="users" className="space-y-4">
        <div className="no-scrollbar -mx-1 overflow-x-auto px-1 pb-1">
          <TabsList className="h-auto w-max min-w-full justify-start">
            {tabs.map((t) => (
              <TabsTrigger key={t.value} value={t.value} className="whitespace-nowrap">
                <t.icon className="h-4 w-4" />
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* ---------------- USERS ---------------- */}
        <TabsContent value="users">
          <Card>
            <CardHeader className="flex-row flex-wrap items-center justify-between gap-3 space-y-0">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <UsersIcon className="h-4 w-4 text-primary" />
                  Users & Access
                </CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  {users.length} members across the GreenSun Solar Park workspace.
                </p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="gradient" size="sm">
                    <UserPlus /> Invite User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite a new user</DialogTitle>
                    <DialogDescription>
                      Send an invitation to join the InfraGrit workspace.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="inv-name">Full name</Label>
                      <Input
                        id="inv-name"
                        placeholder="e.g. Anjali Verma"
                        value={inviteName}
                        onChange={(e) => setInviteName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="inv-email">Email address</Label>
                      <Input
                        id="inv-email"
                        type="email"
                        placeholder="name@infragrit.com"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Role</Label>
                      <Select value={inviteRole} onValueChange={setInviteRole}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          {roleNames.map((r) => (
                            <SelectItem key={r} value={r}>
                              {r}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="ghost">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button
                        variant="gradient"
                        onClick={() =>
                          saved(
                            "Invitation sent",
                            `${inviteName || "New user"} invited as ${inviteRole || "Viewer"}.`
                          )
                        }
                      >
                        <Mail /> Send Invite
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={userColumns}
                data={users}
                searchKey="name"
                searchPlaceholder="Search users…"
                pageSize={8}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* ---------------- ROLES ---------------- */}
        <TabsContent value="roles">
          <Card>
            <CardHeader className="flex-row flex-wrap items-center justify-between gap-3 space-y-0">
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Roles & Permissions
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => saved("Role created", "New role added to the access model.")}
              >
                <Plus /> Add Role
              </Button>
            </CardHeader>
            <CardContent>
              <StaggerGroup className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {roles.map((role) => (
                  <StaggerItem key={role.id}>
                    <div className="group flex h-full flex-col justify-between rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-card">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium">{role.name}</p>
                          <Badge variant="secondary" className="shrink-0">
                            {role.users} {role.users === 1 ? "user" : "users"}
                          </Badge>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">{role.permissions}</p>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex -space-x-2">
                          {Array.from({ length: Math.min(role.users, 4) }).map((_, i) => (
                            <span
                              key={i}
                              className="h-6 w-6 rounded-full border-2 border-card bg-gradient-brand"
                            />
                          ))}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => saved("Permissions", `Editing permissions for ${role.name}.`)}
                        >
                          Configure <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ---------------- MASTERS ---------------- */}
        <TabsContent value="masters">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-4 w-4 text-primary" />
                Master Data Management
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                A single, harmonized common master-data model powers every module — the Data
                Harmonization layer maps source systems (SAP, Primavera, Odoo) to these masters.
              </p>
            </CardHeader>
            <CardContent>
              <StaggerGroup className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {masters.map((m) => {
                  const Icon = masterIcons[m.name] ?? Boxes;
                  return (
                    <StaggerItem key={m.name}>
                      <div className="group flex h-full flex-col justify-between rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-card">
                        <div className="flex items-start justify-between">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Icon className="h-5 w-5" />
                          </div>
                          <span className="font-display text-2xl font-bold tracking-tight">
                            {formatNumber(m.count)}
                          </span>
                        </div>
                        <div className="mt-3">
                          <p className="text-sm font-medium">{m.name}</p>
                          <p className="text-xs text-muted-foreground">records maintained</p>
                        </div>
                        <Button
                          variant="soft"
                          size="sm"
                          className="mt-3 w-full"
                          onClick={() => saved("Master data", `Opening ${m.name} for management.`)}
                        >
                          Manage
                        </Button>
                      </div>
                    </StaggerItem>
                  );
                })}
              </StaggerGroup>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ---------------- THRESHOLDS ---------------- */}
        <TabsContent value="thresholds">
          <Card>
            <CardHeader className="flex-row flex-wrap items-center justify-between gap-3 space-y-0">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-primary" />
                  Alert Thresholds
                </CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  Configure the trigger points for automated AI & rule-based alerts.
                </p>
              </div>
              <Button
                variant="gradient"
                size="sm"
                onClick={() => saved("Thresholds saved", "Alert thresholds updated across all modules.")}
              >
                <Save /> Save Thresholds
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {thresholds.map((t) => {
                const tone = notifyTone(t.tone);
                return (
                  <div
                    key={t.id}
                    className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ background: toneHex[tone] }}
                      />
                      <div>
                        <p className="text-sm font-medium">{t.metric}</p>
                        <p className="text-xs text-muted-foreground">Breach triggers a predictive alert</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Input defaultValue={t.value} className="h-9 w-32 font-medium" />
                      <Switch defaultChecked />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ---------------- INTEGRATIONS ---------------- */}
        <TabsContent value="integrations">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <motion.div variants={fadeInUp} initial="hidden" animate="show" className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader className="flex-row flex-wrap items-center justify-between gap-3 space-y-0">
                  <CardTitle className="flex items-center gap-2">
                    <Plug className="h-4 w-4 text-primary" />
                    Connected Systems
                  </CardTitle>
                  <Badge variant="success" className="gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {project.integrationHealth}% healthy
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    6 of 8 source connectors are live — Primavera P6, SAP ERP, SharePoint, Aconex and
                    more feed the Data Harmonization layer. Manage individual connectors, sync logs and
                    field mappings in the Integration Hub.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Primavera P6", "SAP ERP", "Odoo", "SharePoint", "Aconex", "Google Drive"].map((c) => (
                      <Badge key={c} variant="neutral" className="gap-1">
                        <Check className="h-3 w-3 text-success" />
                        {c}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="soft" className="w-full" onClick={() => navigate("/integration")}>
                    Open Integration Hub
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp} initial="hidden" animate="show">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 text-primary" />
                    Sync Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium">Auto-sync</p>
                      <p className="text-xs text-muted-foreground">Keep data continuously refreshed</p>
                    </div>
                    <Switch
                      defaultChecked
                      onCheckedChange={(v) =>
                        saved("Auto-sync " + (v ? "enabled" : "disabled"), "Connector sync preference updated.")
                      }
                    />
                  </div>
                  <Separator />
                  <div className="space-y-1.5">
                    <Label>Sync frequency</Label>
                    <Select
                      defaultValue="15m"
                      onValueChange={(v) => saved("Frequency updated", `Connectors will sync every ${v}.`)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5m">Every 5 minutes</SelectItem>
                        <SelectItem value="15m">Every 15 minutes</SelectItem>
                        <SelectItem value="1h">Hourly</SelectItem>
                        <SelectItem value="6h">Every 6 hours</SelectItem>
                        <SelectItem value="24h">Daily</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground">
                    Last full sync completed {project.lastRefreshed}.
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        {/* ---------------- NOTIFICATIONS ---------------- */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader className="flex-row flex-wrap items-center justify-between gap-3 space-y-0">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-primary" />
                  Notification Preferences
                </CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  Choose how and when InfraGrit reaches you.
                </p>
              </div>
              <Button
                variant="gradient"
                size="sm"
                onClick={() => saved("Preferences saved", "Notification channels updated.")}
              >
                <Save /> Save Preferences
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {notificationPrefs.map((p) => (
                  <ToggleRow
                    key={p.key}
                    icon={p.icon}
                    label={p.label}
                    desc={p.desc}
                    defaultChecked={p.on}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ---------------- AI CONFIGURATION ---------------- */}
        <TabsContent value="ai">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <motion.div variants={fadeInUp} initial="hidden" animate="show" className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader className="flex-row flex-wrap items-center justify-between gap-3 space-y-0">
                  <CardTitle className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-brand text-white">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    AI Configuration
                  </CardTitle>
                  <Badge variant="accent" className="gap-1">
                    Model v3.2 active
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ToggleRow
                    icon={Sparkles}
                    label="Enable predictions"
                    desc="Run predictive models for COD, cost & risk"
                    defaultChecked
                  />
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label>Prediction confidence threshold</Label>
                      <Select defaultValue="80">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="70">70% — more signals</SelectItem>
                          <SelectItem value="80">80% — balanced</SelectItem>
                          <SelectItem value="90">90% — high precision</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Prediction model</Label>
                      <Select defaultValue="gpt5">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gpt5">GPT-5</SelectItem>
                          <SelectItem value="claude">Claude</SelectItem>
                          <SelectItem value="gemini">Gemini</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Retraining frequency</Label>
                      <Select defaultValue="monthly">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end">
                      <Button
                        variant="gradient"
                        className="w-full"
                        onClick={() => saved("AI configuration applied", "Model settings updated for GreenSun Solar Park.")}
                      >
                        <Check /> Apply
                      </Button>
                    </div>
                  </div>
                  <Separator />
                  <ToggleRow
                    icon={ShieldCheck}
                    label="Require human override"
                    desc="Recommendations need approval before execution"
                    defaultChecked
                  />
                  <ToggleRow
                    icon={Globe}
                    label="Explainability"
                    desc="Show data sources & rationale on every insight"
                    defaultChecked
                  />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp} initial="hidden" animate="show">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-accent" />
                    Active Model
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-xl border border-border bg-muted/30 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Deployed
                    </p>
                    <p className="mt-1 font-display text-xl font-bold">AI Schedule Model v3.2</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Deployed today · trained on GreenSun + 12 reference projects
                    </p>
                  </div>
                  {[
                    { label: "Overall AI confidence", value: `${project.aiConfidence}%` },
                    { label: "Data completeness", value: `${project.dataCompleteness}%` },
                    { label: "Predictions served (30d)", value: "1,842" },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{s.label}</span>
                      <span className="font-semibold">{s.value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        {/* ---------------- AUDIT LOGS ---------------- */}
        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ScrollText className="h-4 w-4 text-primary" />
                Audit Logs
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Immutable record of every configuration and approval action.
              </p>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={auditColumns}
                data={auditLogs}
                searchKey="user"
                searchPlaceholder="Search audit trail…"
                pageSize={8}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
