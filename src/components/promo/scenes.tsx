"use client";

import { Fragment } from "react";
import {
  AlignLeft,
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
}: {
  /** how many of the twelve rows have landed */
  rows: number;
  /** how many rows have their cover drawn */
  covers: number;
  /** how many collections have appeared in the strip */
  tabs: number;
  /** the row the history panel is about, highlighted */
  flash: number;
}) {
  const strip = COLLECTIONS.slice(0, tabs);
  let seen = 0;

  return (
    <div className="canvas appui h-full w-full overflow-hidden">
      <AppTabs tabs={strip} active="Products" />
      {/* Before the agent has built anything there is no view to be in, and a
          toolbar claiming three groups over an empty grid reads as a lie. */}
      <AppToolbar view={rows ? "Products / All" : "New workspace"} groups={rows ? 3 : undefined} />

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
            const items = PRODUCTS.filter((p) => p.group === g);
            const before = seen;
            seen += items.length;
            if (rows <= before) return null;
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
                      <Cell width={130}><span className="text-[13px] tabular-nums">{p.price}</span></Cell>
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
