"use client";

import { Fragment } from "react";
import {
  AlignLeft,
  Search,
  BadgeDollarSign,
  CircleCheck,
  CircleDot,
  FileText,
  Hash,
  Image as ImageIcon,
  ListChecks,
  MessageSquare,
  Package,
  ShoppingCart,
  Type,
  Undo2,
  Users,
} from "lucide-react";
import {
  AppTabs,
  AppToolbar,
  Box,
  Cell,
  Chip,
  type Collection,
  GroupRow,
  HeadCell,
  Pill,
  type Tone,
} from "../appui";
import { clamp01, ease, seg } from "./script";

/* The pictures the film is made of. Everything here is the same chrome the
   product page uses, at the same colours, so the clip is the application
   rather than a drawing of it. */

type Stock = "in" | "low" | "back";

export interface Product {
  id: string;
  group: "Drinkware" | "Desk" | "Kitchen";
  name: string;
  price: string;
  stock: number;
  state: Stock;
}

/* The same catalogue the hero runs on, so the clip and the page agree. */
export const PRODUCTS: Product[] = [
  { id: "PRD-014", group: "Drinkware", name: "Ceramic mug, matte white", price: "$18.00", stock: 42, state: "in" },
  { id: "PRD-027", group: "Drinkware", name: "Double-wall glass, 250ml", price: "$22.50", stock: 8, state: "low" },
  { id: "PRD-031", group: "Drinkware", name: "Enamel camp mug", price: "$16.00", stock: 0, state: "back" },
  { id: "PRD-042", group: "Drinkware", name: "Coffee dripper V60", price: "$28.00", stock: 126, state: "in" },
  { id: "PRD-008", group: "Desk", name: "Notebook A5, dot grid", price: "$14.00", stock: 64, state: "in" },
  { id: "PRD-011", group: "Desk", name: "Fineliner set, 6 colours", price: "$19.50", stock: 9, state: "low" },
  { id: "PRD-019", group: "Desk", name: "Kraft folder, pack of 10", price: "$11.00", stock: 210, state: "in" },
  { id: "PRD-023", group: "Desk", name: "Desk pad, felt", price: "$34.00", stock: 3, state: "low" },
  { id: "PRD-036", group: "Desk", name: "Cable tidy strap, pack of 5", price: "$9.50", stock: 88, state: "in" },
  { id: "PRD-005", group: "Kitchen", name: "Cast iron skillet, 26cm", price: "$62.00", stock: 17, state: "in" },
  { id: "PRD-016", group: "Kitchen", name: "Olive wood board", price: "$45.00", stock: 0, state: "back" },
  { id: "PRD-029", group: "Kitchen", name: "Linen apron", price: "$39.00", stock: 38, state: "in" },
];

const STOCK: Record<Stock, { label: string; tone: Tone }> = {
  in: { label: "In stock", tone: "mint" },
  low: { label: "Low stock", tone: "amber" },
  back: { label: "Backorder", tone: "rose" },
};
const GROUP_TONE: Record<Product["group"], Tone> = { Drinkware: "blue", Desk: "lilac", Kitchen: "green" };
const GROUPS: Product["group"][] = ["Drinkware", "Desk", "Kitchen"];

export const COLLECTIONS: Collection[] = [
  { name: "Customers", tone: "amber", icon: Users },
  { name: "Interactions", tone: "lilac", icon: MessageSquare },
  { name: "Leads", tone: "green", icon: CircleCheck },
  { name: "Order_Items", tone: "blue", icon: ShoppingCart },
  { name: "Orders", tone: "rose", icon: FileText },
  { name: "Products", tone: "mint", icon: Package },
  { name: "SalesRepresentatives", tone: "amber", icon: BadgeDollarSign },
  { name: "Tasks", tone: "green", icon: ListChecks },
];

/* Covers are drawn, not fetched. A promo that pauses mid-take because a photo
   service was slow is a promo you cannot record, and a page that claims the app
   makes no outside requests should not open the clip by making eight. */
const COVER: Record<Product["group"], [string, string]> = {
  Drinkware: ["#dbe4f0", "#9fb3cd"],
  Desk: ["#e4dcf0", "#b3a2cd"],
  Kitchen: ["#dcebdf", "#9dc0a6"],
};

function Cover({ p, on }: { p: Product; on: number }) {
  const [a, b] = COVER[p.group];
  return (
    <span
      className="block h-[30px] w-[42px] rounded-[3px] transition-all duration-500"
      style={{
        background: `linear-gradient(135deg, ${a} 0%, ${b} 100%)`,
        opacity: on,
        transform: `scale(${0.86 + 0.14 * on})`,
      }}
      aria-hidden
    />
  );
}

