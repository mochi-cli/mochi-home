"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Users, BadgeCheck, Box, ListChecks } from "lucide-react";
import Reveal from "./Reveal";
import { useLang } from "./LanguageProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ---------- cell tone helpers ----------
// Neutral by default; the one brand accent is reserved for the "positive"
// outcome in each template (won deal, in-stock, done task, active hire).
type Tone = "brand" | "neutral" | "outline";
function StatusBadge({ tone, children }: { tone: Tone; children: ReactNode }) {
  if (tone === "brand") {
    return <Badge className="border-transparent bg-brand-soft text-brand-soft-foreground">{children}</Badge>;
  }
  if (tone === "outline") {
    return <Badge variant="outline">{children}</Badge>;
  }
  return <Badge variant="secondary">{children}</Badge>;
}

// letter-icon colors for the collection tabs, matching the real Mochi app
const TAB_TONES = [
  { bg: "#d1fbe8", fg: "#047857" },
  { bg: "#dbeafe", fg: "#1d4ed8" },
  { bg: "#fef3c7", fg: "#b45309" },
  { bg: "#ede9fe", fg: "#6d28d9" },
  { bg: "#fee2e2", fg: "#b91c1c" },
];

// ---------- per-template mock data ----------
type Cell = string | { label: string; tone: Tone };
interface TemplateSpec {
  key: string;
  label: string;
  desc: string;
  icon: ReactNode;
  workspace: string;
  view: string;
  /** collections this template ships with — shown as the window's tab strip */
  collections: string[];
  cols: string[];
  rows: Cell[][];
}

const TEMPLATES: TemplateSpec[] = [
  {
    key: "crm",
    label: "CRM",
    desc: "Centralize customer interactions to close more deals",
    icon: <Users className="h-4 w-4" />,
    workspace: "Sales CRM",
    collections: ["Deals", "Customers", "Leads", "Interactions", "Tasks"],
    view: "Opportunities / Default",
    cols: ["Deal", "Stage", "Contact", "Value"],
    rows: [
      ["VisionQuest RFQ",       { label: "Discovery",   tone: "outline" }, "James Cooper",    "$14,300"],
      ["Acetube inquiry",       { label: "Negotiation", tone: "neutral" }, "Charlotte King",  "$48,200"],
      ["LKS retainer",          { label: "Discovery",   tone: "outline" }, "Benjamin Taylor", "$6,500"],
      ["Timbershadow expansion",{ label: "Closed won",  tone: "brand"   }, "Casey Park",      "$61,540"],
    ],
  },
  {
    key: "hrm",
    label: "HRM",
    desc: "Manage people, roles, and attendance in one workspace",
    icon: <BadgeCheck className="h-4 w-4" />,
    workspace: "People ops",
    collections: ["Employees", "Teams", "Attendance", "Reviews"],
    view: "Employees / Active",
    cols: ["Name", "Role", "Team", "Joined"],
    rows: [
      ["Linh Nguyen",   "Senior engineer",     { label: "Platform", tone: "brand"   }, "2024-03-01"],
      ["Marco Reyes",   "Product designer",    { label: "Design",   tone: "neutral" }, "2024-11-20"],
      ["Sara Hoffmann", "Ops manager",         { label: "Ops",      tone: "outline" }, "2023-08-14"],
      ["Kenji Tanaka",  "Data analyst",        { label: "Data",     tone: "neutral" }, "2025-01-09"],
    ],
  },
  {
    key: "inventory",
    label: "Inventory",
    desc: "Track stock, warehouses, and in/out flow in real time",
    icon: <Box className="h-4 w-4" />,
    workspace: "Warehouse",
    collections: ["Products", "Stock", "Warehouses", "Movements"],
    view: "Products / Low stock",
    cols: ["SKU", "Product", "Stock", "Status"],
    rows: [
      ["SKU-001", "Ceramic mug — matte white",     "42",  { label: "In stock",    tone: "brand"   }],
      ["SKU-014", "Notebook A5 — dot grid",        "8",   { label: "Low stock",   tone: "outline" }],
      ["SKU-027", "Cable tidy strap — pack of 5",  "0",   { label: "Backorder",   tone: "neutral" }],
      ["SKU-039", "Coffee dripper V60",            "126", { label: "In stock",    tone: "brand"   }],
    ],
  },
  {
    key: "project",
    label: "Projects",
    desc: "Coordinate tasks and ship on time without pinging",
    icon: <ListChecks className="h-4 w-4" />,
    workspace: "Delivery",
    collections: ["Tasks", "Sprints", "People", "Milestones"],
    view: "Sprint 12 / Kanban",
    cols: ["Task", "Owner", "Deadline", "Status"],
    rows: [
      ["Migrate auth to MCP",       "Linh",  "Tue 22",  { label: "In review",    tone: "brand"   }],
      ["Draft billing schema",      "Marco", "Wed 23",  { label: "In progress",  tone: "outline" }],
      ["Investigate p95 spike",     "Kenji", "Fri 25",  { label: "Blocked",      tone: "neutral" }],
      ["Ship template gallery",     "Sara",  "Mon 28",  { label: "Todo",         tone: "outline" }],
    ],
  },
];

function renderCell(cell: Cell) {
  if (typeof cell === "string") return <span className="text-foreground">{cell}</span>;
  return <StatusBadge tone={cell.tone}>{cell.label}</StatusBadge>;
}

const AUTO_MS = 4500;

