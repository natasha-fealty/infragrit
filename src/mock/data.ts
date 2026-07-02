import type {
  Alert,
  AiPrediction,
  AiRecommendation,
  ActivityEntry,
  Connector,
  DocRow,
  GanttTask,
  IncidentRow,
  Milestone,
  NcrRow,
  PoRow,
  RiskItem,
  TimePoint,
  UseCase,
  UserRow,
} from "@/types";

/* ------------------------------------------------------------------ */
/* COMMAND CENTRE                                                      */
/* ------------------------------------------------------------------ */

export const commandKpis = [
  {
    id: "schedule",
    title: "Schedule Performance",
    value: "8 days",
    sub: "behind plan",
    delta: "SPI 0.94",
    trend: "down" as const,
    tone: "warning" as const,
    metric: "6 critical activities delayed",
    spark: [92, 94, 93, 95, 96, 94, 93, 94],
  },
  {
    id: "cost",
    title: "Cost Performance",
    value: "₹1,271 Cr",
    sub: "forecast vs ₹1,250 Cr budget",
    delta: "+1.7% overrun",
    trend: "down" as const,
    tone: "warning" as const,
    metric: "CPI 0.97",
    spark: [100, 100, 101, 101, 102, 102, 101, 102],
  },
  {
    id: "procurement",
    title: "Procurement Performance",
    value: "7 POs",
    sub: "delayed",
    delta: "Vendor risk: High",
    trend: "down" as const,
    tone: "danger" as const,
    metric: "₹18.4 Cr material at risk",
    spark: [40, 44, 48, 52, 58, 61, 63, 66],
  },
  {
    id: "material",
    title: "Material Performance",
    value: "12 days",
    sub: "inventory sufficiency",
    delta: "Stockout risk: High",
    trend: "down" as const,
    tone: "danger" as const,
    metric: "3 critical material constraints",
    spark: [30, 28, 24, 20, 18, 15, 13, 12],
  },
  {
    id: "resource",
    title: "Resource Performance",
    value: "480",
    sub: "labour gap (headcount)",
    delta: "Productivity 82%",
    trend: "down" as const,
    tone: "warning" as const,
    metric: "4 equipment units short",
    spark: [88, 86, 85, 84, 83, 82, 82, 82],
  },
  {
    id: "hse",
    title: "HSE Performance",
    value: "2",
    sub: "open incidents",
    delta: "Severity index: Low",
    trend: "up" as const,
    tone: "success" as const,
    metric: "9 near misses this month",
    spark: [5, 4, 4, 3, 3, 2, 2, 2],
  },
  {
    id: "quality",
    title: "Quality Performance",
    value: "14",
    sub: "open NCRs",
    delta: "₹1.9 Cr rework cost",
    trend: "down" as const,
    tone: "warning" as const,
    metric: "Defect rate 2.4%",
    spark: [8, 9, 10, 12, 13, 14, 15, 14],
  },
  {
    id: "risk",
    title: "Risk & Issue Status",
    value: "9",
    sub: "active risks",
    delta: "4 high · 6 overdue actions",
    trend: "flat" as const,
    tone: "warning" as const,
    metric: "Risk exposure ₹22.6 Cr",
    spark: [6, 7, 7, 8, 8, 9, 9, 9],
  },
];

export const sCurve: TimePoint[] = [
  { period: "Jan", Planned: 4, Actual: 4, Forecast: 4 },
  { period: "Feb", Planned: 9, Actual: 8, Forecast: 8 },
  { period: "Mar", Planned: 16, Actual: 15, Forecast: 15 },
  { period: "Apr", Planned: 25, Actual: 23, Forecast: 23 },
  { period: "May", Planned: 35, Actual: 32, Forecast: 32 },
  { period: "Jun", Planned: 47, Actual: 43, Forecast: 43 },
  { period: "Jul", Planned: 58, Actual: 52, Forecast: 52 },
  { period: "Aug", Planned: 68, Actual: 62, Forecast: 61 },
  { period: "Sep", Planned: 78, Actual: null as unknown as number, Forecast: 71 },
  { period: "Oct", Planned: 87, Actual: null as unknown as number, Forecast: 82 },
  { period: "Nov", Planned: 94, Actual: null as unknown as number, Forecast: 91 },
  { period: "Dec", Planned: 100, Actual: null as unknown as number, Forecast: 98 },
];

export const costBurn: TimePoint[] = [
  { period: "Jan", Budget: 50, Actual: 48 },
  { period: "Feb", Budget: 120, Actual: 118 },
  { period: "Mar", Budget: 210, Actual: 208 },
  { period: "Apr", Budget: 330, Actual: 335 },
  { period: "May", Budget: 460, Actual: 470 },
  { period: "Jun", Budget: 590, Actual: 606 },
  { period: "Jul", Budget: 720, Actual: 742 },
  { period: "Aug", Budget: 830, Actual: 858 },
];

export const topDelayedActivities = [
  { activity: "Module Installation - Block A", delay: 8, package: "Solar Modules" },
  { activity: "Pile Driving - Block C", delay: 11, package: "Piling" },
  { activity: "Inverter Erection - PCU-3", delay: 9, package: "Power Systems" },
  { activity: "MMS Assembly - Block B", delay: 5, package: "Structures" },
  { activity: "Cable Trenching - Zone 4", delay: 4, package: "Cabling" },
];

export const aiPredictions: AiPrediction[] = [
  {
    id: "p1",
    label: "Predicted COD Delay",
    value: "8 days",
    detail: "Driven by module inventory exhaustion on critical path",
    confidence: 88,
    tone: "warning",
  },
  {
    id: "p2",
    label: "Forecast Cost Overrun",
    value: "₹21.3 Cr",
    detail: "Site overheads, LD exposure & labour retention",
    confidence: 84,
    tone: "warning",
  },
  {
    id: "p3",
    label: "Project Risk Score",
    value: "62 / 100",
    detail: "Elevated — procurement & schedule pressure",
    confidence: 90,
    tone: "danger",
  },
];

export const topRisks = [
  "Solar module inventory exhaustion (12-Aug)",
  "Piling productivity 33% below plan",
  "Inverter delivery slippage — PCU-3",
  "Labour shortage in structures package",
  "Monsoon window impacting earthworks",
];

export const aiRecommendations: AiRecommendation[] = [
  {
    id: "r1",
    action: "Increase module installation crews from 6 to 8",
    detail: "Redeploy 2 crews from completed Block D to Block A.",
    priority: "critical",
    benefit: "+4 days recovery",
    impact: "COD",
    confidence: 86,
  },
  {
    id: "r2",
    action: "Expedite balance module delivery via air freight",
    detail: "Charter partial shipment of 40,000 modules from vendor.",
    priority: "high",
    benefit: "+3 days recovery",
    impact: "Schedule + Cost",
    confidence: 78,
  },
  {
    id: "r3",
    action: "Re-sequence to prioritise Blocks C & D",
    detail: "Move to zones where module inventory is available.",
    priority: "high",
    benefit: "+2 days recovery",
    impact: "Schedule",
    confidence: 82,
  },
  {
    id: "r4",
    action: "Mobilise 2 additional piling rigs",
    detail: "Close the 33% productivity gap in Block C piling.",
    priority: "medium",
    benefit: "+5 days recovery",
    impact: "Critical Path",
    confidence: 74,
  },
];

export const risks: RiskItem[] = [
  { id: "RSK-014", title: "Solar module inventory exhaustion", category: "Procurement", severity: "critical", probability: 82, impactCr: 4.16, owner: "R. Sharma", status: "Mitigating", due: "2026-08-12" },
  { id: "RSK-011", title: "Piling productivity below target", category: "Schedule", severity: "high", probability: 70, impactCr: 2.75, owner: "A. Nair", status: "Open", due: "2026-08-05" },
  { id: "RSK-018", title: "Inverter delivery slippage (PCU-3)", category: "Procurement", severity: "high", probability: 65, impactCr: 3.45, owner: "S. Iyer", status: "Open", due: "2026-08-18" },
  { id: "RSK-009", title: "Structures labour shortage", category: "Resource", severity: "high", probability: 60, impactCr: 3.0, owner: "V. Rao", status: "Mitigating", due: "2026-07-28" },
  { id: "RSK-021", title: "High NCR & rework trend", category: "Quality", severity: "medium", probability: 55, impactCr: 3.6, owner: "M. Gupta", status: "Open", due: "2026-08-10" },
  { id: "RSK-006", title: "Monsoon impact on earthworks", category: "Schedule", severity: "medium", probability: 50, impactCr: 1.2, owner: "A. Nair", status: "Mitigating", due: "2026-08-30" },
  { id: "RSK-023", title: "Cable price escalation", category: "Cost", severity: "medium", probability: 45, impactCr: 1.8, owner: "S. Iyer", status: "Open", due: "2026-09-05" },
  { id: "RSK-004", title: "Grid connection approval delay", category: "External", severity: "high", probability: 40, impactCr: 5.0, owner: "P. Menon", status: "Open", due: "2026-10-01" },
  { id: "RSK-027", title: "Transformer FAT reschedule", category: "Quality", severity: "low", probability: 30, impactCr: 0.9, owner: "M. Gupta", status: "Closed", due: "2026-07-20" },
];

