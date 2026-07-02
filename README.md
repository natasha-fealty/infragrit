# InfraGrit — Solar EPC Intelligence Platform

A high-fidelity **static React prototype** of InfraGrit, an AI-driven EPC Execution Intelligence Platform, built for a client demo around a representative Indian utility-scale solar project: **GreenSun Solar Park** (100 MW, Bhadla, Rajasthan · ₹1,250 Cr · LSTK EPC).

> Everything is static mock data — no backend, database, auth, or API. Every interaction (dialogs, tabs, toasts, simulations, charts) is driven by local state to feel like a live production SaaS product.

## ✨ Highlights

- **15 fully-designed screens** — Command Centre, Schedule / Cost / Procurement / Resource / Quality / HSE Intelligence, Engineering & Documents, AI Insights & Predictions, AI Copilot, Data Integration Hub, Data Quality, Alerts, Reports, Settings.
- **Enterprise design system** — Inter/Manrope typography, a deep-blue / teal / purple palette, glassmorphism, soft shadows, gradients, full **light & dark mode**.
- **Rich motion** — page transitions, staggered card entrances, animated counters, gauges, charts, shimmer skeletons and micro-interactions via **Framer Motion**.
- **AI-first storytelling** — predictive alerts, root-cause insights, a what-if simulation engine, an AI Copilot chat, and 5 preconfigured decision-flow use cases.
- **Real dashboard components** — Recharts visualizations, TanStack tables (sort / search / paginate), command palette (⌘K), and toast notifications.

## 🧱 Tech Stack

React 19 · Vite 6 · TypeScript · Tailwind CSS · React Router · Framer Motion · Recharts · TanStack Table · Radix UI (shadcn-style) · Lucide Icons · React Hook Form · Sonner.

## 🚀 Getting Started

```bash
pnpm install      # or npm install
pnpm dev          # start dev server → http://localhost:5173
pnpm build        # type-check + production build
pnpm preview      # preview the production build
```

## 🗂️ Project Structure

```
src/
├── components/
│   ├── ui/          # shadcn-style primitives (button, card, dialog, table…)
│   ├── shared/      # StatCard, ChartCard, DataTable, HealthGauge, AiInsightPanel…
│   ├── layout/      # Sidebar, Header, Footer, AppLayout, CommandSearch
│   └── theme-provider.tsx
├── pages/           # 15 screen components (one per route)
├── mock/            # static project + module mock data
├── constants/       # navigation config
├── hooks/           # useSimulatedLoad, useRefresh
├── lib/             # utils (formatters) + tone/color mappers
├── types/           # shared TypeScript types
└── index.css        # design tokens (CSS variables) + Tailwind layers
```

## 🧭 Key Screens

| Route | Module |
| --- | --- |
| `/command-centre` | CXO command centre — KPIs, health gauge, AI predictions & recommendations |
| `/schedule` | S-curve, interactive Gantt / critical path, delay Pareto, milestones |
| `/cost` | EVM (CPI/EAC/VAC), cost trends, package distribution, change orders |
| `/procurement` | PO register, vendor risk, inventory stockout prediction |
| `/resources` | Labour gap, equipment utilization, crew productivity |
| `/quality` | NCR trend, defect Pareto, rework forecast |
| `/hse` | Incident trends, site risk heatmap, corrective actions |
| `/documents` | Document register, revision tracker, AI drawing change analysis |
| `/predictions` | Risk matrix, what-if simulation engine, AI decision-flow use cases |
| `/copilot` | Natural-language AI project assistant |
| `/integration` | Enterprise connectors, bulk upload, manual & AI data capture |
| `/data-quality` | Completeness, freshness, validation errors, harmonization |
| `/alerts` | Severity-tiered alert centre |
| `/reports` | Report library + builder / preview |
| `/settings` | Users, roles, masters, thresholds, AI config, audit logs |

---

Built as a design & UX prototype. All figures are illustrative demo data for **ProcessGrit · InfraGrit**.
