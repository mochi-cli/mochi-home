"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { GitCommit, ArrowUp, X, Sparkles, LayoutGrid, GitBranch, Users, ShieldCheck } from "lucide-react";
import Reveal from "./Reveal";
import { useLang } from "./LanguageProvider";
import MochiConsole, { type Line } from "./MochiConsole";
import ProductShot from "./ProductShot";
import AuditHistory from "./AuditHistory";
import FilterBuilder from "./FilterBuilder";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// ─── Types ────────────────────────────────────────────────────────────────────
type DBRow = {
  id: string;
  name: string;
  phone: string;
  source: string;
  status: "staged" | "pushed" | "merged" | "reverted";
};
type LiveLog = { id: string; branch: string; msg: string; type: "commit" | "push" | "revert" };
type DB = {
  userA: string; userB: string; branchAName: string; branchBName: string;
  title: string; live: string; watching: string;
  statusStaged: string; statusPushed: string; statusReverted: string; statusMerged: string;
  eventsTitle: string; eventsEmpty: string;
  dataA: { id: string; name: string; phone: string; source: string; msgC: string; msgP: string };
  dataB: { id: string; name: string; phone: string; source: string; msgC: string; msgR: string };
};

// ─── Item 1 & 2 — single console demo ──────────────────────────────────────────
function ConsolePanel({ script }: { script: Line[] }) {
  return (
    <div className="mx-auto max-w-xl">
      <MochiConsole customScript={script} heightClass="h-[340px]" />
    </div>
  );
}

// ─── Item 3 — two teammates on two branches + a live-synced table ─────────────
// Records that already live on main before the demo runs. Without these the
// grid sits empty for the ~14s the console spends typing its way to the first
// commit, which reads as a broken table rather than a waiting one.
const SEED_ROWS: DBRow[] = [
  { id: "C-118", name: "Ana", phone: "0905551122", source: "referral", status: "merged" },
  { id: "C-119", name: "Tom", phone: "0938774410", source: "website", status: "merged" },
];