export const alerts: Alert[] = [
  { id: "ALT-101", title: "Solar module inventory expected to exhaust on 12-Aug", description: "Remaining delivery scheduled for 15-Aug. Module Installation is on the critical path.", category: "Procurement", source: "AI Prediction Engine", severity: "critical", impact: "8-day COD delay · ₹4.16 Cr", recommendedAction: "Expedite delivery / re-sequence blocks", status: "New", owner: "R. Sharma", minutesAgo: 6 },
  { id: "ALT-098", title: "Piling productivity 33% below plan in Block C", description: "Actual 10,000/day vs planned 15,000/day for 5 consecutive days.", category: "Schedule", source: "Site Progress", severity: "critical", impact: "11-day slippage · ₹2.75 Cr", recommendedAction: "Mobilise 2 additional piling rigs", status: "Acknowledged", owner: "A. Nair", minutesAgo: 42 },
  { id: "ALT-095", title: "Inverter delivery slippage detected — PCU-3", description: "Vendor confirmed 9-day slip against promised date.", category: "Procurement", source: "SAP Connector", severity: "high", impact: "9-day delay · ₹3.45 Cr", recommendedAction: "Escalate to vendor / evaluate alternate", status: "In Progress", owner: "S. Iyer", minutesAgo: 95 },
  { id: "ALT-090", title: "NCR rate trending up in structures", description: "14 open NCRs, up 40% week-on-week; welding defects dominant.", category: "Quality", source: "QA/QC Module", severity: "high", impact: "48 MT rework · ₹3.6 Cr", recommendedAction: "Deploy additional QA inspector", status: "New", owner: "M. Gupta", minutesAgo: 180 },
  { id: "ALT-087", title: "Drawing Rev-C impacts procurement scope", description: "AI detected +420 MT steel and +1.8 km cable in MMS-STR-014 Rev-C.", category: "Engineering", source: "Document Intelligence", severity: "high", impact: "Procurement + cost impact", recommendedAction: "Update BOQ & raise change order", status: "New", owner: "K. Bose", minutesAgo: 220 },
  { id: "ALT-081", title: "Labour deployment below plan — structures", description: "480 headcount gap across 3 contractors.", category: "Resource", source: "Manual Entry", severity: "medium", impact: "Productivity risk", recommendedAction: "Escalate to contractor SCM", status: "Acknowledged", owner: "V. Rao", minutesAgo: 320 },
  { id: "ALT-076", title: "Near-miss reported at inverter yard", description: "Unsecured load during crane lift; no injury.", category: "HSE", source: "Mobile App", severity: "medium", impact: "Safety observation", recommendedAction: "Toolbox talk + rigging audit", status: "Resolved", owner: "D. Kaur", minutesAgo: 540 },
  { id: "ALT-070", title: "Cost burn ahead of budget curve", description: "Cumulative actual ₹858 Cr vs budget ₹830 Cr.", category: "Cost", source: "Analytics Engine", severity: "medium", impact: "+₹28 Cr variance", recommendedAction: "Review committed costs", status: "In Progress", owner: "P. Menon", minutesAgo: 720 },
  { id: "ALT-065", title: "Data sync delayed — Primavera P6", description: "Last successful sync 4 hours ago.", category: "Integration", source: "Integration Hub", severity: "low", impact: "Data freshness", recommendedAction: "Retry sync / check connector", status: "Resolved", owner: "IT Ops", minutesAgo: 900 },
];

export const activityFeed: ActivityEntry[] = [
  { id: "a1", actor: "AI Engine", action: "predicted", target: "8-day COD delay", module: "Predictions", minutesAgo: 6, tone: "warning" },
  { id: "a2", actor: "Rahul Sharma", action: "acknowledged alert", target: "ALT-098 Piling", module: "Schedule", minutesAgo: 40, tone: "info" },
  { id: "a3", actor: "SAP Connector", action: "synced", target: "312 cost transactions", module: "Cost", minutesAgo: 58, tone: "success" },
  { id: "a4", actor: "Meera Gupta", action: "raised NCR", target: "NCR-0142 Welding", module: "Quality", minutesAgo: 120, tone: "danger" },
  { id: "a5", actor: "Site Engineer", action: "submitted DPR", target: "Block C progress", module: "Data Entry", minutesAgo: 145, tone: "info" },
  { id: "a6", actor: "Doc Intelligence", action: "detected changes in", target: "MMS-STR-014 Rev-C", module: "Documents", minutesAgo: 220, tone: "warning" },
  { id: "a7", actor: "Divya Kaur", action: "closed", target: "HSE near-miss", module: "HSE", minutesAgo: 300, tone: "success" },
  { id: "a8", actor: "Primavera P6", action: "synced schedule", target: "1,240 activities", module: "Schedule", minutesAgo: 380, tone: "success" },
];

/* ------------------------------------------------------------------ */
/* SCHEDULE                                                            */
/* ------------------------------------------------------------------ */

export const scheduleKpis = [
  { id: "spi", title: "SPI", value: "0.94", sub: "Schedule Perf. Index", tone: "warning" as const, delta: "-0.06", trend: "down" as const },
  { id: "sv", title: "Schedule Variance", value: "-8 days", sub: "against baseline", tone: "warning" as const, delta: "-2 days WoW", trend: "down" as const },
  { id: "crit", title: "Critical Activities", value: "6", sub: "delayed on critical path", tone: "danger" as const, delta: "+1", trend: "down" as const },
  { id: "fcast", title: "Forecast Delay", value: "8 days", sub: "predicted COD slip", tone: "warning" as const, delta: "AI 88%", trend: "flat" as const },
  { id: "prod", title: "Productivity Index", value: "82%", sub: "weighted across packages", tone: "warning" as const, delta: "-4%", trend: "down" as const },
];

export const scheduleSCurve = sCurve;

export const delayPareto = [
  { cause: "Material shortage", days: 11, cum: 32 },
  { cause: "Low productivity", days: 8, cum: 56 },
  { cause: "Rework / NCR", days: 6, cum: 74 },
  { cause: "Weather", days: 4, cum: 85 },
  { cause: "Labour shortage", days: 3, cum: 94 },
  { cause: "Design changes", days: 2, cum: 100 },
];

export const milestones: Milestone[] = [
  { id: "M1", name: "Mobilisation Complete", planned: "2026-02-15", forecast: "2026-02-15", varianceDays: 0, status: "Completed", progress: 100 },
  { id: "M2", name: "Piling Complete", planned: "2026-05-30", forecast: "2026-06-08", varianceDays: -9, status: "Delayed", progress: 88 },
  { id: "M3", name: "MMS Erection Complete", planned: "2026-07-15", forecast: "2026-07-19", varianceDays: -4, status: "At Risk", progress: 72 },
  { id: "M4", name: "Module Installation Complete", planned: "2026-08-20", forecast: "2026-08-28", varianceDays: -8, status: "At Risk", progress: 55 },
  { id: "M5", name: "Inverter Commissioning", planned: "2026-10-10", forecast: "2026-10-19", varianceDays: -9, status: "Delayed", progress: 20 },
  { id: "M6", name: "Grid Connection", planned: "2026-12-15", forecast: "2026-12-23", varianceDays: -8, status: "On Track", progress: 5 },
  { id: "M7", name: "Commercial Operation Date", planned: "2027-01-15", forecast: "2027-01-23", varianceDays: -8, status: "At Risk", progress: 0 },
];