export default function Templates() {
  const { m } = useLang();
  const [active, setActive] = useState(TEMPLATES[0].key);
  const pausedRef = useRef(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const activeIndex = TEMPLATES.findIndex((t) => t.key === active);
  const activeTpl = TEMPLATES[activeIndex] ?? TEMPLATES[0];

  // manual taps bring the preview into view — on narrow screens the tabs
  // stack tall enough that the updated table can otherwise sit off-screen.
  // The auto-cycle timer never does this; only a deliberate click should move the page.
  const handleTabClick = (key: string) => {
    setActive(key);
    if (window.matchMedia("(max-width: 767px)").matches) {
      previewRef.current?.scrollIntoView({ behavior: "instant", block: "nearest" });
    }
  };

  // auto-cycle through templates; restarts its countdown on every active
  // change, whether that change came from the timer or a manual click
  useEffect(() => {
    const id = setInterval(() => {
      if (pausedRef.current) return;
      setActive((prev) => {
        const idx = TEMPLATES.findIndex((t) => t.key === prev);
        return TEMPLATES[(idx + 1) % TEMPLATES.length].key;
      });
    }, AUTO_MS);
    return () => clearInterval(id);
  }, [active]);

  return (
    <section id="templates" className="relative border-b border-border bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <Reveal className="mb-10 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Templates</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {m.tpl.title}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              {m.tpl.sub}
            </p>
          </div>
          <Button
            render={<a href="https://github.com/mochi-cli/mochi" target="_blank" rel="noopener noreferrer" />}
            nativeButton={false}
            variant="outline"
            className="rounded-full"
          >
            View all →
          </Button>
        </Reveal>

        <Reveal>
          <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)] sm:p-8">
            {/* Tab row — auto-cycles; hover pauses it */}
            <div
              role="tablist"
              aria-label="Templates"
              onMouseEnter={() => { pausedRef.current = true; }}
              onMouseLeave={() => { pausedRef.current = false; }}
              className="grid gap-4 border-b border-border pb-2 sm:grid-cols-2 lg:grid-cols-4"
            >
              {TEMPLATES.map((t) => {
                const isActive = t.key === active;
                return (
                  <button
                    key={t.key}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => handleTabClick(t.key)}
                    className={`group relative flex flex-col items-start gap-2 rounded-xl p-4 text-left transition-colors ${
                      isActive ? "bg-secondary/60" : "hover:bg-secondary/60"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                          isActive ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {t.icon}
                      </span>
                      <span className="text-base font-semibold text-foreground">
                        {t.label}
                      </span>
                    </div>
                    <p className="text-[13px] leading-relaxed text-muted-foreground">{t.desc}</p>
                    {/* progress track — fills over AUTO_MS while active, like a story bar */}
                    <span className="absolute inset-x-4 -bottom-[10px] h-[3px] overflow-hidden rounded-full bg-border" aria-hidden>
                      {isActive && (
                        <span key={active} className="animate-tabgrow block h-full origin-left rounded-full bg-brand" />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Preview — dressed as a real app window so it reads like a product shot */}
            <div ref={previewRef} className="mt-8 overflow-hidden rounded-2xl border border-border bg-secondary/30 shadow-[var(--shadow-lift)]">
              {/* window chrome */}
              <div className="flex h-9 items-center gap-2 border-b border-border bg-secondary/70 px-4">
                <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                <span className="ml-3 truncate text-[11px] text-muted-foreground">
                  {activeTpl.workspace} — Mochi
                </span>
              </div>

              {/* collection tabs for this template */}
              <div className="flex h-10 items-center gap-1 overflow-x-auto border-b border-border bg-secondary/40 px-3">
                {activeTpl.collections.map((c, i) => (
                  <span
                    key={c}
                    className={`flex flex-none items-center gap-1.5 whitespace-nowrap rounded-t-md px-2.5 py-1.5 text-xs font-medium ${
                      i === 0
                        ? "bg-card text-foreground shadow-[0_-1px_0_var(--border)_inset]"
                        : "text-muted-foreground"
                    }`}
                  >
                    <span
                      className="flex h-4 w-4 items-center justify-center rounded text-[10px] font-semibold"
                      style={{ backgroundColor: TAB_TONES[i % TAB_TONES.length].bg, color: TAB_TONES[i % TAB_TONES.length].fg }}
                    >
                      {c[0]}
                    </span>
                    {c}
                  </span>
                ))}
              </div>

              {/* Toolbar */}
              <div className="flex items-center gap-3 border-b border-border bg-card px-4 py-2.5 text-xs text-muted-foreground">
                <span className="flex h-6 items-center gap-1.5 rounded-md bg-secondary px-2 font-medium text-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                  {activeTpl.workspace}
                </span>
                <span className="text-muted-foreground/60">/</span>
                <span>{activeTpl.view}</span>
                <span className="ml-auto flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="hidden sm:inline">Fields · Filter · Group · Sort</span>
                  <span className="rounded-full border border-border bg-background px-2 py-0.5 text-[9px] font-medium text-muted-foreground">
                    MOCHI
                  </span>
                </span>
              </div>

              {/* Table */}
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    {activeTpl.cols.map((c) => (
                      <TableHead key={c} className="text-[11px] uppercase tracking-wider">
                        {c}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeTpl.rows.map((row, i) => (
                    <TableRow key={i}>
                      {row.map((cell, j) => (
                        <TableCell key={j} className="text-[13px]">
                          {renderCell(cell)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* status bar */}
              <div className="flex h-9 items-center gap-3 border-t border-border bg-card px-4 text-[11px] text-muted-foreground">
                <span>Showing {activeTpl.rows.length}</span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                  in sync
                </span>
                <span className="ml-auto hidden sm:inline">
                  {activeTpl.collections.length} collections · local-first
                </span>
              </div>
            </div>

          </div>
        </Reveal>
      </div>
    </section>
  );
}