/** The workspace window: collection strip, toolbar, and the grid filling in. */
export function Workspace({
  rows,
  covers,
  tabs,
  flash,
  editing,
  filtered = false,
  search,
  override,
}: {
  /** how many of the twelve rows have landed */
  rows: number;
  /** how many rows have their cover drawn */
  covers: number;
  /** how many collections have appeared in the strip */
  tabs: number;
  /** the row the history panel is about, highlighted */
  flash: number;
  /** a cell a person is typing in by hand: which row, and what is in it */
  editing?: { row: number; text: string };
  /** the low-stock filter an agent set, applied */
  filtered?: boolean;
  /** the search field, open with this query in it */
  search?: string;
  /** a price already changed, shown as a settled value rather than mid-edit */
  override?: { row: number; price: string };
  }) {
  const strip = COLLECTIONS.slice(0, tabs);
  const query = (search ?? "").trim().toLowerCase();
  const hit = (p: Product) => !query || p.name.toLowerCase().includes(query);
  const matches = PRODUCTS.filter(hit).length;
  let seen = 0;

  return (
    <div className="canvas appui h-full w-full overflow-hidden">
      <AppTabs tabs={strip} active="Products" />
      {/* Before the agent has built anything there is no view to be in, and a
          toolbar claiming three groups over an empty grid reads as a lie. */}
      <AppToolbar
        view={rows ? (filtered ? "Products / Low stock" : "Products / All") : "New workspace"}
        groups={rows ? 3 : undefined}
        filters={filtered ? 1 : undefined}
      />

      {search !== undefined && (
        <div
          className="flex items-center gap-2 border-b px-3 py-2"
          style={{ borderColor: "var(--app-line)", background: "var(--app-band)" }}
        >
          <Search className="h-3.5 w-3.5 flex-none" strokeWidth={1.8} style={{ color: "var(--app-muted)" }} />
          <span className="text-[13px]" style={{ color: "var(--app-text)" }}>
            {search}
            <span className="ml-0.5 inline-block h-3 w-[2px] translate-y-[2px] bg-current align-middle" />
          </span>
          <span className="mono ml-auto text-[11px]" style={{ color: "var(--app-muted)" }}>
            {matches} of 12 · 1 ms
          </span>
        </div>
      )}

      {rows === 0 && (
        <div className="flex h-[300px] flex-col items-center justify-center gap-2">
          <p className="text-[15px]" style={{ color: "var(--app-text)" }}>Empty workspace</p>
          <p className="text-[13px]" style={{ color: "var(--app-muted)" }}>
            No collections yet. Ask Claude for the ones you need.
          </p>
        </div>
      )}

      <table className="w-full border-collapse" hidden={rows === 0}>
        <thead>
          <tr style={{ background: "var(--app-bg)" }}>
            <th className="border-b border-r px-3 py-2" style={{ borderColor: "var(--app-line)", width: 40 }}>
              <Box />
            </th>
            <HeadCell icon={Type} tag="primary">Product</HeadCell>
            <HeadCell icon={ImageIcon} width={110}>Cover</HeadCell>
            <HeadCell icon={AlignLeft} width={150}>SKU</HeadCell>
            <HeadCell icon={Hash} width={130}>Price</HeadCell>
            <HeadCell icon={Hash} width={120}>Stock</HeadCell>
            <HeadCell icon={CircleDot} width={190}>Status</HeadCell>
          </tr>
        </thead>
        <tbody>
          {GROUPS.map((g) => {
            const items = PRODUCTS.filter((p) => p.group === g && (!filtered || p.stock < 10) && hit(p));
            const before = seen;
            seen += items.length;
            if (rows <= before || items.length === 0) return null;
            return (
              <Fragment key={g}>
                <GroupRow label={g} count={items.length} span={7} />
                {items.map((p, i) => {
                  const idx = before + i;
                  if (idx >= rows) return null;
                  return (
                    <tr
                      key={p.id}
                      className="animate-row-in"
                      style={{ background: idx === flash ? "var(--app-flash)" : undefined }}
                    >
                      <Cell width={40}><Box /></Cell>
                      <Cell>
                        <span className="flex items-center gap-2">
                          <Chip tone={GROUP_TONE[p.group]} letter={p.group[0]} />
                          <span className="text-[13px]">{p.name}</span>
                        </span>
                      </Cell>
                      <Cell width={110}>
                        <Cover p={p} on={clamp01(covers - idx)} />
                      </Cell>
                      <Cell width={150}><span className="mono text-[12px]">{p.id}</span></Cell>
                      <Cell width={130}>
                        {editing && editing.row === idx ? (
                          <span
                            className="inline-flex items-center rounded-[3px] px-1 py-[1px] text-[13px] tabular-nums"
                            style={{ outline: "2px solid var(--app-btn)", background: "var(--app-bg)" }}
                          >
                            {editing.text}
                            <span className="ml-[1px] inline-block h-3.5 w-[2px] bg-current align-middle" />
                          </span>
                        ) : (
                          <span className="text-[13px] tabular-nums">
                            {override && override.row === idx ? override.price : p.price}
                          </span>
                        )}
                      </Cell>
                      <Cell width={120}><span className="text-[13px] tabular-nums">{p.stock}</span></Cell>
                      <Cell width={190}><Pill tone={STOCK[p.state].tone}>{STOCK[p.state].label}</Pill></Cell>
                    </tr>
                  );
                })}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/** The row-detail history, sliding in over the grid: who changed what, when. */
export function HistoryCard({ p }: { p: number }) {
  const inP = ease(seg(p, 0.05, 0.3));
  const entries = [
    { at: 0.35, field: "Status", from: "Contacted", to: "Qualified" },
    { at: 0.55, field: "Stock", from: "12", to: "8" },
    { at: 0.72, field: "Cover", from: "", to: "cover-027.png" },
  ];
  return (
    <div
      className="appui absolute right-6 top-6 w-[420px] overflow-hidden rounded-[10px] border shadow-[0_2px_8px_rgba(0,0,0,0.08),0_28px_60px_-20px_rgba(0,0,0,0.45)]"
      style={{
        borderColor: "var(--app-line)",
        background: "var(--app-bg)",
        opacity: inP,
        transform: `translateY(${(1 - inP) * 14}px)`,
      }}
    >
      <div className="flex items-center gap-2 border-b px-3.5 py-2.5" style={{ borderColor: "var(--app-line)" }}>
        <span className="mono text-[12px]" style={{ color: "var(--app-text)" }}>PRD-027</span>
        <span className="ml-auto text-[12px]" style={{ color: "var(--app-muted)" }}>History</span>
      </div>
      <div className="flex flex-col gap-3 px-3.5 py-3">
        {entries.map((e) => {
          const on = ease(seg(p, e.at, e.at + 0.12));
          return (
            <div
              key={e.field}
              className="flex items-start gap-2.5"
              style={{ opacity: on, transform: `translateY(${(1 - on) * 8}px)` }}
            >
              <Chip tone="lilac" letter="C" />
              <div className="min-w-0">
                <p className="text-[12px]" style={{ color: "var(--app-muted)" }}>
                  <span className="mono" style={{ color: "var(--app-text)" }}>claude-code</span> · 03:08 PM
                </p>
                <p className="mt-1 text-[13px]" style={{ color: "var(--app-text)" }}>
                  {e.field}{" "}
                  {e.from && <span className="line-through" style={{ color: "var(--app-muted)" }}>{e.from}</span>}{" "}
                  <span aria-hidden>→</span> {e.to}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** The four measured readings, landing one after another. */
const STATS: [string, string, string][] = [
  ["0.3", "s", "From cold to open"],
  ["1", "ms", "Edit a cell"],
  ["14", "ms", "Read a thousand rows"],
  ["0", "", "Requests to anywhere else"],
];

export function Numbers({ p }: { p: number }) {
  return (
    <div className="grid w-full grid-cols-4 gap-px bg-line">
      {STATS.map(([v, unit, label], i) => {
        const on = ease(seg(p, 0.08 + i * 0.11, 0.34 + i * 0.11));
        return (
          <div
            key={label}
            className="bg-surface px-10 py-12"
            style={{ opacity: on, transform: `translateY(${(1 - on) * 18}px)` }}
          >
            <span className="text-[76px] font-[380] leading-none tracking-[-0.03em] text-ink">
              {v}
              {unit && <span className="text-display-cont"> {unit}</span>}
            </span>
            <p className="mt-5 text-[19px] leading-snug text-ink-2">{label}</p>
          </div>
        );
      })}
    </div>
  );
}

/** What it deliberately does not do, struck out one line at a time. */
const LIMITS = ["No telemetry", "No auto-update", "No plugin store", "No account to open a file"];

export function Limits({ p }: { p: number }) {
  return (
    <div className="flex w-full flex-col items-center gap-6">
      {LIMITS.map((line, i) => {
        const on = ease(seg(p, 0.06 + i * 0.13, 0.28 + i * 0.13));
        const strike = ease(seg(p, 0.16 + i * 0.13, 0.42 + i * 0.13));
        return (
          <p
            key={line}
            className="relative text-[44px] font-[380] leading-tight tracking-[-0.025em] text-ink"
            style={{ opacity: on }}
          >
            {line}
            <span
              className="absolute left-0 top-1/2 h-px bg-ink"
              style={{ width: `${strike * 100}%` }}
              aria-hidden
            />
          </p>
        );
      })}
    </div>
  );
}

/* ─── cards ───────────────────────────────────────────────────────────────── */

/** The claim and the chapter names. Deliberately the cheapest thing in the
 *  film: words on paper, held long enough to read twice. They are what turns
 *  five minutes into five short films. */
export function Card({ title, p, big = false }: { title: string; p: number; big?: boolean }) {
  const on = ease(seg(p, 0, 0.12));
  return (
    <p
      className={`mx-auto max-w-[22ch] text-center font-[380] leading-[1.08] tracking-[-0.03em] text-ink ${
        big ? "text-[92px]" : "text-[68px]"
      }`}
      style={{ opacity: on }}
    >
      {title}
    </p>
  );
}

/** The pointer, so a beat of hand editing reads as a person rather than as
 *  more automation. */
export function Pointer({ x, y }: { x: number; y: number }) {
  return (
    <svg
      className="pointer-events-none absolute z-30 h-9 w-9 drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]"
      style={{ left: x, top: y }}
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path d="M5 2l14 10.5-6.2.6 3.4 6.6-2.7 1.4-3.4-6.7L5 18.6z" fill="#fff" stroke="#111" strokeWidth="1.2" />
    </svg>
  );
}

/** The undo affordance, shown at the moment it matters. */
export function UndoToast({ p }: { p: number }) {
  const on = ease(seg(p, 0.42, 0.56)) * (1 - ease(seg(p, 0.9, 1)));
  return (
    <div
      className="appui absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-[10px] border px-4 py-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.1),0_20px_40px_-16px_rgba(0,0,0,0.4)]"
      style={{ borderColor: "var(--app-line)", background: "var(--app-bg)", opacity: on }}
    >
      <Undo2 className="h-4 w-4" strokeWidth={1.8} style={{ color: "var(--app-muted)" }} />
      <span className="text-[13px]" style={{ color: "var(--app-text)" }}>Price reverted to $22.50</span>
      <span className="mono text-[11px]" style={{ color: "var(--app-muted)" }}>⌘Z</span>
    </div>
  );
}

/* ─── git ─────────────────────────────────────────────────────────────────── */

const COMMITS = [
  { hash: "9f2c1ab", who: "claude-code", msg: "Seed Products from the catalogue", when: "3 min ago" },
  { hash: "4d81e07", who: "codex", msg: "Filter Products to low stock", when: "2 min ago" },
  { hash: "a17b93e", who: "you", msg: "Change price on PRD-027", when: "1 min ago" },
  { hash: "c60d5f4", who: "you", msg: "Undo price change on PRD-027", when: "just now" },
];

/* The undo the scene before this one performed, as it lands on disk. An undo
   that quietly rewrote history would be worse than one that does not exist:
   it is a commit like any other, which is the whole argument. */
const DIFF = [
  { sign: " ", text: '  "id": "PRD-027",' },
  { sign: "-", text: '  "price": 24.00,' },
  { sign: "+", text: '  "price": 22.50,' },
  { sign: " ", text: '  "stock": 8,' },
];

/** The same edits, seen as what they actually are on disk. */
export function GitScene({ p }: { p: number }) {
  return (
    <div className="canvas appui w-full overflow-hidden">
      <div className="flex items-center gap-2 border-b px-4 py-2.5" style={{ borderColor: "var(--app-line)" }}>
        <span className="mono text-[12px]" style={{ color: "var(--app-muted)" }}>workspace/products.mochi</span>
        <span className="mono ml-auto text-[12px]" style={{ color: "var(--app-muted)" }}>main</span>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div className="border-r" style={{ borderColor: "var(--app-line)" }}>
          {COMMITS.map((c, i) => {
            const on = ease(seg(p, 0.06 + i * 0.09, 0.24 + i * 0.09));
            return (
              <div
                key={c.hash}
                className="flex items-start gap-3 border-b px-4 py-3"
                style={{ borderColor: "var(--app-line)", opacity: on }}
              >
                <span className="mono flex-none text-[12px]" style={{ color: "var(--app-muted)" }}>{c.hash}</span>
                <div className="min-w-0">
                  <p className="text-[13px]" style={{ color: "var(--app-text)" }}>{c.msg}</p>
                  <p className="mt-1 text-[12px]" style={{ color: "var(--app-muted)" }}>
                    <span className="mono">{c.who}</span> · {c.when}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="px-4 py-3.5" style={{ opacity: ease(seg(p, 0.4, 0.6)) }}>
          {DIFF.map((d, i) => (
            <p
              key={i}
              className="mono text-[13px] leading-[1.7]"
              style={{
                color: d.sign === "+" ? "var(--pill-mint-fg)" : d.sign === "-" ? "var(--pill-rose-fg)" : "var(--app-muted)",
                background: d.sign === " " ? "transparent" : `var(--pill-${d.sign === "+" ? "mint" : "rose"}-bg)`,
              }}
            >
              {d.sign}
              {d.text}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── what an agent has to read ───────────────────────────────────────────── */

/** Two ways to answer the same question. No token counts are shown, because
 *  the honest number depends on the table: the point is the shape of what
 *  crosses into the conversation, and that is visible without a figure. */
export function Compare({ p }: { p: number }) {
  const left = ease(seg(p, 0.06, 0.34));
  const right = ease(seg(p, 0.4, 0.64));
  return (
    <div className="grid w-full gap-8" style={{ gridTemplateColumns: "1fr 1fr" }}>
      <div className="canvas appui overflow-hidden" style={{ opacity: left }}>
        <div className="border-b px-4 py-2.5" style={{ borderColor: "var(--app-line)" }}>
          <span className="text-[14px]" style={{ color: "var(--app-text)" }}>Read the whole table</span>
        </div>
        <div className="h-[330px] overflow-hidden px-4 py-3">
          {/* Ten thousand rows of nothing in particular: the shape of a table
              poured into a conversation, filling the panel the way it fills a
              context window. */}
          {Array.from({ length: 26 }).map((_, i) => (
            <div key={i} className="mb-[7px] flex gap-2" style={{ opacity: 1 - i * 0.02 }}>
              {[3, 7, 4, 5, 2, 6].map((grow, j) => (
                <span
                  key={j}
                  className="block h-[7px] rounded-[2px]"
                  style={{ flex: `${grow} 1 0`, background: "var(--app-faint)" }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="canvas appui overflow-hidden" style={{ opacity: right }}>
        <div className="border-b px-4 py-2.5" style={{ borderColor: "var(--app-line)" }}>
          <span className="mono text-[14px]" style={{ color: "var(--app-text)" }}>summarise_table</span>
        </div>
        <div className="h-[330px] px-4 py-3">
          <p className="mono text-[15px] leading-[2]" style={{ color: "var(--app-text)" }}>
            rows: 10,000
            <br />
            low_stock: 3
            <br />
            backorder: 2
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── the offer ───────────────────────────────────────────────────────────── */

/* The MCP call allowance leads both lists, because it is the line that decides
   which plan someone is on. The figures are PLAN_LIMITS in the app itself. */
const PLANS: [string, string, string[]][] = [
  ["Free", "For one person", [
    "2,000 MCP calls a week",
    "Everything runs on your own machine",
    "Full history, and undo that goes back",
    "Connect Claude, Codex or OpenCode",
  ]],
  ["Pro", "For a team", [
    "MCP calls with no limit",
    "Everything in Free",
    "Seats for the rest of your team",
    "Shared workspaces that stay in step",
  ]],
];

/** Close on how you get it, not on what it does. */
export function PricingCard({ p }: { p: number }) {
  return (
    <div className="w-full">
      <p
        className="mb-12 text-center text-[56px] font-[380] leading-tight tracking-[-0.03em] text-ink"
        style={{ opacity: ease(seg(p, 0, 0.14)) }}
      >
        Free while it is just you
      </p>
      <div className="grid gap-px bg-line" style={{ gridTemplateColumns: "1fr 1fr" }}>
        {PLANS.map(([name, tagline, features], i) => {
          const on = ease(seg(p, 0.16 + i * 0.12, 0.44 + i * 0.12));
          return (
            <div key={name} className="bg-surface px-12 py-10" style={{ opacity: on }}>
              <p className="text-[40px] font-[380] leading-none tracking-[-0.02em] text-ink">{name}</p>
              <p className="mt-4 text-[20px] text-ink-2">{tagline}</p>
              <ul className="mt-8 flex flex-col gap-3">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-[19px] leading-snug text-ink-2">
                    <span className="mt-[9px] block h-1 w-1 flex-none rounded-full bg-ink-3" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