export const ganttTasks: GanttTask[] = [
  { id: "g1", wbs: "1.1", name: "Site Mobilisation", start: 0, duration: 6, progress: 100, critical: false, package: "Enabling" },
  { id: "g2", wbs: "1.2", name: "Survey & Setting Out", start: 4, duration: 8, progress: 100, critical: false, package: "Enabling" },
  { id: "g3", wbs: "2.1", name: "Pile Driving - Block A", start: 10, duration: 14, progress: 95, critical: true, package: "Piling" },
  { id: "g4", wbs: "2.2", name: "Pile Driving - Block C", start: 16, duration: 18, progress: 78, critical: true, package: "Piling" },
  { id: "g5", wbs: "3.1", name: "MMS Assembly - Block A", start: 22, duration: 12, progress: 82, critical: true, package: "Structures" },
  { id: "g6", wbs: "3.2", name: "MMS Assembly - Block B", start: 28, duration: 14, progress: 60, critical: false, package: "Structures" },
  { id: "g7", wbs: "4.1", name: "Module Installation - Block A", start: 34, duration: 16, progress: 55, critical: true, package: "Modules" },
  { id: "g8", wbs: "4.2", name: "Module Installation - Block B", start: 42, duration: 16, progress: 20, critical: true, package: "Modules" },
  { id: "g9", wbs: "5.1", name: "DC Cabling & Stringing", start: 50, duration: 14, progress: 10, critical: true, package: "Cabling" },
  { id: "g10", wbs: "6.1", name: "Inverter Erection - PCU", start: 56, duration: 12, progress: 5, critical: true, package: "Power" },
  { id: "g11", wbs: "7.1", name: "Testing & Commissioning", start: 66, duration: 14, progress: 0, critical: true, package: "T&C" },
];

export const aiScheduleInsight = {
  rootCause:
    "The 8-day forecast COD slip is driven primarily by solar module inventory exhaustion (12-Aug) on the critical path, compounded by piling productivity running 33% below plan in Block C.",
  prediction:
    "At current productivity (10,000 modules/day vs 15,000 planned), Module Installation is projected to complete 28-Aug instead of 20-Aug — an 8-day critical-path delay flowing directly to COD.",
  actions: [
    "Increase module crews 6 → 8 (+4 days)",
    "Prioritise Blocks C & D where inventory exists (+2 days)",
    "Mobilise air freight for 40,000 modules (+3 days)",
  ],
};

/* ------------------------------------------------------------------ */
/* COST                                                               */
/* ------------------------------------------------------------------ */

export const costKpis = [
  { id: "budget", title: "Budget (BAC)", value: "₹1,250 Cr", sub: "baseline at completion", tone: "neutral" as const },
  { id: "actual", title: "Actual Cost", value: "₹858 Cr", sub: "spent to date", tone: "neutral" as const },
  { id: "committed", title: "Committed Cost", value: "₹1,042 Cr", sub: "POs + contracts", tone: "neutral" as const },
  { id: "forecast", title: "Forecast (EAC)", value: "₹1,271 Cr", sub: "estimate at completion", tone: "warning" as const, delta: "+1.7%", trend: "down" as const },
  { id: "cpi", title: "CPI", value: "0.97", sub: "cost performance index", tone: "warning" as const, delta: "-0.03", trend: "down" as const },
  { id: "vac", title: "VAC", value: "-₹21.3 Cr", sub: "variance at completion", tone: "danger" as const, delta: "overrun", trend: "down" as const },
];

export const monthlyCostTrend: TimePoint[] = [
  { period: "Jan", Planned: 50, Actual: 48 },
  { period: "Feb", Planned: 70, Actual: 70 },
  { period: "Mar", Planned: 90, Actual: 90 },
  { period: "Apr", Planned: 120, Actual: 127 },
  { period: "May", Planned: 130, Actual: 135 },
  { period: "Jun", Planned: 130, Actual: 136 },
  { period: "Jul", Planned: 130, Actual: 136 },
  { period: "Aug", Planned: 110, Actual: 116 },
];

export const packageCost = [
  { name: "Solar Modules", value: 480, color: "#2563EB" },
  { name: "Structures & MMS", value: 210, color: "#14B8A6" },
  { name: "Power Systems", value: 195, color: "#7C3AED" },
  { name: "Cabling", value: 145, color: "#06B6D4" },
  { name: "Civil & Piling", value: 130, color: "#F59E0B" },
  { name: "BoP & Others", value: 90, color: "#EC4899" },
];

export const changeOrders = [
  { id: "CO-007", title: "MMS design revision Rev-C", value: 3.8, status: "Pending", raised: "2026-07-28" },
  { id: "CO-006", title: "Additional cable — Zone 4", value: 1.8, status: "Approved", raised: "2026-07-15" },
  { id: "CO-005", title: "Extra SCBs — Block B", value: 0.6, status: "Approved", raised: "2026-06-30" },
  { id: "CO-004", title: "Grid metering scope add", value: 2.1, status: "Under Review", raised: "2026-06-20" },
];

export const costDrivers = [
  { driver: "LD exposure (schedule slip)", amount: 2.8 },
  { driver: "Site overheads (8-day delay)", amount: 0.96 },
  { driver: "Rework — welding NCRs", amount: 3.6 },
  { driver: "Labour retention", amount: 0.4 },
  { driver: "Cable price escalation", amount: 1.8 },
];

export const packageCostSummary = [
  { pkg: "Solar Modules", budget: 470, actual: 348, committed: 462, forecast: 481, variance: -11 },
  { pkg: "Structures & MMS", budget: 205, actual: 152, committed: 198, forecast: 214, variance: -9 },
  { pkg: "Power Systems", budget: 200, actual: 96, committed: 188, forecast: 199, variance: 1 },
  { pkg: "Cabling", budget: 140, actual: 88, committed: 132, forecast: 147, variance: -7 },
  { pkg: "Civil & Piling", budget: 135, actual: 128, committed: 133, forecast: 138, variance: -3 },
  { pkg: "BoP & Others", budget: 100, actual: 46, committed: 79, forecast: 92, variance: 8 },
];

/* ------------------------------------------------------------------ */
/* PROCUREMENT                                                         */
/* ------------------------------------------------------------------ */

export const procurementKpis = [
  { id: "delayed", title: "Delayed POs", value: "7", sub: "of 84 active", tone: "danger" as const, delta: "+2 WoW", trend: "down" as const },
  { id: "aging", title: "Avg PO Aging", value: "38 days", sub: "order to delivery", tone: "warning" as const, delta: "+5 days", trend: "down" as const },
  { id: "vendor", title: "Vendor Performance", value: "78%", sub: "on-time delivery", tone: "warning" as const, delta: "-6%", trend: "down" as const },
  { id: "critical", title: "Critical Materials", value: "3", sub: "at stockout risk", tone: "danger" as const, delta: "modules, inverters, cable", trend: "flat" as const },
  { id: "invdays", title: "Inventory Days", value: "12", sub: "modules coverage", tone: "danger" as const, delta: "-4 days", trend: "down" as const },
];

export const procurementFunnel = [
  { stage: "Requisition", value: 128, color: "#2563EB" },
  { stage: "RFQ Issued", value: 112, color: "#3B82F6" },
  { stage: "PO Released", value: 96, color: "#14B8A6" },
  { stage: "In Transit", value: 58, color: "#06B6D4" },
  { stage: "Delivered", value: 41, color: "#16A34A" },
];

export const materialDeliveryTrend: TimePoint[] = [
  { period: "Apr", Planned: 45, Actual: 42 },
  { period: "May", Planned: 62, Actual: 55 },
  { period: "Jun", Planned: 78, Actual: 68 },
  { period: "Jul", Planned: 92, Actual: 79 },
  { period: "Aug", Planned: 108, Actual: 88 },
];

export const inventoryTrend: TimePoint[] = [
  { period: "W-6", Modules: 210, Threshold: 60 },
  { period: "W-5", Modules: 178, Threshold: 60 },
  { period: "W-4", Modules: 150, Threshold: 60 },
  { period: "W-3", Modules: 122, Threshold: 60 },
  { period: "W-2", Modules: 95, Threshold: 60 },
  { period: "W-1", Modules: 68, Threshold: 60 },
  { period: "Now", Modules: 42, Threshold: 60 },
];

