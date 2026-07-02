import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, PanelLeftClose } from "lucide-react";
import { navGroups, navItems } from "@/constants/nav";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  collapsed: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
}

export function Sidebar({ collapsed, onToggle, onNavigate }: Props) {
  return (
    <aside
      className={cn(
        "flex h-full flex-col bg-sidebar text-sidebar-foreground transition-[width] duration-300 ease-out",
        collapsed ? "w-[70px]" : "w-[260px]"
      )}
    >
      {/* Brand */}
      <div className="flex h-[70px] items-center justify-between px-4">
        <Logo collapsed={collapsed} />
        {!collapsed && (
          <button
            onClick={onToggle}
            className="hidden rounded-lg p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white lg:block"
            aria-label="Collapse sidebar"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="no-scrollbar flex-1 overflow-y-auto px-3 pb-4">
        <TooltipProvider delayDuration={0}>
          {navGroups.map((group) => {
            const items = navItems.filter((n) => n.group === group);
            if (!items.length) return null;
            return (
              <div key={group} className="mb-1 mt-4 first:mt-1">
                {!collapsed && (
                  <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-white/35">
                    {group}
                  </p>
                )}
                <div className="space-y-0.5">
                  {items.map((item) => {
                    const Icon = item.icon;
                    const link = (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={onNavigate}
                        className={({ isActive }) =>
                          cn(
                            "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                            collapsed && "justify-center px-0",
                            isActive
                              ? "bg-primary/15 text-white"
                              : "text-white/60 hover:bg-white/5 hover:text-white"
                          )
                        }
                      >
                        {({ isActive }) => (
                          <>
                            {isActive && (
                              <motion.span
                                layoutId="sidebar-active"
                                className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary"
                                transition={{ type: "spring", stiffness: 400, damping: 32 }}
                              />
                            )}
                            <Icon className="h-[18px] w-[18px] shrink-0" />
                            {!collapsed && <span className="truncate">{item.label}</span>}
                            {!collapsed && item.badge != null && (
                              <Badge variant="danger" className="ml-auto h-5 min-w-5 justify-center px-1.5 py-0 text-[10px]">
                                {item.badge}
                              </Badge>
                            )}
                          </>
                        )}
                      </NavLink>
                    );

                    return collapsed ? (
                      <Tooltip key={item.to}>
                        <TooltipTrigger asChild>{link}</TooltipTrigger>
                        <TooltipContent side="right" className="flex items-center gap-2">
                          {item.label}
                          {item.badge != null && (
                            <span className="rounded bg-destructive px-1 text-[10px] font-bold text-white">
                              {item.badge}
                            </span>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      link
                    );
                  })}
                </div>
              </div>
            );
          })}
        </TooltipProvider>
      </nav>

      {/* Collapse toggle (collapsed state) */}
      {collapsed && (
        <button
          onClick={onToggle}
          className="mx-3 mb-3 hidden items-center justify-center rounded-lg py-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white lg:flex"
          aria-label="Expand sidebar"
        >
          <ChevronLeft className="h-4 w-4 rotate-180" />
        </button>
      )}

      {/* Upgrade / status card */}
      {!collapsed && (
        <div className="mx-3 mb-4 rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            <p className="text-xs font-semibold text-white">AI Engine Active</p>
          </div>
          <p className="mt-1 text-[11px] leading-snug text-white/45">
            Live predictions running on 14 data streams.
          </p>
        </div>
      )}
    </aside>
  );
}
