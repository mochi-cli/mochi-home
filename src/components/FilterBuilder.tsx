import { ChevronDown, X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/* A coded recreation of Mochi's filter-condition builder — same "Status is
   qualified OR Status is won" query as the real one, built with our own
   primitives so it stays sharp, theme-aware, and consistent with the rest
   of the site's shadcn components instead of a screenshot. */

function DropdownChip({ children }: { children: string }) {
  return (
    <span className="mono flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-[12px] text-foreground">
      {children}
      <ChevronDown className="h-3 w-3 text-muted-foreground" />
    </span>
  );
}

const ROWS = [
  { conj: null, field: "Status", op: "is", value: "qualified" },
  { conj: "or", field: "Status", op: "is", value: "won" },
];

// a few real rows peeking out beneath the popover, so it reads as "filtering
// a live grid" rather than a form floating in space
const PREVIEW_ROWS = [
  { name: "Ava Thompson", email: "ava.thompson@ex..." },
  { name: "Isabella Garcia", email: "isabella.garcia@ex..." },
  { name: "Daniel Novak", email: "daniel.novak@exa..." },
  { name: "Hannah Fischer", email: "hannah.fischer@ex..." },
  { name: "Marcus Okafor", email: "marcus.okafor@exa..." },
];

export default function FilterBuilder({ compact = false }: { compact?: boolean }) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-lift)]">
      {/* window chrome */}
      <div className="flex h-9 items-center gap-2 border-b border-border bg-secondary/70 px-4">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
      </div>

      {/* faded grid peeking out behind the popover */}
      <div className={cn("relative overflow-hidden bg-secondary/20", compact ? "h-[340px]" : "h-[380px]")}>
        <div className="pointer-events-none absolute inset-0 flex flex-col gap-px opacity-50">
          <div className="flex h-9 items-center gap-6 border-b border-border bg-card px-4 text-[11px] font-medium text-muted-foreground">
            <span className="w-32">Name</span>
            <span>Email</span>
          </div>
          {PREVIEW_ROWS.map((r) => (
            <div key={r.name} className="flex h-9 items-center gap-6 border-b border-border bg-card px-4 text-[12px]">
              <span className="w-32 font-medium text-foreground">{r.name}</span>
              <span className="mono text-muted-foreground">{r.email}</span>
            </div>
          ))}
        </div>

        {/* the popover itself */}
        <div className="absolute left-4 top-4 w-[calc(100%-2rem)] max-w-sm rounded-xl border border-border bg-popover p-4 shadow-lg sm:max-w-xs">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-foreground">Filter conditions</span>
            <X className="h-3.5 w-3.5 text-muted-foreground" />
          </div>

          <div className="mt-3 space-y-2">
            {ROWS.map((r, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="w-9 flex-none text-[11px] text-muted-foreground">
                  {r.conj ?? "When"}
                </span>
                <DropdownChip>{r.field}</DropdownChip>
                <DropdownChip>{r.op}</DropdownChip>
                <DropdownChip>{r.value}</DropdownChip>
                <X className="ml-auto h-3 w-3 flex-none text-muted-foreground" />
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-4 text-[12px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Plus className="h-3 w-3" /> Condition
            </span>
            <span className="flex items-center gap-1">
              <Plus className="h-3 w-3" /> Group
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