export const poRegister: PoRow[] = [
  { id: "1", poNo: "PO-2401", material: "Solar Modules (540Wp)", vendor: "SunTech Global", value: 462, ordered: "2026-03-10", promised: "2026-08-15", status: "At Risk", agingDays: 44 },
  { id: "2", poNo: "PO-2418", material: "String Inverters PCU-3", vendor: "PowerVolt Inc", value: 88, ordered: "2026-04-02", promised: "2026-09-25", status: "Delayed", agingDays: 62 },
  { id: "3", poNo: "PO-2405", material: "MMS Galvanised Steel", vendor: "SteelCraft Ltd", value: 78, ordered: "2026-03-18", promised: "2026-07-20", status: "Delivered", agingDays: 38 },
  { id: "4", poNo: "PO-2432", material: "DC Cables (4mm²)", vendor: "WireLine Cables", value: 42, ordered: "2026-05-01", promised: "2026-08-10", status: "Delayed", agingDays: 40 },
  { id: "5", poNo: "PO-2440", material: "SCB Junction Boxes", vendor: "ElectroFit", value: 12, ordered: "2026-05-20", promised: "2026-08-05", status: "On Track", agingDays: 28 },
  { id: "6", poNo: "PO-2411", material: "HT Transformers", vendor: "GridPower Systems", value: 96, ordered: "2026-03-25", promised: "2026-09-15", status: "On Track", agingDays: 52 },
  { id: "7", poNo: "PO-2450", material: "Tracker Motors", vendor: "TrackSol", value: 34, ordered: "2026-06-01", promised: "2026-08-28", status: "At Risk", agingDays: 30 },
  { id: "8", poNo: "PO-2399", material: "Earthing & LA Kit", vendor: "SafeGround", value: 8, ordered: "2026-02-28", promised: "2026-06-30", status: "Delivered", agingDays: 34 },
];

export const vendors = [
  { id: "v1", name: "SunTech Global", category: "Modules", otd: 72, quality: 88, risk: "High", spend: 462, openPos: 3 },
  { id: "v2", name: "PowerVolt Inc", category: "Inverters", otd: 64, quality: 82, risk: "High", spend: 188, openPos: 2 },
  { id: "v3", name: "SteelCraft Ltd", category: "Structures", otd: 91, quality: 90, risk: "Low", spend: 133, openPos: 4 },
  { id: "v4", name: "WireLine Cables", category: "Cabling", otd: 76, quality: 85, risk: "Medium", spend: 132, openPos: 5 },
  { id: "v5", name: "GridPower Systems", category: "Power", otd: 88, quality: 92, risk: "Low", spend: 188, openPos: 2 },
  { id: "v6", name: "TrackSol", category: "Trackers", otd: 70, quality: 80, risk: "Medium", spend: 79, openPos: 3 },
];

export const materialRegister = [
  { id: "m1", material: "Solar Modules (540Wp)", required: 220000, received: 120000, unit: "Nos", coverage: 12, status: "Critical" },
  { id: "m2", material: "String Inverters", required: 48, received: 22, unit: "Nos", coverage: 18, status: "Critical" },
  { id: "m3", material: "MMS Steel", required: 8400, received: 6100, unit: "MT", coverage: 34, status: "OK" },
  { id: "m4", material: "DC Cable", required: 340, received: 210, unit: "km", coverage: 22, status: "Watch" },
  { id: "m5", material: "SCB Boxes", required: 1200, received: 940, unit: "Nos", coverage: 45, status: "OK" },
];

/* ------------------------------------------------------------------ */
/* RESOURCE                                                            */
/* ------------------------------------------------------------------ */

export const resourceKpis = [
  { id: "avail", title: "Available Labour", value: "2,340", sub: "headcount on site", tone: "neutral" as const },
  { id: "req", title: "Required Labour", value: "2,820", sub: "as per plan", tone: "neutral" as const },
  { id: "gap", title: "Labour Gap", value: "480", sub: "shortfall (17%)", tone: "danger" as const, delta: "+60 WoW", trend: "down" as const },
  { id: "prod", title: "Productivity", value: "82%", sub: "weighted efficiency", tone: "warning" as const, delta: "-4%", trend: "down" as const },
  { id: "equip", title: "Equipment Availability", value: "86%", sub: "of fleet operational", tone: "warning" as const, delta: "4 units down", trend: "down" as const },
];

export const labourTrend: TimePoint[] = [
  { period: "W-5", Required: 2600, Available: 2450 },
  { period: "W-4", Required: 2680, Available: 2400 },
  { period: "W-3", Required: 2720, Available: 2380 },
  { period: "W-2", Required: 2780, Available: 2360 },
  { period: "W-1", Required: 2800, Available: 2350 },
  { period: "Now", Required: 2820, Available: 2340 },
];

export const equipmentUtil: TimePoint[] = [
  { period: "Mon", Working: 82, Idle: 12, Breakdown: 6 },
  { period: "Tue", Working: 85, Idle: 10, Breakdown: 5 },
  { period: "Wed", Working: 78, Idle: 14, Breakdown: 8 },
  { period: "Thu", Working: 80, Idle: 13, Breakdown: 7 },
  { period: "Fri", Working: 86, Idle: 9, Breakdown: 5 },
  { period: "Sat", Working: 88, Idle: 8, Breakdown: 4 },
];

export const crewProductivity = [
  { crew: "Piling A", value: 95 },
  { crew: "Piling C", value: 67 },
  { crew: "MMS B1", value: 88 },
  { crew: "Module A", value: 78 },
  { crew: "Module B", value: 72 },
  { crew: "Cabling", value: 84 },
];

export const contractorLabour = [
  { id: "c1", contractor: "Rajputana Constructions", trade: "Civil / Piling", planned: 620, present: 540, absent: 80, productivity: 87 },
  { id: "c2", contractor: "Marwar Structures", trade: "MMS Erection", planned: 780, present: 640, absent: 140, productivity: 82 },
  { id: "c3", contractor: "Desert Solar Labour Co", trade: "Module Install", planned: 900, present: 780, absent: 120, productivity: 78 },
  { id: "c4", contractor: "Volt Electricals", trade: "Cabling / T&C", planned: 520, present: 380, absent: 140, productivity: 84 },
];

export const equipmentRegister = [
  { id: "e1", equipment: "Piling Rig PR-01", working: 8.2, idle: 1.1, breakdown: 0.7, fuel: 142, status: "Running" },
  { id: "e2", equipment: "Piling Rig PR-02", working: 0, idle: 0, breakdown: 10, fuel: 0, status: "Breakdown" },
  { id: "e3", equipment: "Crawler Crane CC-01", working: 7.5, idle: 2.0, breakdown: 0.5, fuel: 210, status: "Running" },
  { id: "e4", equipment: "Telehandler TH-03", working: 6.8, idle: 3.2, breakdown: 0, fuel: 88, status: "Idle" },
  { id: "e5", equipment: "Boom Lift BL-02", working: 5.5, idle: 1.5, breakdown: 3, fuel: 64, status: "Maintenance" },
];

/* ------------------------------------------------------------------ */
/* QUALITY                                                             */
/* ------------------------------------------------------------------ */

export const qualityKpis = [
  { id: "open", title: "Open NCRs", value: "14", sub: "awaiting closure", tone: "warning" as const, delta: "+4 WoW", trend: "down" as const },
  { id: "closed", title: "Closed NCRs", value: "126", sub: "this project", tone: "success" as const, delta: "90% closure", trend: "up" as const },
  { id: "defect", title: "Defect Rate", value: "2.4%", sub: "of inspections", tone: "warning" as const, delta: "+0.6%", trend: "down" as const },
  { id: "rework", title: "Rework Cost", value: "₹1.9 Cr", sub: "cumulative", tone: "danger" as const, delta: "+₹0.4 Cr", trend: "down" as const },
];

export const ncrTrend: TimePoint[] = [
  { period: "Mar", Raised: 18, Closed: 16 },
  { period: "Apr", Raised: 22, Closed: 20 },
  { period: "May", Raised: 26, Closed: 24 },
  { period: "Jun", Raised: 30, Closed: 25 },
  { period: "Jul", Raised: 34, Closed: 26 },
  { period: "Aug", Raised: 20, Closed: 15 },
];

export const defectPareto = [
  { defect: "Welding defects", count: 38, cum: 34 },
  { defect: "Torque non-conf.", count: 26, cum: 57 },
  { defect: "Coating damage", count: 18, cum: 73 },
  { defect: "Alignment", count: 14, cum: 86 },
  { defect: "Documentation", count: 10, cum: 95 },
  { defect: "Others", count: 6, cum: 100 },
];

