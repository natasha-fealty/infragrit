import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  Send,
  Mic,
  Paperclip,
  Plus,
  FileText,
  Sparkles,
  MessageSquare,
  Lightbulb,
  MapPin,
  Zap,
  Gauge,
  CalendarClock,
  Share2,
  Download,
  FileSearch,
  AlertTriangle,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SeverityBadge } from "@/components/shared/Badges";
import { fadeInUp } from "@/components/shared/motion";
import {
  copilotSuggestions,
  copilotHistory,
  copilotAnswers,
  copilotDefaultAnswer,
  alerts,
} from "@/mock/data";
import { project, overallHealthScore } from "@/mock/project";
import { cn, formatDate } from "@/lib/utils";
import type { ChatMessage, HealthTone } from "@/types";

let idSeq = 100;
const nextId = () => `m${idSeq++}`;

const chipVariant: Record<HealthTone, "success" | "warning" | "danger" | "neutral"> = {
  success: "success",
  warning: "warning",
  danger: "danger",
  neutral: "neutral",
};

function resolveAnswer(q: string): Omit<ChatMessage, "id" | "role"> {
  const keys = Object.keys(copilotAnswers);
  const exact = keys.find((k) => k.toLowerCase() === q.toLowerCase().trim());
  if (exact) return copilotAnswers[exact];
  const partial = keys.find(
    (k) =>
      q.toLowerCase().includes(k.toLowerCase()) ||
      k.toLowerCase().includes(q.toLowerCase().trim())
  );
  if (partial) return copilotAnswers[partial];
  return copilotDefaultAnswer;
}

const seededMessages: ChatMessage[] = [
  {
    id: "m1",
    role: "assistant",
    content:
      "Hello — I'm the InfraGrit Copilot for GreenSun Solar Park. I've analysed the latest schedule, cost, procurement and quality data. Ask me anything, or pick a suggested question to get started.",
    chips: [
      { label: "Health", value: `${overallHealthScore.score}/100`, tone: "warning" },
      { label: "AI Confidence", value: `${project.aiConfidence}%`, tone: "success" },
    ],
  },
  {
    id: "m2",
    role: "user",
    content: "Why are we delayed?",
  },
  {
    id: "m3",
    role: "assistant",
    ...copilotAnswers["Why are we delayed?"],
  },
];

/* ------------------------------------------------------------------ */

function ChipBadge({ chip }: { chip: NonNullable<ChatMessage["chips"]>[number] }) {
  return (
    <Badge variant={chipVariant[chip.tone ?? "neutral"]} className="gap-1">
      <span className="text-[10px] font-medium uppercase tracking-wide opacity-70">
        {chip.label}
      </span>
      <span className="font-semibold">{chip.value}</span>
    </Badge>
  );
}

