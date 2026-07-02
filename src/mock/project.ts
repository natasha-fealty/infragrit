export const project = {
  name: "GreenSun Solar Park",
  code: "GSP-100MW-RJ",
  client: "GreenSun Renewables Pvt. Ltd.",
  epc: "InfraGrit EPC Solutions",
  capacity: "100 MW",
  location: "Bhadla, Rajasthan, India",
  coordinates: "27.53° N, 71.91° E",
  contractValue: 1250, // Crores
  currency: "INR",
  contractType: "LSTK EPC",
  technology: "Ground Mounted Utility Solar Plant",
  durationMonths: 12,
  plannedStart: "2026-01-15",
  plannedCod: "2027-01-15",
  forecastCod: "2027-01-23",
  overallProgress: 62.4,
  plannedProgress: 68.0,
  overallHealth: 71,
  dataCompleteness: 94,
  aiConfidence: 88,
  version: "v1.0.4",
  environment: "Demo",
  lastRefreshed: "2 min ago",
  integrationHealth: 96,
};

export const healthScores = [
  { label: "Schedule", score: 68, tone: "warning" as const },
  { label: "Cost", score: 74, tone: "warning" as const },
  { label: "Procurement", score: 61, tone: "danger" as const },
  { label: "Quality", score: 82, tone: "success" as const },
  { label: "Resources", score: 70, tone: "warning" as const },
  { label: "HSE", score: 88, tone: "success" as const },
];

export const overallHealthScore = { label: "Overall", score: 71, tone: "warning" as const };