export const reworkTrend: TimePoint[] = [
  { period: "Mar", Cost: 0.2, MT: 6 },
  { period: "Apr", Cost: 0.4, MT: 11 },
  { period: "May", Cost: 0.7, MT: 18 },
  { period: "Jun", Cost: 1.1, MT: 28 },
  { period: "Jul", Cost: 1.6, MT: 42 },
  { period: "Aug", Cost: 1.9, MT: 48 },
];

export const ncrRegister: NcrRow[] = [
  { id: "1", ncrNo: "NCR-0142", description: "Weld porosity — MMS beam joint", discipline: "Structures", severity: "high", raisedBy: "M. Gupta", status: "Open", reworkCost: 0.42, age: 4 },
  { id: "2", ncrNo: "NCR-0139", description: "Torque below spec — module clamps", discipline: "Modules", severity: "medium", raisedBy: "A. Singh", status: "In Progress", reworkCost: 0.18, age: 8 },
  { id: "3", ncrNo: "NCR-0137", description: "Galvanising damage — purlins", discipline: "Structures", severity: "medium", raisedBy: "M. Gupta", status: "Open", reworkCost: 0.24, age: 11 },
  { id: "4", ncrNo: "NCR-0133", description: "Cable bending radius violation", discipline: "Cabling", severity: "low", raisedBy: "V. Rao", status: "Open", reworkCost: 0.08, age: 14 },
  { id: "5", ncrNo: "NCR-0128", description: "Pile verticality out of tolerance", discipline: "Civil", severity: "high", raisedBy: "A. Nair", status: "In Progress", reworkCost: 0.55, age: 18 },
  { id: "6", ncrNo: "NCR-0121", description: "Missing earthing continuity", discipline: "Electrical", severity: "medium", raisedBy: "S. Iyer", status: "Closed", reworkCost: 0.12, age: 24 },
];

export const inspectionRegister = [
  { id: "i1", inspection: "MMS Weld Inspection - Block A", type: "Witness", result: "Pass", date: "2026-08-01", inspector: "M. Gupta" },
  { id: "i2", inspection: "Module IV Curve Test - Block A", type: "Test", result: "Pass", date: "2026-07-30", inspector: "A. Singh" },
  { id: "i3", inspection: "Pile Load Test - Block C", type: "Test", result: "Fail", date: "2026-07-28", inspector: "A. Nair" },
  { id: "i4", inspection: "Coating DFT Check - Block B", type: "Witness", result: "Pass", date: "2026-07-27", inspector: "M. Gupta" },
];

/* ------------------------------------------------------------------ */
/* HSE                                                                 */
/* ------------------------------------------------------------------ */

export const hseKpis = [
  { id: "inc", title: "Incidents", value: "2", sub: "open this month", tone: "warning" as const, delta: "-1", trend: "up" as const },
  { id: "nm", title: "Near Misses", value: "9", sub: "reported", tone: "neutral" as const, delta: "+3", trend: "flat" as const },
  { id: "ua", title: "Unsafe Acts", value: "17", sub: "observed & logged", tone: "warning" as const, delta: "+2", trend: "flat" as const },
  { id: "lti", title: "LTI Free Days", value: "128", sub: "since last LTI", tone: "success" as const, delta: "milestone", trend: "up" as const },
];

export const incidentTrend: TimePoint[] = [
  { period: "Mar", Incidents: 3, NearMiss: 5, Unsafe: 12 },
  { period: "Apr", Incidents: 2, NearMiss: 7, Unsafe: 14 },
  { period: "May", Incidents: 4, NearMiss: 6, Unsafe: 15 },
  { period: "Jun", Incidents: 3, NearMiss: 8, Unsafe: 13 },
  { period: "Jul", Incidents: 3, NearMiss: 9, Unsafe: 18 },
  { period: "Aug", Incidents: 2, NearMiss: 9, Unsafe: 17 },
];

export const severityTrend: TimePoint[] = [
  { period: "Mar", Index: 2.1 },
  { period: "Apr", Index: 1.8 },
  { period: "May", Index: 2.4 },
  { period: "Jun", Index: 1.9 },
  { period: "Jul", Index: 1.6 },
  { period: "Aug", Index: 1.4 },
];

export const siteRiskHeatmap = [
  { zone: "Piling Yard", value: 3 },
  { zone: "MMS Assembly", value: 2 },
  { zone: "Module Field A", value: 1 },
  { zone: "Module Field B", value: 2 },
  { zone: "Inverter Yard", value: 4 },
  { zone: "Cable Trench", value: 3 },
  { zone: "Substation", value: 2 },
  { zone: "Stores", value: 1 },
  { zone: "Batching Plant", value: 2 },
];

export const incidentRegister: IncidentRow[] = [
  { id: "1", refNo: "HSE-0231", type: "Near Miss", location: "Inverter Yard", severity: "medium", reportedBy: "D. Kaur", status: "Closed", date: "2026-08-01" },
  { id: "2", refNo: "HSE-0229", type: "Unsafe Act", location: "Cable Trench", severity: "low", reportedBy: "Site Supervisor", status: "Closed", date: "2026-07-31" },
  { id: "3", refNo: "HSE-0225", type: "First Aid", location: "MMS Assembly", severity: "low", reportedBy: "D. Kaur", status: "Closed", date: "2026-07-29" },
  { id: "4", refNo: "HSE-0222", type: "Incident", location: "Piling Yard", severity: "high", reportedBy: "A. Nair", status: "Investigating", date: "2026-07-26" },
  { id: "5", refNo: "HSE-0218", type: "Near Miss", location: "Module Field B", severity: "medium", reportedBy: "Site Engineer", status: "Open", date: "2026-07-24" },
];

export const correctiveActions = [
  { id: "ca1", action: "Rigging inspection & crane operator re-briefing", ref: "HSE-0231", owner: "D. Kaur", due: "2026-08-05", status: "Closed" },
  { id: "ca2", action: "Excavation barricading audit", ref: "HSE-0222", owner: "A. Nair", due: "2026-08-08", status: "In Progress" },
  { id: "ca3", action: "PPE compliance drive — trench works", ref: "HSE-0229", owner: "HSE Team", due: "2026-08-06", status: "Open" },
];

/* ------------------------------------------------------------------ */
/* ENGINEERING & DOCUMENTS                                             */
/* ------------------------------------------------------------------ */

export const documentKpis = [
  { id: "sub", title: "Documents Submitted", value: "1,284", sub: "total in register", tone: "neutral" as const },
  { id: "pending", title: "Pending Review", value: "46", sub: "in approval queue", tone: "warning" as const, delta: "+8", trend: "down" as const },
  { id: "afc", title: "Approved AFC", value: "912", sub: "for construction", tone: "success" as const, delta: "71%", trend: "up" as const },
  { id: "overdue", title: "Overdue Documents", value: "18", sub: "past review SLA", tone: "danger" as const, delta: "+3", trend: "down" as const },
  { id: "rev", title: "Revision Count", value: "3.2", sub: "avg revs / document", tone: "neutral" as const },
];

export const docRegister: DocRow[] = [
  { id: "1", docNo: "MMS-STR-014", title: "MMS Structural GA — Block A", discipline: "Structures", revision: "Rev-C", status: "Under Review", submitted: "2026-07-28", owner: "K. Bose" },
  { id: "2", docNo: "ELE-SLD-002", title: "Single Line Diagram — 33kV", discipline: "Electrical", revision: "Rev-B", status: "AFC", submitted: "2026-06-10", owner: "S. Iyer" },
  { id: "3", docNo: "CIV-PIL-008", title: "Pile Layout — Block C", discipline: "Civil", revision: "Rev-A", status: "Approved", submitted: "2026-05-22", owner: "A. Nair" },
  { id: "4", docNo: "MOD-ARR-021", title: "Module Array Layout — Field B", discipline: "Solar", revision: "Rev-D", status: "Submitted", submitted: "2026-08-01", owner: "P. Menon" },
  { id: "5", docNo: "CAB-RTG-011", title: "DC Cable Routing — Zone 4", discipline: "Cabling", revision: "Rev-B", status: "Under Review", submitted: "2026-07-30", owner: "V. Rao" },
  { id: "6", docNo: "ELE-INV-005", title: "Inverter Foundation Detail", discipline: "Electrical", revision: "Rev-A", status: "AFC", submitted: "2026-06-28", owner: "S. Iyer" },
];

