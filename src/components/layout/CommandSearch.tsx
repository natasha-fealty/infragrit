import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, CornerDownLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { navItems } from "@/constants/nav";
import { cn } from "@/lib/utils";

export function CommandSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return navItems;
    return navItems.filter((n) => n.label.toLowerCase().includes(q));
  }, [query]);

  const go = (to: string) => {
    navigate(to);
    setOpen(false);
    setQuery("");
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group flex h-9 w-9 items-center justify-center gap-2 rounded-lg border border-border bg-muted/40 px-0 text-sm text-muted-foreground transition-colors hover:bg-muted lg:w-64 lg:justify-start lg:px-3"
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="hidden lg:inline">Search modules…</span>
        <kbd className="ml-auto hidden items-center gap-0.5 rounded border border-border bg-card px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground lg:inline-flex">
          ⌘K
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl gap-0 overflow-hidden p-0">
          <div className="flex items-center gap-3 border-b border-border px-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              autoFocus
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") setActive((a) => Math.min(a + 1, results.length - 1));
                if (e.key === "ArrowUp") setActive((a) => Math.max(a - 1, 0));
                if (e.key === "Enter" && results[active]) go(results[active].to);
              }}
              placeholder="Search screens, modules, actions…"
              className="h-14 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="max-h-[320px] overflow-y-auto p-2">
            <p className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Modules
            </p>
            {results.map((r, i) => {
              const Icon = r.icon;
              return (
                <button
                  key={r.to}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(r.to)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-sm transition-colors",
                    active === i ? "bg-muted text-foreground" : "text-muted-foreground"
                  )}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="font-medium text-foreground">{r.label}</span>
                  {active === i && (
                    <CornerDownLeft className="ml-auto h-3.5 w-3.5 text-muted-foreground" />
                  )}
                </button>
              );
            })}
            {!results.length && (
              <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                No modules match “{query}”.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
