import { ChevronDown, Plus, X } from "lucide-react";
import { Chip } from "./appui";

/* A coded recreation of Mochi's filter-condition builder, in the app's own
   chrome: the same "Status is qualified OR Status is won" query as the real
   one, built with our primitives so it stays sharp and theme-aware. */

function DropdownChip({ children }: { children: string }) {
  return (
    <span
      className="mono flex items-center gap-1.5 rounded-[4px] border px-2 py-1 text-[11.5px]"
      style={{ borderColor: "var(--app-line)", background: "var(--app-bg)", color: "var(--app-text)" }}
    >
      {children}
      <ChevronDown className="h-3 w-3" strokeWidth={1.8} style={{ color: "var(--app-faint)" }} />
    </span>
  );
}

const ROWS = [
  { conj: null, field: "Status", op: "is", value: "qualified" },
  { conj: "or", field: "Status", op: "is", value: "won" },
];

// a few real rows peeking out beneath the popover, so it reads as "filtering a
// live grid" rather than a form floating in space
const PREVIEW_ROWS = [
  { name: "Ava Thompson", email: "ava.thompson@ex…" },
  { name: "Isabella Garcia", email: "isabella.garcia@ex…" },
  { name: "Daniel Novak", email: "daniel.novak@exa…" },
  { name: "Hannah Fischer", email: "hannah.fischer@ex…" },
  { name: "Marcus Okafor", email: "marcus.okafor@exa…" },
  { name: "Sofia Martinez", email: "sofia.martinez@ex…" },
];

export default function FilterBuilder({ compact = false }: { compact?: boolean }) {
  const line = { borderColor: "var(--app-line)" };
  return (
    <div className="canvas appui w-full">
      <div className="flex h-[38px] items-center gap-2 border-b px-4" style={line}>
        <Chip tone="green" letter="L" />
        <span className="text-[12px]">Leads</span>
        <span className="text-[12px]" style={{ color: "var(--app-faint)" }}>/</span>
        <span className="text-[12px]" style={{ color: "var(--app-muted)" }}>Qualified pipeline</span>
      </div>

      <div className={`relative overflow-hidden ${compact ? "h-[380px]" : "h-[440px]"}`}>
        <div className="pointer-events-none absolute inset-0 flex flex-col opacity-55" aria-hidden>
          <div
            className="flex h-9 items-center gap-6 border-b px-4 text-[11px]"
            style={{ ...line, color: "var(--app-muted)" }}
          >
            <span className="w-36">Name</span>
            <span>Email</span>
          </div>
          {PREVIEW_ROWS.map((r) => (
            <div key={r.name} className="flex h-9 items-center gap-6 border-b px-4 text-[12px]" style={line}>
              <span className="w-36">{r.name}</span>
              <span className="mono" style={{ color: "var(--app-muted)" }}>{r.email}</span>
            </div>
          ))}
        </div>

        <div
          className="absolute left-4 top-4 w-[calc(100%-2rem)] max-w-sm rounded-[8px] border p-3.5 shadow-[0_2px_6px_rgba(0,0,0,0.06),0_18px_46px_-14px_rgba(0,0,0,0.32)] sm:max-w-xs"
          style={{ ...line, background: "var(--app-bg)" }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[12.5px] font-medium">Filter conditions</span>
            <X className="h-3.5 w-3.5" strokeWidth={1.8} style={{ color: "var(--app-faint)" }} />
          </div>

          <div className="mt-3 space-y-2">
            {ROWS.map((r, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="w-9 flex-none text-[11px]" style={{ color: "var(--app-muted)" }}>
                  {r.conj ?? "When"}
                </span>
                <DropdownChip>{r.field}</DropdownChip>
                <DropdownChip>{r.op}</DropdownChip>
                <DropdownChip>{r.value}</DropdownChip>
                <X className="ml-auto h-3 w-3 flex-none" strokeWidth={1.8} style={{ color: "var(--app-faint)" }} />
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-4 text-[12px]" style={{ color: "var(--app-muted)" }}>
            <span className="flex items-center gap-1">
              <Plus className="h-3 w-3" strokeWidth={2} /> Condition
            </span>
            <span className="flex items-center gap-1">
              <Plus className="h-3 w-3" strokeWidth={2} /> Group
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