export const drawingChangeAnalysis = {
  document: "MMS-STR-014 — Rev-B → Rev-C",
  detected: [
    { type: "Additional Quantity", item: "Structural steel", delta: "+420 MT" },
    { type: "Additional Quantity", item: "DC cable", delta: "+1.8 km" },
    { type: "Additional Quantity", item: "SCB junction boxes", delta: "+12 Nos" },
    { type: "Changed Quantity", item: "Foundation bolts (M24)", delta: "+380 Nos" },
  ],
  scheduleImpact: "+3 days on MMS Assembly (Block A)",
  costImpact: "₹3.8 Cr (change order CO-007)",
  procurementImpact: "New RFQ required for steel & cable",
};

export const documentWorkflow = ["Submitted", "Under Review", "Approved with Comments", "AFC", "As-Built"];

/* ------------------------------------------------------------------ */
/* AI INSIGHTS & PREDICTIONS                                           */
/* ------------------------------------------------------------------ */

export const predictionKpis = [
  { id: "cod", title: "Predicted COD", value: "23 Jan 2027", sub: "8 days beyond plan", tone: "warning" as const, delta: "AI 88%" },
  { id: "cost", title: "Forecast Final Cost", value: "₹1,271 Cr", sub: "₹21.3 Cr overrun", tone: "warning" as const, delta: "AI 84%" },
  { id: "risk", title: "Top Risk Score", value: "62 / 100", sub: "procurement-driven", tone: "danger" as const, delta: "AI 90%" },
  { id: "conf", title: "Overall AI Confidence", value: "88%", sub: "data completeness 94%", tone: "success" as const, delta: "high" },
];

export const riskTrend: TimePoint[] = [
  { period: "Mar", Score: 38 },
  { period: "Apr", Score: 44 },
  { period: "May", Score: 49 },
  { period: "Jun", Score: 55 },
  { period: "Jul", Score: 60 },
  { period: "Aug", Score: 62 },
];

export const predictionTrend: TimePoint[] = [
  { period: "May", CODDelay: 2, CostOverrun: 6 },
  { period: "Jun", CODDelay: 4, CostOverrun: 11 },
  { period: "Jul", CODDelay: 6, CostOverrun: 16 },
  { period: "Aug", CODDelay: 8, CostOverrun: 21 },
];

export const riskHeatMatrix = [
  { name: "Module exhaustion", probability: 82, impact: 90, severity: "critical" },
  { name: "Piling productivity", probability: 70, impact: 62, severity: "high" },
  { name: "Inverter slippage", probability: 65, impact: 78, severity: "high" },
  { name: "Labour shortage", probability: 60, impact: 55, severity: "high" },
  { name: "NCR / rework", probability: 55, impact: 60, severity: "medium" },
  { name: "Monsoon", probability: 50, impact: 30, severity: "medium" },
  { name: "Grid approval", probability: 40, impact: 85, severity: "high" },
];

/* ------------------------------------------------------------------ */
/* AI COPILOT                                                          */
/* ------------------------------------------------------------------ */

export const copilotSuggestions = [
  "Why are we delayed?",
  "What is causing cost overrun?",
  "Which materials are at risk?",
  "What if manpower increases by 20%?",
  "How many days can be recovered?",
  "What is the current critical path?",
  "Summarize today's project status.",
];

export const copilotHistory = [
  { id: "h1", title: "COD delay root cause", when: "Today, 09:42" },
  { id: "h2", title: "Cost overrun drivers", when: "Today, 08:15" },
  { id: "h3", title: "Vendor risk review", when: "Yesterday" },
  { id: "h4", title: "Recovery plan options", when: "Yesterday" },
  { id: "h5", title: "Weekly MIS summary", when: "2 days ago" },
];

export const copilotAnswers: Record<string, { content: string; sources: string[]; chips?: { label: string; value: string; tone: "warning" | "danger" | "success" | "neutral" }[] }> = {
  "Why are we delayed?": {
    content:
      "The project is forecasting an 8-day COD delay. The primary driver is solar module inventory exhaustion predicted for 12-Aug, while balance delivery is only scheduled for 15-Aug. Since Module Installation is on the critical path and is already running at 67% productivity (10,000/day vs 15,000 planned), the delay flows directly to Stringing → Testing → COD.",
    sources: ["Primavera P6 — Critical Path", "SAP — Material Delivery", "Site DPR — Block A Progress", "AI Schedule Model v3.2"],
    chips: [
      { label: "COD Delay", value: "8 days", tone: "warning" },
      { label: "Confidence", value: "88%", tone: "success" },
      { label: "Cost Impact", value: "₹4.16 Cr", tone: "danger" },
    ],
  },
  "What is causing cost overrun?": {
    content:
      "Forecast cost overrun is ₹21.3 Cr (1.7% over the ₹1,250 Cr budget). The largest drivers are: rework from welding NCRs (₹3.6 Cr), liquidated-damages exposure from the schedule slip (₹2.8 Cr), cable price escalation (₹1.8 Cr), and site overheads for the 8-day delay (₹0.96 Cr).",
    sources: ["SAP — Cost Ledger", "QA/QC — NCR Register", "Analytics Engine — EAC Model"],
    chips: [
      { label: "Forecast EAC", value: "₹1,271 Cr", tone: "warning" },
      { label: "Overrun", value: "₹21.3 Cr", tone: "danger" },
    ],
  },
  "Which materials are at risk?": {
    content:
      "Three materials are at stockout risk: (1) Solar Modules — 12 days coverage, critical; (2) String Inverters PCU-3 — vendor slip of 9 days; (3) DC Cable — 22 days coverage with a delayed PO. Solar modules are the most urgent as they sit on the critical path.",
    sources: ["Procurement — PO Register", "Inventory — Stock Levels", "AI Procurement Risk Model"],
    chips: [
      { label: "Critical Materials", value: "3", tone: "danger" },
      { label: "Modules Coverage", value: "12 days", tone: "warning" },
    ],
  },
  "What if manpower increases by 20%?": {
    content:
      "Simulating a 20% increase in module installation manpower (≈+156 workers): projected productivity rises from 10,000 to ~12,400 modules/day. This recovers approximately 4 days of the critical-path delay, reducing COD slip from 8 → 4 days. Additional labour cost ≈ ₹0.6 Cr, net positive against ₹0.96 Cr/day site overheads avoided.",
    sources: ["What-If Simulation Engine", "Resource Model", "Productivity Baseline"],
    chips: [
      { label: "COD Recovery", value: "+4 days", tone: "success" },
      { label: "Added Cost", value: "₹0.6 Cr", tone: "neutral" },
    ],
  },
  "How many days can be recovered?": {
    content:
      "Combining the top recovery levers — increasing crews 6→8 (+4d), prioritising Blocks C & D (+2d), and air-freighting 40,000 modules (+3d) — the realistic recoverable window is 4–6 days after overlap. This brings the forecast COD delay down from 8 days to approximately 2 days.",
    sources: ["Recommendation Engine", "What-If Simulation", "Critical Path Model"],
    chips: [
      { label: "Recoverable", value: "up to 6 days", tone: "success" },
      { label: "Residual Delay", value: "~2 days", tone: "warning" },
    ],
  },
  "What is the current critical path?": {
    content:
      "The active critical path runs: Pile Driving Block C → MMS Assembly Block A → Module Installation Block A → DC Cabling & Stringing → Inverter Erection → Testing & Commissioning → COD. Module Installation is the current binding constraint due to inventory limits.",
    sources: ["Primavera P6 — CPM Analysis", "Digital Twin — Dependency Graph"],
    chips: [{ label: "Critical Activities", value: "6", tone: "warning" }],
  },
  "Summarize today's project status.": {
    content:
      "GreenSun Solar Park is 62.4% complete against a 68% plan (SPI 0.94, CPI 0.97). Overall health is 71/100. Key concerns: module inventory exhaustion (12-Aug), piling productivity 33% below plan, and 7 delayed POs. AI forecasts an 8-day COD slip and ₹21.3 Cr overrun. Recommended: increase module crews and expedite delivery to recover up to 6 days.",
    sources: ["Command Centre", "AI Prediction Engine", "All Module Analytics"],
    chips: [
      { label: "Progress", value: "62.4%", tone: "neutral" },
      { label: "Health", value: "71/100", tone: "warning" },
      { label: "COD Delay", value: "8 days", tone: "warning" },
    ],
  },
};

