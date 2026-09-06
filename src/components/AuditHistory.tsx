import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Chip } from "./appui";

/* A coded recreation of Mochi's record-history panel, in the app's own chrome:
   same shape and copy as the real one (record LEAD-001, agent "claude-code"),
   built with our primitives instead of a screenshot so it stays sharp and
   theme-aware. */

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
  const line = { borderColor: "var(--app-line)" };
  return (
    <div className="canvas appui w-full">
      <div className="flex h-[38px] items-center gap-3 border-b px-4" style={line}>
        <span className="flex items-center gap-1" style={{ color: "var(--app-faint)" }}>
          <ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.8} />
          <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.8} />
        </span>
        <span className="mono text-[12px]">LEAD-001</span>
        <X className="ml-auto h-3.5 w-3.5" strokeWidth={1.8} style={{ color: "var(--app-faint)" }} />
      </div>

      <div className="flex items-center gap-5 border-b px-4 text-[12px]" style={line}>
        <span className="py-2.5" style={{ color: "var(--app-muted)" }}>Fields</span>
        <span className="py-2.5" style={{ color: "var(--app-muted)" }}>Comments</span>
        <span
          className="border-b-2 py-2.5 font-medium"
          style={{ borderColor: "var(--app-text)", color: "var(--app-text)" }}
        >
          History
        </span>
      </div>

      <div className={`space-y-4 overflow-y-auto px-4 py-4 ${compact ? "h-[380px]" : "h-[440px]"}`}>
        {ENTRIES.map((e, i) => (
          <div key={i} className="flex gap-2.5">
            <span className="mt-0.5">
              <Chip tone="lilac" letter="C" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2">
                <span className="mono text-[12px] font-medium">claude-code</span>
                <span className="text-[11px]" style={{ color: "var(--app-faint)" }}>{e.time}</span>
              </div>
              {e.note ? (
                <p className="mt-0.5 text-[12.5px]" style={{ color: "var(--app-muted)" }}>{e.note}</p>
              ) : (
                <p className="mt-0.5 text-[12.5px] leading-relaxed">
                  <span style={{ color: "var(--app-muted)" }}>{e.field}</span>{" "}
                  {e.from && (
                    <>
                      <span className="line-through" style={{ color: "var(--app-faint)" }}>{e.from}</span>{" "}
                    </>
                  )}
                  <span style={{ color: "var(--app-faint)" }}>&#8594;</span> {e.to}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
