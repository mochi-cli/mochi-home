import { Bot, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

/* A coded recreation of Mochi's record-history panel — same shape and copy as
   the real one (record LEAD-001, agent "claude-code"), built with our own
   primitives instead of a screenshot so it stays sharp and theme-aware. */

interface Entry {
  time: string;
  field?: string;
  from?: string;
  to: string;
  note?: string;
}

const ENTRIES: Entry[] = [
  { time: "03:08 PM", field: "Notes", to: "Signed up for the free trial via the pricing page. Had a great intro call, moving to proposal stage." },
  { time: "03:08 PM", field: "Status", from: "Contacted", to: "Qualified" },
  { time: "03:07 PM", field: "Status", from: "New", to: "Contacted" },
  { time: "06:01 AM", field: "Source", to: "Website" },
  { time: "06:01 AM", field: "Status", to: "New" },
  { time: "05:57 AM", note: "Created row", to: "" },
];

export default function AuditHistory({ compact = false }: { compact?: boolean }) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-lift)]">
      {/* window chrome */}
      <div className="flex h-9 items-center gap-2 border-b border-border bg-secondary/70 px-4">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
      </div>

      {/* record header */}
      <div className={cn("flex items-center gap-3 border-b border-border px-4", compact ? "h-11" : "h-12")}>
        <span className="flex items-center gap-1 text-muted-foreground">
          <ChevronLeft className="h-3.5 w-3.5" />
          <ChevronRight className="h-3.5 w-3.5" />
        </span>
        <span className="text-[13px] font-semibold text-foreground">LEAD-001</span>
        <X className="ml-auto h-3.5 w-3.5 text-muted-foreground" />
      </div>

      {/* tabs */}
      <div className="flex items-center gap-5 border-b border-border px-4 text-[13px] text-muted-foreground">
        <span className="py-2.5">Fields</span>
        <span className="py-2.5">Comments</span>
        <span className="border-b-2 border-foreground py-2.5 font-medium text-foreground">History</span>
      </div>

      {/* history list */}
      <div className={cn("space-y-4 overflow-y-auto px-4 py-4", compact ? "h-[420px]" : "h-[480px]")}>
        {ENTRIES.map((e, i) => (
          <div key={i} className="flex gap-2.5">
            <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-foreground text-background">
              <Bot className="h-3 w-3" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2">
                <span className="mono text-[12px] font-semibold text-foreground">claude-code</span>
                <span className="text-[11px] text-muted-foreground">{e.time}</span>
              </div>
              {e.note ? (
                <p className="mt-0.5 text-[13px] text-muted-foreground">{e.note}</p>
              ) : e.from ? (
                <p className="mt-0.5 text-[13px] text-foreground">
                  {e.field}{" "}
                  <span className="text-muted-foreground line-through">{e.from}</span>{" "}
                  <span className="text-muted-foreground">→</span> {e.to}
                </p>
              ) : e.field === "Notes" ? (
                <p className="mt-0.5 text-[13px] leading-relaxed text-foreground">
                  {e.field} <span className="text-muted-foreground">→</span> {e.to}
                </p>
              ) : (
                <p className="mt-0.5 text-[13px] text-foreground">
                  {e.field} <span className="text-muted-foreground">→</span> {e.to}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