export const copilotDefaultAnswer = {
  content:
    "Based on GreenSun Solar Park data, I've analysed your question across schedule, cost, procurement, resources, quality and HSE. The dominant theme this week is the module-driven critical-path pressure forecasting an 8-day COD slip. Ask me about delay root cause, cost drivers, material risk, or run a what-if scenario for recovery options.",
  sources: ["Project Digital Twin", "AI Prediction Engine"],
  chips: [
    { label: "Health", value: "71/100", tone: "warning" as const },
    { label: "AI Confidence", value: "88%", tone: "success" as const },
  ],
};

/* ------------------------------------------------------------------ */
/* DATA INTEGRATION HUB                                                */
/* ------------------------------------------------------------------ */

export const connectors: Connector[] = [
  { id: "p6", name: "Primavera P6", category: "Scheduling", status: "Connected", lastSync: "2 min ago", records: 1240, health: 98, logoColor: "#F97316", logoText: "P6" },
  { id: "sap", name: "SAP ERP", category: "Cost & Procurement", status: "Connected", lastSync: "5 min ago", records: 8420, health: 96, logoColor: "#0EA5E9", logoText: "SAP" },
  { id: "odoo", name: "Odoo", category: "ERP", status: "Syncing", lastSync: "syncing…", records: 3210, health: 88, logoColor: "#7C3AED", logoText: "OD" },
  { id: "sp", name: "SharePoint", category: "Documents", status: "Connected", lastSync: "12 min ago", records: 1284, health: 94, logoColor: "#16A34A", logoText: "SP" },
  { id: "erpnext", name: "ERPNext", category: "ERP", status: "Error", lastSync: "4 hrs ago", records: 640, health: 42, logoColor: "#2563EB", logoText: "EN" },
  { id: "aconex", name: "Aconex", category: "Documents", status: "Connected", lastSync: "20 min ago", records: 920, health: 91, logoColor: "#EF4444", logoText: "AC" },
  { id: "gdrive", name: "Google Drive", category: "Storage", status: "Connected", lastSync: "1 hr ago", records: 410, health: 89, logoColor: "#F59E0B", logoText: "GD" },
  { id: "api", name: "Custom REST API", category: "API", status: "Disconnected", lastSync: "—", records: 0, health: 0, logoColor: "#64748B", logoText: "API" },
];

export const uploadHistory = [
  { id: "u1", file: "BOQ_GreenSun_v4.xlsx", type: "BOQ", rows: 1240, accepted: 1236, rejected: 4, when: "Today, 10:22", status: "Completed" },
  { id: "u2", file: "DPR_Block_C_Aug01.csv", type: "DPR", rows: 86, accepted: 86, rejected: 0, when: "Today, 08:10", status: "Completed" },
  { id: "u3", file: "Schedule_Baseline.xer", type: "Primavera XER", rows: 1240, accepted: 1240, rejected: 0, when: "Yesterday", status: "Completed" },
  { id: "u4", file: "Labour_July.xlsx", type: "Labour", rows: 620, accepted: 604, rejected: 16, when: "Yesterday", status: "With Errors" },
];

export const uploadTemplates = [
  "BOQ", "DPR", "Procurement", "Inventory", "Labour", "Equipment", "Cost", "NCR", "Site Progress", "Risk Register", "Drawing Register",
];

export const manualEntryForms = [
  { key: "progress", label: "Daily Progress", icon: "activity", desc: "WBS, activity, planned vs actual qty" },
  { key: "labour", label: "Labour Deployment", icon: "users", desc: "Trade, contractor, present / absent" },
  { key: "equipment", label: "Equipment Utilization", icon: "truck", desc: "Working, idle, breakdown, fuel" },
  { key: "material", label: "Material Receipt", icon: "package", desc: "Material, vendor, GRN, invoice" },
  { key: "quality", label: "Quality Inspection", icon: "shield-check", desc: "Checklist, pass/fail, NCR" },
  { key: "hse", label: "HSE Observation", icon: "hard-hat", desc: "Near miss, unsafe act, severity" },
];

export const aiIngestionChannels = [
  { key: "pdf", label: "PDF Reader", desc: "Extract DPR / BOQ from documents", stat: "142 processed" },
  { key: "voice", label: "Voice to Data", desc: '"Block B completed 420 piles"', stat: "38 this week" },
  { key: "whatsapp", label: "WhatsApp Parsing", desc: "Parse supervisor field messages", stat: "96 messages" },
  { key: "drone", label: "Drone Image Analytics", desc: "Progress % from aerial imagery", stat: "12 flights" },
  { key: "ocr", label: "OCR Extraction", desc: "Invoices, GRNs, checklists", stat: "310 scans" },
];

/* ------------------------------------------------------------------ */
/* DATA QUALITY                                                        */
/* ------------------------------------------------------------------ */

export const dataQualityKpis = [
  { id: "comp", title: "Data Completeness", value: "94%", sub: "across all modules", tone: "success" as const, delta: "+2%", trend: "up" as const },
  { id: "missing", title: "Missing Records", value: "312", sub: "flagged for entry", tone: "warning" as const, delta: "-40", trend: "up" as const },
  { id: "unmapped", title: "Unmapped Fields", value: "18", sub: "in harmonization", tone: "warning" as const, delta: "-6", trend: "up" as const },
  { id: "aiconf", title: "AI Confidence", value: "88%", sub: "prediction reliability", tone: "success" as const, delta: "+3%", trend: "up" as const },
];

export const completenessTrend: TimePoint[] = [
  { period: "W-5", Completeness: 84, Freshness: 78 },
  { period: "W-4", Completeness: 87, Freshness: 82 },
  { period: "W-3", Completeness: 89, Freshness: 85 },
  { period: "W-2", Completeness: 91, Freshness: 88 },
  { period: "W-1", Completeness: 93, Freshness: 90 },
  { period: "Now", Completeness: 94, Freshness: 92 },
];

export const completenessByModule = [
  { module: "Schedule", value: 98 },
  { module: "Cost", value: 96 },
  { module: "Procurement", value: 92 },
  { module: "Resources", value: 88 },
  { module: "Quality", value: 95 },
  { module: "HSE", value: 97 },
  { module: "Documents", value: 90 },
];

export const validationErrors = [
  { id: "ve1", module: "Labour", record: "Row 412 — Aug 01", error: "Actual > Planned × 1.5", severity: "high" as const },
  { id: "ve2", module: "Progress", record: "DPR Block C", error: "Missing UOM", severity: "medium" as const },
  { id: "ve3", module: "Procurement", record: "PO-2450", error: "Vendor not in master", severity: "high" as const },
  { id: "ve4", module: "Cost", record: "Txn 88213", error: "Unmapped cost head", severity: "low" as const },
  { id: "ve5", module: "Quality", record: "NCR-0133", error: "Missing closure evidence", severity: "medium" as const },
];

export const missingRecords = [
  { id: "mr1", module: "Daily Progress", location: "Block D", expected: "Daily", lastReceived: "2 days ago", status: "Overdue" },
  { id: "mr2", module: "Labour Entry", location: "Volt Electricals", expected: "Daily", lastReceived: "1 day ago", status: "Due" },
  { id: "mr3", module: "Equipment Log", location: "Piling Yard", expected: "Daily", lastReceived: "Today", status: "OK" },
];

/* ------------------------------------------------------------------ */
/* REPORTS                                                             */
/* ------------------------------------------------------------------ */

export const reports = [
  { id: "rp1", title: "Executive Summary Report", desc: "CXO-level project health & AI outlook", icon: "layout-dashboard", schedule: "Weekly", format: "PDF", updated: "Today, 07:00" },
  { id: "rp2", title: "Daily Progress Report (DPR)", desc: "Site progress, labour, equipment", icon: "calendar-days", schedule: "Daily", format: "PDF / Excel", updated: "Today, 06:30" },
  { id: "rp3", title: "Weekly MIS", desc: "Consolidated weekly performance", icon: "bar-chart-3", schedule: "Weekly", format: "PDF", updated: "Mon, 08:00" },
  { id: "rp4", title: "Monthly MIS", desc: "Full monthly management review", icon: "file-bar-chart", schedule: "Monthly", format: "PDF", updated: "01 Aug" },
  { id: "rp5", title: "Risk Report", desc: "Risk register & mitigation status", icon: "shield-alert", schedule: "Weekly", format: "PDF / Excel", updated: "Today, 07:15" },
  { id: "rp6", title: "Cost Report", desc: "EVM, EAC, VAC & change orders", icon: "wallet", schedule: "Weekly", format: "Excel", updated: "Today, 07:20" },
  { id: "rp7", title: "Procurement Report", desc: "PO aging, vendor & material status", icon: "package", schedule: "Weekly", format: "Excel", updated: "Today, 07:25" },
];

