import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as Indian currency in Crores (₹ Cr). */
export function formatCr(value: number, digits = 2): string {
  return `₹${value.toFixed(digits)} Cr`;
}

/** Format a large rupee amount with Indian grouping. */
export function formatINR(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

/** Compact number formatting (12.4k, 1.2M). */
export function formatCompact(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-IN").format(value);
}

export function formatPct(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`;
}

/** e.g. "12 Aug 2026" */
export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** e.g. "12 Aug, 09:42" */
export function formatDateTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** relative-ish label for demo activity feeds */
export function timeAgo(minutesAgo: number): string {
  if (minutesAgo < 1) return "just now";
  if (minutesAgo < 60) return `${Math.round(minutesAgo)}m ago`;
  const hours = minutesAgo / 60;
  if (hours < 24) return `${Math.round(hours)}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** Deterministic pseudo-random for stable demo sparklines. */
export function seededSeries(seed: number, count: number, base = 50, spread = 30): number[] {
  const out: number[] = [];
  let s = seed;
  for (let i = 0; i < count; i++) {
    s = (s * 9301 + 49297) % 233280;
    const rnd = s / 233280;
    out.push(Math.round(base + (rnd - 0.5) * spread + i * (spread / count / 2)));
  }
  return out;
}

export function clamp(v: number, min: number, max: number): number {
  return Math.min(Math.max(v, min), max);
}

/** simulate an async action for demo interactions */
export function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
