"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlignLeft,
  ArrowLeftRight,
  Boxes,
  Calendar,
  CircleCheck,
  CircleDot,
  Flag,
  Hash,
  Handshake,
  ListChecks,
  MessageSquare,
  Package,
  Star,
  Table2,
  Timer,
  Type,
  Users,
  Warehouse,
} from "lucide-react";
import { useLang } from "./LanguageProvider";
import CanvasSection from "./CanvasSection";
import { AppTabs, AppToolbar, Box, Cell, Chip, type Collection, HeadCell, Pill, type Tone } from "./appui";
import { REPO_URL } from "@/lib/links";

/* Four starting points, each shown as the workspace it actually produces:
   the same collection strip, toolbar and grid as the rest of the page. */

type TplCell = string | { label: string; tone: Tone };
type ColIcon = typeof Type;

interface TemplateSpec {
  key: string;
  label: string;
  workspace: string;
  view: string;
  collections: string[];
  cols: string[];
  colIcons: ColIcon[];
  rows: TplCell[][];
}

const COLLECTION_ICONS: Record<string, ColIcon> = {
  Deals: Handshake,
  Customers: Users,
  Leads: CircleCheck,
  Interactions: MessageSquare,
  Tasks: ListChecks,
  Employees: Users,
  Teams: Users,
  Attendance: Calendar,
  Reviews: Star,
  Products: Package,
  Stock: Boxes,
  Warehouses: Warehouse,
  Movements: ArrowLeftRight,
  Sprints: Timer,
  People: Users,
  Milestones: Flag,
};
const TONES: Tone[] = ["green", "amber", "lilac", "blue", "rose", "mint"];

const TEMPLATES: TemplateSpec[] = [
  {
    key: "crm",
    label: "CRM",
    workspace: "Sales CRM",
    collections: ["Deals", "Customers", "Leads", "Interactions", "Tasks"],
    view: "Opportunities / Default",
    cols: ["Deal", "Stage", "Contact", "Value"],
    colIcons: [Type, CircleDot, AlignLeft, Hash],
    rows: [
      ["VisionQuest RFQ", { label: "Discovery", tone: "blue" }, "James Cooper", "$14,300"],
      ["Acetube inquiry", { label: "Negotiation", tone: "amber" }, "Charlotte King", "$48,200"],
      ["Halden & Roe pilot", { label: "Proposal", tone: "lilac" }, "Ava Thompson", "$22,800"],
      ["LKS retainer", { label: "Discovery", tone: "blue" }, "Benjamin Taylor", "$6,500"],
      ["Blue Harbour renewal", { label: "Closed won", tone: "mint" }, "Marcus Okafor", "$37,150"],
      ["Timbershadow expansion", { label: "Closed won", tone: "mint" }, "Casey Park", "$61,540"],
    ],
  },
  {
    key: "hrm",
    label: "HRM",
    workspace: "People ops",
    collections: ["Employees", "Teams", "Attendance", "Reviews"],
    view: "Employees / Active",
    cols: ["Name", "Role", "Team", "Joined"],
    colIcons: [Type, AlignLeft, CircleDot, Calendar],
    rows: [
      ["Linh Nguyen", "Senior engineer", { label: "Platform", tone: "lilac" }, "2024-03-01"],
      ["Marco Reyes", "Product designer", { label: "Design", tone: "blue" }, "2024-11-20"],
      ["Sara Hoffmann", "Ops manager", { label: "Ops", tone: "green" }, "2023-08-14"],
      ["Kenji Tanaka", "Data analyst", { label: "Data", tone: "amber" }, "2025-01-09"],
      ["Ava Thompson", "Account executive", { label: "Sales", tone: "lilac" }, "2025-04-02"],
      ["Daniel Novak", "Support lead", { label: "Success", tone: "green" }, "2022-11-15"],
    ],
  },
  {
    key: "inventory",
    label: "Inventory",
    workspace: "Warehouse",
    collections: ["Products", "Stock", "Warehouses", "Movements"],
    view: "Products / Low stock",
    cols: ["SKU", "Product", "Stock", "Status"],
    colIcons: [Type, AlignLeft, Hash, CircleDot],
    rows: [
      ["SKU-001", "Ceramic mug, matte white", "42", { label: "In stock", tone: "mint" }],
      ["SKU-014", "Notebook A5, dot grid", "8", { label: "Low stock", tone: "amber" }],
      ["SKU-027", "Cable tidy strap, pack of 5", "0", { label: "Backorder", tone: "rose" }],
      ["SKU-039", "Coffee dripper V60", "126", { label: "In stock", tone: "mint" }],
      ["SKU-052", "Cast iron skillet, 26cm", "17", { label: "In stock", tone: "mint" }],
      ["SKU-063", "Olive wood board", "0", { label: "Backorder", tone: "rose" }],
    ],
  },
  {
    key: "project",
    label: "Projects",
    workspace: "Delivery",
    collections: ["Tasks", "Sprints", "People", "Milestones"],
    view: "Sprint 12 / Kanban",
    cols: ["Task", "Owner", "Deadline", "Status"],
    colIcons: [Type, AlignLeft, Calendar, CircleDot],
    rows: [
      ["Migrate auth to MCP", "Linh", "Tue 22", { label: "In review", tone: "blue" }],
      ["Draft billing schema", "Marco", "Wed 23", { label: "In progress", tone: "green" }],
      ["Investigate p95 spike", "Kenji", "Fri 25", { label: "Blocked", tone: "rose" }],
      ["Wire MCP tool errors", "Ava", "Tue 29", { label: "Todo", tone: "amber" }],
      ["Ship template gallery", "Sara", "Mon 28", { label: "Todo", tone: "amber" }],
      ["Cut v0.3 release notes", "Marco", "Thu 31", { label: "In review", tone: "blue" }],
    ],
  },
];