/* ------------------------------------------------------------------ */
/* SETTINGS                                                            */
/* ------------------------------------------------------------------ */

export const users: UserRow[] = [
  { id: "1", name: "Rahul Sharma", email: "rahul.sharma@infragrit.com", role: "Project Director", status: "Active", lastActive: "2 min ago" },
  { id: "2", name: "Ananya Nair", email: "ananya.nair@infragrit.com", role: "Planning Engineer", status: "Active", lastActive: "18 min ago" },
  { id: "3", name: "Meera Gupta", email: "meera.gupta@infragrit.com", role: "QA Engineer", status: "Active", lastActive: "1 hr ago" },
  { id: "4", name: "Suresh Iyer", email: "suresh.iyer@infragrit.com", role: "Procurement Engineer", status: "Active", lastActive: "3 hrs ago" },
  { id: "5", name: "Divya Kaur", email: "divya.kaur@infragrit.com", role: "HSE Officer", status: "Active", lastActive: "Today" },
  { id: "6", name: "Vikram Rao", email: "vikram.rao@infragrit.com", role: "Construction Manager", status: "Active", lastActive: "Yesterday" },
  { id: "7", name: "Priya Menon", email: "priya.menon@infragrit.com", role: "Project Controls", status: "Invited", lastActive: "—" },
  { id: "8", name: "Karan Bose", email: "karan.bose@infragrit.com", role: "Document Controller", status: "Suspended", lastActive: "5 days ago" },
];

export const roles = [
  { id: "r1", name: "Admin", users: 2, permissions: "Full access" },
  { id: "r2", name: "Project Director", users: 1, permissions: "All modules · approve" },
  { id: "r3", name: "Project Manager", users: 3, permissions: "All modules · review" },
  { id: "r4", name: "Planning Engineer", users: 4, permissions: "Schedule · Progress" },
  { id: "r5", name: "QA Engineer", users: 3, permissions: "Quality · Documents" },
  { id: "r6", name: "HSE Officer", users: 2, permissions: "HSE module" },
  { id: "r7", name: "Procurement Engineer", users: 3, permissions: "Procurement · Cost" },
  { id: "r8", name: "Viewer", users: 12, permissions: "Read-only" },
];

export const thresholds = [
  { id: "t1", metric: "SPI critical threshold", value: "0.90", tone: "danger" },
  { id: "t2", metric: "CPI critical threshold", value: "0.92", tone: "danger" },
  { id: "t3", metric: "Inventory days alert", value: "15 days", tone: "warning" },
  { id: "t4", metric: "NCR spike threshold", value: "+30% WoW", tone: "warning" },
  { id: "t5", metric: "Data completeness minimum", value: "90%", tone: "warning" },
];

export const masters = [
  { name: "Activity Master", count: 1240 },
  { name: "WBS Master", count: 186 },
  { name: "Resource Master", count: 42 },
  { name: "Material Master", count: 318 },
  { name: "Vendor Master", count: 64 },
  { name: "Equipment Master", count: 88 },
  { name: "Location Master", count: 24 },
  { name: "Cost Head Master", count: 52 },
];

export const auditLogs = [
  { id: "al1", user: "Rahul Sharma", action: "Approved change order CO-006", when: "Today, 09:12", ip: "10.4.2.18" },
  { id: "al2", user: "System", action: "AI model v3.2 deployed", when: "Today, 06:00", ip: "system" },
  { id: "al3", user: "Suresh Iyer", action: "Updated PO-2418 promised date", when: "Yesterday, 16:44", ip: "10.4.2.31" },
  { id: "al4", user: "Meera Gupta", action: "Closed NCR-0121", when: "Yesterday, 14:20", ip: "10.4.2.22" },
];

/* ------------------------------------------------------------------ */
/* USE CASES (AI DECISION FLOW)                                        */
/* ------------------------------------------------------------------ */

export const useCases: UseCase[] = [
  {
    id: "uc1",
    title: "Module Delivery Delay",
    trigger: "Solar module inventory exhaustion vs balance delivery on critical path",
    codDelay: "8 days",
    costImpact: "₹4.16 Cr",
    confidence: 88,
    drivers: ["Inventory exhaustion 12-Aug", "Balance delivery 15-Aug", "Productivity 67%"],
    flow: ["ERP (Material Delivery)", "Data Harmonization", "Digital Twin", "Schedule Dependency", "Critical Path", "Risk Prediction", "Cost Impact", "AI Copilot", "Predictive Alert + Recovery"],
    recovery: [
      { option: "Increase installation crews 6 → 8", recovery: "+4 days" },
      { option: "Prioritise Blocks C & D (inventory available)", recovery: "+2 days" },
      { option: "Air shipment of remaining modules", recovery: "+3 days" },
    ],
  },
  {
    id: "uc2",
    title: "Labour Shortage",
    trigger: "480 headcount gap reducing productivity across structures package",
    codDelay: "6 days",
    costImpact: "₹3.0 Cr",
    confidence: 82,
    drivers: ["17% labour gap", "Productivity 82%", "Contractor absenteeism"],
    flow: ["Manual Entry (Labour)", "Data Harmonization", "Digital Twin", "Resource Model", "Productivity Prediction", "Schedule Impact", "Cost Impact", "Recovery"],
    recovery: [
      { option: "Mobilise 150 additional workers", recovery: "+3 days" },
      { option: "Introduce second shift", recovery: "+2 days" },
    ],
  },
  {
    id: "uc3",
    title: "Slow Piling Productivity",
    trigger: "Piling at 10,000/day vs 15,000 planned in Block C (critical path)",
    codDelay: "11 days",
    costImpact: "₹2.75 Cr",
    confidence: 85,
    drivers: ["33% productivity gap", "Rig breakdown PR-02", "Hard strata"],
    flow: ["Site Progress", "Data Harmonization", "Digital Twin", "Critical Path", "Risk Prediction", "Cost Impact", "Recovery"],
    recovery: [
      { option: "Mobilise 2 additional piling rigs", recovery: "+5 days" },
      { option: "Repair rig PR-02", recovery: "+3 days" },
    ],
  },
  {
    id: "uc4",
    title: "High NCR & Rework Trend",
    trigger: "Welding NCRs trending up 40% WoW in structures",
    codDelay: "—",
    costImpact: "₹3.6 Cr",
    confidence: 80,
    drivers: ["48 MT rework forecast", "Welding defects dominant", "Inspection backlog"],
    flow: ["QA/QC Module", "Data Harmonization", "Digital Twin", "Quality Model", "Rework Forecast", "Cost Escalation", "Recovery"],
    recovery: [
      { option: "Deploy additional QA inspector", recovery: "Rework -30%" },
      { option: "Welder re-certification drive", recovery: "Defects -40%" },
    ],
  },
  {
    id: "uc5",
    title: "Delayed Inverter Delivery",
    trigger: "PCU-3 inverter vendor slip of 9 days impacting commissioning",
    codDelay: "9 days",
    costImpact: "₹3.45 Cr",
    confidence: 84,
    drivers: ["Vendor delay confirmed", "Commissioning dependency", "No alternate ready"],
    flow: ["SAP Connector", "Data Harmonization", "Digital Twin", "Schedule Dependency", "Commissioning Impact", "Cost & Risk", "Recovery"],
    recovery: [
      { option: "Escalate & expedite with vendor", recovery: "+4 days" },
      { option: "Qualify alternate inverter vendor", recovery: "+3 days" },
    ],
  },
];

export const digitalTwinNodes = [
  { id: "material", label: "Solar Modules", type: "Material" },
  { id: "activity", label: "Module Installation", type: "Activity" },
  { id: "successor", label: "Stringing & Testing", type: "Activity" },
  { id: "milestone", label: "Commissioning", type: "Milestone" },
  { id: "cod", label: "COD", type: "Milestone" },
];