function LiveTable({ db, syncedCaption }: { db: DB; syncedCaption: string }) {
  const [rows, setRows] = useState<DBRow[]>(SEED_ROWS);
  const [logs, setLogs] = useState<LiveLog[]>([]);
  // A console restarting its script shouldn't blank the table straight away —
  // it takes ~14s to type its way back to the first commit, and an empty grid
  // for most of the loop reads as broken. Defer the wipe until new data lands.
  const pendingClear = useRef(false);

  useEffect(() => {
    const takeClear = () => {
      if (!pendingClear.current) return false;
      pendingClear.current = false;
      return true;
    };
    const handleReset = () => { pendingClear.current = true; };
    const handleA = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail === "commit-A") {
        const clear = takeClear();
        const row: DBRow = { id: db.dataA.id, name: db.dataA.name, phone: db.dataA.phone, source: db.dataA.source, status: "staged" };
        setRows((r) => {
          const base = clear ? SEED_ROWS : r;
          return base.find((x) => x.id === row.id) ? base : [...base, row];
        });
        setLogs((l) => [...(clear ? [] : l), { id: Date.now().toString(), branch: db.branchAName, msg: db.dataA.msgC, type: "commit" }]);
      }
      if (detail === "push-A") {
        setRows((r) => r.map((x) => (x.id === db.dataA.id ? { ...x, status: "pushed" } : x)));
        setLogs((l) => [...l, { id: Date.now().toString(), branch: db.branchAName, msg: db.dataA.msgP, type: "push" }]);
      }
    };
    const handleB = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail === "commit-B") {
        const clear = takeClear();
        const row: DBRow = { id: db.dataB.id, name: db.dataB.name, phone: db.dataB.phone, source: db.dataB.source, status: "staged" };
        setRows((r) => {
          const base = clear ? SEED_ROWS : r;
          return base.find((x) => x.id === row.id) ? base : [...base, row];
        });
        setLogs((l) => [...(clear ? [] : l), { id: Date.now().toString(), branch: db.branchBName, msg: db.dataB.msgC, type: "commit" }]);
      }
      if (detail === "revert-B") {
        setRows((r) => r.map((x) => (x.id === db.dataB.id ? { ...x, status: "reverted" } : x)));
        setLogs((l) => [...l, { id: Date.now().toString(), branch: db.branchBName, msg: db.dataB.msgR, type: "revert" }]);
      }
    };
    window.addEventListener("mochi-reset-branch-a", handleReset);
    window.addEventListener("mochi-reset-branch-b", handleReset);
    window.addEventListener("mochi-action-branch-a", handleA);
    window.addEventListener("mochi-action-branch-b", handleB);
    return () => {
      window.removeEventListener("mochi-reset-branch-a", handleReset);
      window.removeEventListener("mochi-reset-branch-b", handleReset);
      window.removeEventListener("mochi-action-branch-a", handleA);
      window.removeEventListener("mochi-action-branch-b", handleB);
    };
  }, [db]);

  const statusLabel = (s: DBRow["status"]) =>
    s === "merged" ? db.statusMerged : s === "pushed" ? db.statusPushed : s === "reverted" ? db.statusReverted : db.statusStaged;

  return (
    <div className="min-w-0">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-[13px] font-medium text-foreground">{db.title}</span>
        <Badge variant="secondary" className="mono">⎇ main</Badge>
      </div>

      {/* mirrors MochiConsole's own panel: title bar / fixed-height body / footer bar */}
      <div className="w-full overflow-hidden rounded-2xl border border-border bg-card text-left shadow-[var(--shadow-card)]">
        <div className="flex h-[49px] items-center justify-between border-b border-border px-4 py-2.5">
          <span className="text-xs font-semibold text-foreground">{db.title}</span>
          <span
            className={`mono flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium ${
              rows.length ? "bg-brand-soft text-brand-soft-foreground" : "bg-secondary text-muted-foreground"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${rows.length ? "bg-brand animate-pulse" : "bg-muted-foreground"}`} />
            {db.live}
          </span>
        </div>

        <div className="h-[300px] overflow-y-auto px-4 py-4">
          <div className="mono mb-3 text-[10px] text-muted-foreground">{db.watching}</div>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-7 text-[10px]">ID</TableHead>
                <TableHead className="h-7 text-[10px]">Name</TableHead>
                <TableHead className="h-7 text-[10px]">Phone</TableHead>
                <TableHead className="h-7 text-[10px]">Source</TableHead>
                <TableHead className="h-7 text-right text-[10px]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={5} className="py-6 text-center text-[11px] text-muted-foreground">
                    {db.eventsEmpty}
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((r) => (
                  <TableRow key={r.id} className="animate-in fade-in slide-in-from-bottom-1 duration-300">
                    <TableCell className="mono py-1.5 text-[11px] text-muted-foreground">{r.id}</TableCell>
                    <TableCell className="py-1.5 text-[12px] font-medium text-foreground">{r.name}</TableCell>
                    <TableCell className="mono py-1.5 text-[11px] text-muted-foreground">{r.phone}</TableCell>
                    <TableCell className="py-1.5 text-[12px] text-muted-foreground">{r.source}</TableCell>
                    <TableCell className="py-1.5 text-right">
                      <Badge
                        variant={r.status === "reverted" ? "destructive" : r.status === "staged" ? "outline" : "default"}
                        className={r.status !== "reverted" && r.status !== "staged" ? "border-transparent bg-brand-soft text-brand-soft-foreground" : ""}
                      >
                        {statusLabel(r.status)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {logs.length > 0 && (
            <div className="mt-3 space-y-1.5 border-t border-border pt-3">
              <div className="mono mb-1 text-[10px] text-muted-foreground">{db.eventsTitle}</div>
              {logs.map((log, i) => (
                <div key={i} className="mono flex animate-in fade-in slide-in-from-bottom-1 items-center gap-2 text-[11px] duration-300">
                  {log.type === "revert" ? (
                    <X className="h-3 w-3 text-destructive" />
                  ) : log.type === "push" ? (
                    <ArrowUp className="h-3 w-3 text-brand" />
                  ) : (
                    <GitCommit className="h-3 w-3 text-muted-foreground" />
                  )}
                  <span className="text-muted-foreground">[{log.branch}]</span>
                  <span className={log.type === "revert" ? "text-destructive line-through" : "text-foreground"}>{log.msg}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex h-[47px] items-center gap-2 border-t border-border bg-secondary/40 px-4 py-2.5">
          <span className="mono text-xs text-muted-foreground">⇄ {syncedCaption}</span>
        </div>
      </div>
    </div>
  );
}

function CollabPanel({ m, syncedCaption }: { m: { db: DB; scripts: { branchA: Line[]; branchB: Line[] } }; syncedCaption: string }) {
  return (
    <div>
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-[13px] font-medium text-foreground">{m.db.userA}</span>
            <Badge variant="secondary" className="mono">⎇ {m.db.branchAName}</Badge>
          </div>
          <MochiConsole customScript={m.scripts.branchA} heightClass="h-[300px]" consoleId="branch-a" fullWidth />
        </div>
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-[13px] font-medium text-foreground">{m.db.userB}</span>
            <Badge variant="secondary" className="mono">⎇ {m.db.branchBName}</Badge>
          </div>
          <MochiConsole customScript={m.scripts.branchB} heightClass="h-[300px]" consoleId="branch-b" initialDelay={3500} fullWidth />
        </div>
        <LiveTable db={m.db} syncedCaption={syncedCaption} />
      </div>
    </div>
  );
}

// ─── Item 3 — one agent, one branch, syncing straight to a real DB ─────────────
function SoloGitPanel({ m, agentLabel, syncedCaption }: { m: { db: DB; scripts: { branchA: Line[] } }; agentLabel: string; syncedCaption: string }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="min-w-0">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-[13px] font-medium text-foreground">{agentLabel}</span>
          <Badge variant="secondary" className="mono">⎇ main</Badge>
        </div>
        <MochiConsole customScript={m.scripts.branchA} heightClass="h-[300px]" consoleId="branch-a" fullWidth />
      </div>
      <LiveTable db={m.db} syncedCaption={syncedCaption} />
    </div>
  );
}

// ─── Item 5 — auditable history + no-code filtering, side by side ─────────────
function AuditAndFilterPanel() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="min-w-0">
        <p className="mb-2 text-[13px] font-medium text-foreground">Every agent edit, logged field by field</p>
        <AuditHistory compact />
      </div>
      <div className="min-w-0">
        <p className="mb-2 text-[13px] font-medium text-foreground">Build a query by clicking, not by asking</p>
        <FilterBuilder compact />
      </div>
    </div>
  );
}

// ─── Main exported section ─────────────────────────────────────────────────────
interface Item {
  n: string;
  title: string;
  desc: string;
  render: () => ReactNode;
}

const ITEM_ICONS = [Sparkles, LayoutGrid, GitBranch, Users, ShieldCheck];

export default function AINative() {
  const { m } = useLang();
  const [active, setActive] = useState(0);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  // Which layout owns the demo. Only one of the two slots may mount it: the
  // consoles broadcast reset/action events keyed by consoleId, so a second
  // CSS-hidden copy would race the visible one and keep wiping the live table.
  // null until mounted, so SSR and first client render agree.
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const items: Item[] = [
    { n: "01", title: m.feat.items[0].title, desc: m.feat.items[0].desc, render: () => <ConsolePanel script={m.scripts.chat} /> },
    { n: "02", title: m.feat.items[1].title, desc: m.feat.items[1].desc, render: () => <ConsolePanel script={m.scripts.template} /> },
    {
      n: "03",
      title: m.git.items[0].title,
      desc: m.git.items[0].desc,
      render: () => <SoloGitPanel m={m} agentLabel={m.git.agentLabel} syncedCaption={m.git.syncedCaption} />,
    },
    {
      n: "04",
      title: m.git.items[1].title,
      desc: m.git.items[1].desc,
      render: () => <CollabPanel m={m} syncedCaption={m.git.syncedCaption} />,
    },
    {
      n: "05",
      title: "Auditable, no-code control",
      desc: "Every agent edit is logged field by field, and filters or groups are built by clicking — not by prompting.",
      render: () => <AuditAndFilterPanel />,
    },
  ];
  const current = items[active];

  // scroll-driven selection: whichever item crosses the vertical center of the
  // viewport becomes active, so scrolling steps through 01→04 in order.
  // Desktop only — the sticky side-by-side layout needs it; on mobile each
  // item renders its own demo inline instead, so auto-detection would just
  // fight the layout shift that causes. Keyed off the same isDesktop state
  // the layout itself uses, so resizing across the breakpoint (not just a
  // fresh page load) correctly turns this on or off instead of getting
  // stuck with whatever matched at mount time.
  useEffect(() => {
    if (isDesktop !== true) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = itemRefs.current.findIndex((el) => el === entry.target);
            if (idx !== -1) setActive(idx);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    itemRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [items.length, isDesktop]);

  const handleSelect = (i: number) => {
    setActive(i);
    itemRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <section id="features" className="relative border-b border-border bg-secondary/30">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <Reveal className="mb-14 text-center">
          <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-violet">Features</p>
          <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {m.feat.title}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            Mochi combines the simplicity of a spreadsheet, the power of a database, and the
            intelligence of AI.
          </p>
        </Reveal>

        <Reveal>
          <div className="grid gap-10 lg:grid-cols-[300px_1fr] lg:gap-12">
            {/* left: numbered capability list — a short dashed connector marks
                the gap between items so the list reads as one sequence */}
            <div className="flex flex-col">
              {items.map((it, i) => {
                const isActive = i === active;
                const passed = i <= active;
                const Icon = ITEM_ICONS[i];
                return (
                  <div key={it.n}>
                    {i > 0 && (
                      <div className="ml-[34px] flex h-5 w-px items-stretch" aria-hidden>
                        <div className={`w-px border-l-2 border-dashed ${passed ? "border-violet/50" : "border-border"}`} />
                      </div>
                    )}
                    <button
                      ref={(el) => { itemRefs.current[i] = el; }}
                      onClick={() => handleSelect(i)}
                      className={`flex w-full flex-col justify-center rounded-2xl border p-4 text-left transition-colors lg:min-h-[210px] ${
                        isActive ? "border-violet/40 bg-card shadow-[var(--shadow-card)]" : "border-transparent hover:bg-card/60"
                      }`}
                    >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`flex h-9 w-9 flex-none items-center justify-center rounded-full text-sm font-semibold transition-colors duration-300 ${
                          passed ? "bg-violet text-violet-foreground" : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {i + 1}
                      </span>
                      <span
                        className={`flex h-9 w-9 flex-none items-center justify-center rounded-xl transition-colors duration-300 ${
                          isActive ? "bg-violet-soft text-violet" : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                    </div>
                    <div className={`mt-3 text-base font-semibold transition-colors ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                      {it.title}
                    </div>
                    {isActive && (
                      <>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{it.desc}</p>
                        {/* mobile: show this item's own demo right here instead of a sticky side panel */}
                        {isDesktop === false && <div className="mt-5">{it.render()}</div>}
                      </>
                    )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* right: demo — desktop only; mobile renders each demo inline under its item */}
            <div className="hidden lg:sticky lg:top-28 lg:block lg:self-start">
              {isDesktop === true && current.render()}
            </div>
          </div>
        </Reveal>

        {/* the same records, whichever way the team wants to look at them */}
        <Reveal>
          <div className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)] sm:p-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow">Views</p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  One dataset, every view your team thinks in
                </h3>
              </div>
              <p className="max-w-md text-[13px] leading-relaxed text-muted-foreground">
                Grid, Kanban, Calendar, Gallery, Chart — all read the same records. Switch views without
                copying data or rebuilding a thing.
              </p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <ProductShot
                src="/product/view-kanban-status.png"
                alt="Mochi kanban board — leads grouped by pipeline status, with a detail panel open"
                title="Leads — By Status"
                width={2000}
                height={1000}
              />
              <ProductShot
                src="/product/view-calendar.png"
                alt="Mochi calendar view — orders plotted by order date across the month"
                title="Orders — By Order Date"
                width={2000}
                height={1000}
              />
              <ProductShot
                src="/product/view-gallery.png"
                alt="Mochi gallery view — product cards with cover photos, pricing, and descriptions"
                title="Products — Product Cards"
                width={2000}
                height={1000}
              />
              <ProductShot
                src="/product/view-grid-grouped.png"
                alt="Mochi grid view — tasks grouped by priority with status and owner columns"
                title="Tasks — Grouped by Priority"
                width={2000}
                height={1000}
              />
              <ProductShot
                src="/product/view-chart.png"
                alt="Mochi bar chart — lead count by source, computed from the same records"
                title="Leads — By Source"
                width={2000}
                height={1000}
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