function SourcePill({ source }: { source: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/40 px-2 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground">
      <FileText className="h-3 w-3" />
      {source}
    </span>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="show"
      className={cn("flex gap-3", isUser && "flex-row-reverse")}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
          isUser
            ? "bg-muted text-muted-foreground"
            : "bg-gradient-brand text-white shadow-card"
        )}
      >
        {isUser ? (
          <span className="text-xs font-semibold">You</span>
        ) : (
          <Bot className="h-4 w-4" />
        )}
      </div>
      <div className={cn("min-w-0 max-w-[85%] space-y-2", isUser && "flex flex-col items-end")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
            isUser
              ? "rounded-tr-sm bg-primary text-primary-foreground"
              : "rounded-tl-sm border border-border bg-card text-foreground"
          )}
        >
          {message.content}
        </div>
        {message.chips && message.chips.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {message.chips.map((c) => (
              <ChipBadge key={c.label} chip={c} />
            ))}
          </div>
        )}
        {message.sources && message.sources.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-medium text-muted-foreground">Sources</span>
            {message.sources.map((s) => (
              <SourcePill key={s} source={s} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="flex gap-3"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-brand text-white shadow-card">
        <Bot className="h-4 w-4" />
      </div>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-border bg-card px-4 py-3.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-2 w-2 rounded-full bg-muted-foreground/60"
            animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */

export default function Copilot() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>(seededMessages);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [activeChat, setActiveChat] = useState(copilotHistory[0].id);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const send = (text: string) => {
    const q = text.trim();
    if (!q || typing) return;
    setInput("");
    setMessages((prev) => [...prev, { id: nextId(), role: "user", content: q }]);
    setTyping(true);
    window.setTimeout(() => {
      const answer = resolveAnswer(q);
      setTyping(false);
      setMessages((prev) => [...prev, { id: nextId(), role: "assistant", ...answer }]);
    }, 700);
  };

  const newChat = () => {
    setMessages([seededMessages[0]]);
    toast.success("New chat started", { description: "Ask the Copilot anything about GreenSun Solar Park." });
  };

  const topAlerts = alerts.slice(0, 3);

  const projectContext = [
    { icon: Zap, label: "Capacity", value: project.capacity },
    { icon: MapPin, label: "Location", value: project.location },
    { icon: Gauge, label: "Progress", value: `${project.overallProgress}%` },
    { icon: Sparkles, label: "Health", value: `${project.overallHealth}/100` },
    { icon: CalendarClock, label: "Forecast COD", value: formatDate(project.forecastCod) },
  ];

  const features = [
    { icon: Mic, label: "Voice Query", desc: "Voice input activated — start speaking your question." },
    { icon: FileSearch, label: "Document Query", desc: "Search across 1,284 project documents." },
    { icon: Download, label: "Export Chat", desc: "Conversation exported as PDF." },
    { icon: Share2, label: "Share Chat", desc: "Shareable link copied to clipboard." },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[240px_minmax(0,1fr)_300px]">
        {/* LEFT — Conversation History */}
        <motion.aside
          variants={fadeInUp}
          initial="hidden"
          animate="show"
          className="hidden flex-col rounded-xl border border-border bg-card p-3 lg:flex"
        >
          <Button variant="gradient" className="w-full justify-start" onClick={newChat}>
            <Plus className="h-4 w-4" />
            New chat
          </Button>
          <p className="mb-1 mt-4 px-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Conversation History
          </p>
          <ScrollArea className="-mx-1 max-h-[520px] flex-1 px-1">
            <div className="space-y-1">
              {copilotHistory.map((h) => (
                <button
                  key={h.id}
                  onClick={() => setActiveChat(h.id)}
                  className={cn(
                    "group flex w-full items-start gap-2 rounded-lg px-2.5 py-2 text-left transition-colors",
                    activeChat === h.id
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-muted/60"
                  )}
                >
                  <MessageSquare
                    className={cn(
                      "mt-0.5 h-3.5 w-3.5 shrink-0",
                      activeChat === h.id ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{h.title}</span>
                    <span className="block text-[11px] text-muted-foreground">{h.when}</span>
                  </span>
                </button>
              ))}
            </div>
          </ScrollArea>
        </motion.aside>

        {/* CENTER — Chat window */}
        <motion.section
          variants={fadeInUp}
          initial="hidden"
          animate="show"
          className="flex min-h-[560px] flex-col overflow-hidden rounded-xl border border-border bg-card sm:min-h-[640px]"
        >
          <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3.5 sm:px-5">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand text-white shadow-card">
                <Bot className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="font-display text-sm font-semibold leading-tight">InfraGrit Copilot</p>
                <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
                  <span className="truncate">Online · {project.name}</span>
                </p>
              </div>
            </div>
            <Badge variant="accent" className="shrink-0 gap-1">
              <Sparkles className="h-3 w-3" /> AI {project.aiConfidence}%
            </Badge>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-5 overflow-y-auto px-4 py-5 sm:px-5">
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}
            <AnimatePresence>{typing && <TypingIndicator />}</AnimatePresence>
          </div>

          {/* Input bar */}
          <div className="border-t border-border bg-muted/20 p-3">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {copilotSuggestions.slice(0, 3).map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="flex items-end gap-2 rounded-xl border border-border bg-card p-2 shadow-card focus-within:border-primary/40">
              <Button
                variant="ghost"
                size="icon-sm"
                className="shrink-0"
                onClick={() => toast.info("Attach file", { description: "Drag a drawing, DPR or BOQ into the chat." })}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                placeholder="Ask about delays, cost, materials, or run a what-if scenario…"
                className="max-h-32 min-h-[40px] resize-none border-0 bg-transparent px-1 py-2 shadow-none focus-visible:ring-0"
                rows={1}
              />
              <Button
                variant="ghost"
                size="icon-sm"
                className="shrink-0"
                onClick={() => toast.info("Voice query", { description: "Listening… speak your question." })}
              >
                <Mic className="h-4 w-4" />
              </Button>
              <Button
                variant="gradient"
                size="icon"
                className="shrink-0"
                disabled={!input.trim() || typing}
                onClick={() => send(input)}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.section>

        {/* RIGHT — Context panel */}
        <motion.aside
          variants={fadeInUp}
          initial="hidden"
          animate="show"
          className="hidden flex-col gap-4 lg:flex"
        >
          {/* Suggested questions */}
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Lightbulb className="h-3.5 w-3.5 text-accent" /> Suggested Questions
            </p>
            <div className="space-y-1.5">
              {copilotSuggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="group flex w-full items-center justify-between gap-2 rounded-lg border border-transparent bg-muted/40 px-3 py-2 text-left text-sm transition-colors hover:border-primary/30 hover:bg-primary/5"
                >
                  <span className="min-w-0 truncate">{s}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                </button>
              ))}
            </div>
          </div>

          {/* Project context */}
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Project Context
            </p>
            <p className="font-display text-sm font-semibold">{project.name}</p>
            <p className="mb-3 text-xs text-muted-foreground">{project.contractType} · ₹{project.contractValue} Cr</p>
            <Separator className="mb-3" />
            <div className="space-y-2.5">
              {projectContext.map((c) => (
                <div key={c.label} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <c.icon className="h-3.5 w-3.5" />
                    {c.label}
                  </span>
                  <span className="font-medium">{c.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent alerts */}
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <AlertTriangle className="h-3.5 w-3.5 text-destructive" /> Recent Alerts
              </p>
              <button
                onClick={() => navigate("/alerts")}
                className="text-[11px] font-medium text-primary hover:underline"
              >
                View all
              </button>
            </div>
            <div className="space-y-2">
              {topAlerts.map((a) => (
                <div key={a.id} className="rounded-lg border border-border p-2.5 transition-colors hover:bg-muted/40">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <SeverityBadge severity={a.severity} />
                    <span className="text-[10px] text-muted-foreground">{a.category}</span>
                  </div>
                  <p className="text-xs font-medium leading-snug">{a.title}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Feature buttons */}
          <div className="grid grid-cols-2 gap-2">
            {features.map((f) => (
              <Button
                key={f.label}
                variant="outline"
                size="sm"
                className="justify-start"
                onClick={() => toast.success(f.label, { description: f.desc })}
              >
                <f.icon className="h-4 w-4" />
                {f.label}
              </Button>
            ))}
          </div>
        </motion.aside>
      </div>
    </div>
  );
}