const AUTO_MS = 4500;

export default function Templates() {
  const { m } = useLang();
  const [active, setActive] = useState(TEMPLATES[0].key);
  const pausedRef = useRef(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const tpl = TEMPLATES.find((t) => t.key === active) ?? TEMPLATES[0];

  // Manual taps bring the preview into view: on narrow screens the captions
  // stack tall enough that the updated grid can otherwise sit off-screen. The
  // auto-cycle never does this; only a deliberate click should move the page.
  const handleTabClick = (key: string) => {
    setActive(key);
    if (window.matchMedia("(max-width: 767px)").matches) {
      previewRef.current?.scrollIntoView({ behavior: "instant", block: "nearest" });
    }
  };

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

  const tabs: Collection[] = tpl.collections.map((name, i) => ({
    name,
    tone: TONES[i % TONES.length],
    icon: COLLECTION_ICONS[name] ?? Table2,
  }));

  return (
    <CanvasSection
      id="templates"
      kicker={m.eyebrow.tpl}
      title={m.tpl.title}
      sub={m.tpl.sub}
      captions={
        <div
          role="tablist"
          aria-label="Templates"
          onMouseEnter={() => { pausedRef.current = true; }}
          onMouseLeave={() => { pausedRef.current = false; }}
          className="mt-10 grid border-t border-line sm:grid-cols-2 lg:grid-cols-4"
        >
          {TEMPLATES.map((t, i) => {
            const isActive = t.key === active;
            return (
              <button
                key={t.key}
                role="tab"
                aria-selected={isActive}
                onClick={() => handleTabClick(t.key)}
                className="group relative border-b border-line py-5 text-left sm:border-b-0 sm:border-l sm:pl-6 sm:pr-6 sm:first:border-l-0 sm:first:pl-0"
              >
                <span className={`block text-[16px] tracking-[-0.01em] transition-colors ${isActive ? "text-ink" : "text-ink-3 group-hover:text-ink"}`}>
                  {t.label}
                </span>
                <span className={`mt-2 block max-w-[34ch] text-[14px] leading-relaxed transition-colors ${isActive ? "text-ink-2" : "text-ink-3"}`}>
                  {m.tpl.items[i]}
                </span>
                <span className="absolute inset-x-0 -top-px h-px overflow-hidden sm:left-6 sm:right-6 sm:first:left-0" aria-hidden>
                  {isActive && <span key={active} className="animate-tabgrow block h-full origin-left bg-ink" />}
                </span>
              </button>
            );
          })}
        </div>
      }
      after={
        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-block text-[15px] text-ink underline-offset-4 transition-colors hover:text-ink-2 hover:underline"
        >
          {m.tpl.viewAll}
        </a>
      }
    >
      <div ref={previewRef} className="canvas appui">
        <AppTabs tabs={tabs} active={tpl.collections[0]} />
        <AppToolbar view={tpl.view} />

        <div className="overflow-x-auto">
          <table className="w-full min-w-[46rem] border-collapse">
            <thead>
              <tr style={{ background: "var(--app-bg)" }}>
                <th
                  className="border-b border-r px-3 py-2"
                  style={{ borderColor: "var(--app-line)", width: 36 }}
                >
                  <Box />
                </th>
                {tpl.cols.map((c, i) => (
                  <HeadCell key={c} icon={tpl.colIcons[i]} tag={i === 0 ? "primary" : undefined}>
                    {c}
                  </HeadCell>
                ))}
              </tr>
            </thead>
            <tbody>
              {tpl.rows.map((row, i) => (
                <tr key={i}>
                  <Cell width={36}><Box /></Cell>
                  {row.map((cell, j) => (
                    <Cell key={j}>
                      {typeof cell === "string" ? (
                        j === 0 ? (
                          <span className="flex items-center gap-2">
                            <Chip tone={TONES[i % TONES.length]} letter={tpl.label[0]} />
                            <span className="text-[12.5px]">{cell}</span>
                          </span>
                        ) : (
                          <span className="text-[12.5px]">{cell}</span>
                        )
                      ) : (
                        <Pill tone={cell.tone}>{cell.label}</Pill>
                      )}
                    </Cell>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </CanvasSection>
  );
}
