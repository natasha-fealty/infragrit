import type { LucideIcon } from "lucide-react";

export type Trend = "up" | "down" | "flat";
export type Severity = "critical" | "high" | "medium" | "low";
export type HealthTone = "success" | "warning" | "danger" | "neutral";
export type StatusTone = "success" | "warning" | "danger" | "info" | "neutral";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  badge?: number;
  group?: string;
}

export interface KpiCard {
  id: string;
  title: string;
  value: string;
  sub?: string;
  delta?: string;
  trend?: Trend;
  tone?: HealthTone;
  icon?: LucideIcon;
  spark?: number[];
}

export interface HealthScore {
  label: string;
  score: number;
  tone: HealthTone;
}

export interface AiRecommendation {
  id: string;
  action: string;
  detail: string;
  priority: Severity;
  benefit: string;
  impact: string;
  confidence: number;
}

export interface AiPrediction {
  id: string;
  label: string;
  value: string;
  detail: string;
  confidence: number;
  tone: HealthTone;
}

export interface RiskItem {
  id: string;
  title: string;
  category: string;
  severity: Severity;
  probability: number;
  impactCr: number;
  owner: string;
  status: "Open" | "Mitigating" | "Closed";
  due: string;
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  category: string;
  source: string;
  severity: Severity;
  impact: string;
  recommendedAction: string;
  status: "New" | "Acknowledged" | "In Progress" | "Resolved";
  owner: string;
  minutesAgo: number;
}

export interface ActivityEntry {
  id: string;
  actor: string;
  action: string;
  target: string;
  module: string;
  minutesAgo: number;
  tone?: StatusTone;
}

export interface TimePoint {
  period: string;
  [key: string]: string | number;
}

export interface Milestone {
  id: string;
  name: string;
  planned: string;
  forecast: string;
  varianceDays: number;
  status: "On Track" | "At Risk" | "Delayed" | "Completed";
  progress: number;
}

export interface GanttTask {
  id: string;
  wbs: string;
  name: string;
  start: number; // day offset
  duration: number;
  progress: number;
  critical: boolean;
  package: string;
}

export interface Connector {
  id: string;
  name: string;
  category: string;
  status: "Connected" | "Syncing" | "Error" | "Disconnected";
  lastSync: string;
  records: number;
  health: number;
  logoColor: string;
  logoText: string;
}

export interface DocRow {
  id: string;
  docNo: string;
  title: string;
  discipline: string;
  revision: string;
  status: "Submitted" | "Under Review" | "Approved" | "AFC" | "As-Built";
  submitted: string;
  owner: string;
}

export interface PoRow {
  id: string;
  poNo: string;
  material: string;
  vendor: string;
  value: number;
  ordered: string;
  promised: string;
  status: "On Track" | "Delayed" | "Delivered" | "At Risk";
  agingDays: number;
}

export interface NcrRow {
  id: string;
  ncrNo: string;
  description: string;
  discipline: string;
  severity: Severity;
  raisedBy: string;
  status: "Open" | "In Progress" | "Closed";
  reworkCost: number;
  age: number;
}

export interface IncidentRow {
  id: string;
  refNo: string;
  type: "Near Miss" | "Unsafe Act" | "First Aid" | "Incident" | "LTI";
  location: string;
  severity: Severity;
  reportedBy: string;
  status: "Open" | "Investigating" | "Closed";
  date: string;
}

export interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Invited" | "Suspended";
  lastActive: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: string[];
  chips?: { label: string; value: string; tone?: HealthTone }[];
}

export interface UseCase {
  id: string;
  title: string;
  trigger: string;
  codDelay: string;
  costImpact: string;
  confidence: number;
  drivers: string[];
  flow: string[];
  recovery: { option: string; recovery: string }[];
}
