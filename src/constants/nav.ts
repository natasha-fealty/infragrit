import {
  LayoutDashboard,
  CalendarClock,
  Wallet,
  Package,
  Users,
  ShieldCheck,
  HardHat,
  FileStack,
  Sparkles,
  Bot,
  Plug,
  Database,
  Bell,
  FileBarChart,
  Settings,
} from "lucide-react";
import type { NavItem } from "@/types";

export const navItems: NavItem[] = [
  { label: "Command Centre", to: "/command-centre", icon: LayoutDashboard, group: "Overview" },
  { label: "Schedule Intelligence", to: "/schedule", icon: CalendarClock, group: "Intelligence" },
  { label: "Cost Intelligence", to: "/cost", icon: Wallet, group: "Intelligence" },
  { label: "Procurement Intelligence", to: "/procurement", icon: Package, group: "Intelligence" },
  { label: "Resource Intelligence", to: "/resources", icon: Users, group: "Intelligence" },
  { label: "Quality Intelligence", to: "/quality", icon: ShieldCheck, group: "Intelligence" },
  { label: "HSE Intelligence", to: "/hse", icon: HardHat, group: "Intelligence" },
  { label: "Engineering & Documents", to: "/documents", icon: FileStack, group: "Intelligence" },
  { label: "AI Insights & Predictions", to: "/predictions", icon: Sparkles, group: "AI" },
  { label: "AI Copilot", to: "/copilot", icon: Bot, group: "AI" },
  { label: "Data Integration Hub", to: "/integration", icon: Plug, group: "Data" },
  { label: "Data Quality", to: "/data-quality", icon: Database, group: "Data" },
  { label: "Alerts & Notifications", to: "/alerts", icon: Bell, badge: 4, group: "Data" },
  { label: "Reports & Analytics", to: "/reports", icon: FileBarChart, group: "Data" },
  { label: "Settings", to: "/settings", icon: Settings, group: "System" },
];

export const navGroups = ["Overview", "Intelligence", "AI", "Data", "System"];
