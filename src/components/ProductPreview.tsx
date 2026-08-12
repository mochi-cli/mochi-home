import { Filter, ArrowUpDown, Group, Zap, Search, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

// Collection tabs — colors mirror the auto-assigned letter icons the real
// Mochi table app gives every collection (seen live at mochi://tables).
const COLLECTIONS = [
  { label: "Customers", letter: "C", bg: "#d1fbe8", fg: "#047857" },
  { label: "Deals", letter: "D", bg: "#dbeafe", fg: "#1d4ed8" },
  { label: "Interactions", letter: "I", bg: "#fef3c7", fg: "#b45309" },
  { label: "Leads", letter: "L", bg: "#ede9fe", fg: "#6d28d9" },
  { label: "Products", letter: "P", bg: "#fee2e2", fg: "#b91c1c" },
];

// Real rows read from the "Deals" table seeded in the live Mochi demo
// workspace via the mochi-table MCP tools — not fabricated copy.
export type Stage = "Discovery" | "Negotiation" | "Closed won";
export interface Deal {
  company: string;
  stage: Stage;
  owner: string;
  value: number;
  close: string;
}
export const DEALS: Deal[] = [
  { company: "VisionQuest Labs", stage: "Discovery", owner: "James Cooper", value: 14300, close: "Aug 22" },
  { company: "Acetube Inc.", stage: "Negotiation", owner: "Charlotte King", value: 48200, close: "Aug 29" },
  { company: "LKS Retainer", stage: "Discovery", owner: "Benjamin Taylor", value: 6500, close: "Sep 5" },
  { company: "Timbershadow", stage: "Closed won", owner: "Casey Park", value: 61540, close: "Aug 10" },
  { company: "Northstar Robotics", stage: "Negotiation", owner: "Priya Shah", value: 32900, close: "Sep 12" },
];

function StageBadge({ stage }: { stage: Stage }) {
  if (stage === "Closed won") {
    return (
      <Badge className="border-transparent bg-brand-soft text-brand-soft-foreground">
        {stage}
      </Badge>
    );
  }
  return <Badge variant="outline">{stage}</Badge>;
}

const fmtUSD = (n: number) => `$${n.toLocaleString("en-US")}`;

export default function ProductPreview({
  compact = false,
  chrome = false,
  rows = DEALS,
  highlight = null,
  filterLabel = null,
  writing = false,
}: {
  compact?: boolean;
  chrome?: boolean;
  /** rows to render — the hero demo drives these from the chat script */
  rows?: Deal[];
  /** company name to flash when the agent has just written it */
  highlight?: string | null;
  /** active view filter, shown as a chip in the toolbar */
  filterLabel?: string | null;
  /** true while a write is in flight, so the sync dot reads as busy */
  writing?: boolean;
}) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-lift)]">
      {chrome && (
        <div className="flex h-9 items-center gap-2 border-b border-border bg-secondary/70 px-4">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
      )}

      {/* tab strip */}
      <div className={cn("flex items-center gap-1 overflow-x-auto border-b border-border bg-secondary/40 px-3", compact ? "h-10" : "h-12")}>
        {COLLECTIONS.map((c) => {
          const active = c.label === "Deals";
          return (
            <span
              key={c.label}
              className={cn(
                "flex flex-none items-center gap-1.5 whitespace-nowrap rounded-t-md px-2.5 py-1.5 text-xs font-medium",
                active ? "bg-card text-foreground shadow-[0_-1px_0_var(--border)_inset]" : "text-muted-foreground"
              )}
            >
              <span
                className="flex h-4 w-4 items-center justify-center rounded text-[10px] font-semibold"
                style={{ backgroundColor: c.bg, color: c.fg }}
              >
                {c.letter}
              </span>
              {c.label}
            </span>
          );
        })}
      </div>

      {/* toolbar */}
      <div className={cn("flex items-center gap-3 border-b border-border px-4 text-xs text-muted-foreground", compact ? "h-10" : "h-12")}>
        <span className="font-medium text-foreground">Grid view</span>
        <span className="hidden items-center gap-3 sm:flex">
          <Filter className="h-3.5 w-3.5" />
          <ArrowUpDown className="h-3.5 w-3.5" />
          <Group className="h-3.5 w-3.5" />
          <Zap className="h-3.5 w-3.5" />
        </span>
        {filterLabel && (
          <span className="flex animate-in fade-in zoom-in-95 items-center gap-1.5 rounded-md bg-brand-soft px-2 py-1 text-[11px] font-medium text-brand-soft-foreground duration-300">
            <Filter className="h-3 w-3" />
            {filterLabel}
          </span>
        )}
        <span className="ml-auto flex items-center gap-2">
          <span className="hidden items-center gap-1.5 rounded-md border border-border px-2 py-1 sm:flex">
            <Search className="h-3 w-3" />
            <span className="mono text-[10px]">⌘F</span>
          </span>
          <span className="flex items-center gap-1 rounded-md bg-primary px-2 py-1 font-medium text-primary-foreground">
            <Plus className="h-3 w-3" />
            New
          </span>
        </span>
      </div>

      {/* grid */}
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-10 text-muted-foreground">#</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Stage</TableHead>
            <TableHead className="hidden sm:table-cell">Owner</TableHead>
            <TableHead className="text-right">Value</TableHead>
            <TableHead className="hidden text-right md:table-cell">Close date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((d, i) => (
            <TableRow
              key={d.company}
              className={cn(
                "animate-in fade-in slide-in-from-bottom-1 duration-300",
                d.company === highlight && "bg-brand-soft/60 hover:bg-brand-soft/60"
              )}
            >
              <TableCell className="text-muted-foreground">{i + 1}</TableCell>
              <TableCell className="font-medium text-foreground">{d.company}</TableCell>
              <TableCell>
                <StageBadge stage={d.stage} />
              </TableCell>
              <TableCell className="hidden text-muted-foreground sm:table-cell">{d.owner}</TableCell>
              <TableCell className="text-right font-medium text-foreground">{fmtUSD(d.value)}</TableCell>
              <TableCell className="hidden text-right text-muted-foreground md:table-cell">{d.close}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* status bar */}
      <div className="flex h-9 items-center gap-3 border-t border-border bg-secondary/40 px-4 text-[11px] text-muted-foreground">
        <span>
          Showing {rows.length}
          {filterLabel && ` of ${DEALS.length}`}
        </span>
        <span className="flex items-center gap-1.5">
          <span className={cn("h-1.5 w-1.5 rounded-full bg-brand", writing && "animate-pulse")} />
          {writing ? "writing…" : "in sync"}
        </span>
        <span className="ml-auto hidden sm:inline">Workspace: Mochi Demo</span>
      </div>
    </div>
  );
}
