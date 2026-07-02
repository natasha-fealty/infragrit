import { Link } from "react-router-dom";
import { Bell, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { alerts } from "@/mock/data";
import { SeverityBadge } from "@/components/shared/Badges";
import { timeAgo } from "@/lib/utils";

const dotColor: Record<string, string> = {
  critical: "bg-destructive",
  high: "bg-warning",
  medium: "bg-brand-cyan",
  low: "bg-muted-foreground",
};

export function NotificationsMenu() {
  const recent = alerts.slice(0, 6);
  const unread = alerts.filter((a) => a.status === "New").length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-[18px] w-[18px]" />
          {unread > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
              {unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[380px] p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <p className="font-display text-sm font-semibold">Notifications</p>
            <p className="text-xs text-muted-foreground">{unread} new alerts</p>
          </div>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-primary">
            Mark all read
          </Button>
        </div>
        <ScrollArea className="h-[360px]">
          <div className="divide-y divide-border/70">
            {recent.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex cursor-pointer gap-3 px-4 py-3 transition-colors hover:bg-muted/50"
              >
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dotColor[a.severity]}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium leading-snug">{a.title}</p>
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{a.description}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <SeverityBadge severity={a.severity} />
                    <span className="text-[11px] text-muted-foreground">{timeAgo(a.minutesAgo)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
        <div className="border-t border-border p-2">
          <Button asChild variant="ghost" className="w-full justify-between text-sm">
            <Link to="/alerts">
              View all alerts
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
