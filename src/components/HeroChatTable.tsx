"use client";

import { Fragment, memo, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AlignLeft,
  BadgeDollarSign,
  Calendar,
  CircleCheck,
  CircleDot,
  FileText,
  Hash,
  ListChecks,
  MessageSquare,
  Package,
  ShoppingCart,
  Type,
  Users,
} from "lucide-react";
import { useLang } from "./LanguageProvider";
import {
  AppTabs,
  AppToolbar,
  Box,
  Cell,
  Chip,
  ClaudeMessage,
  ClaudePanel,
  type Collection,
  GroupRow,
  HeadCell,
  Pill,
  type AgentSkin,
  type Msg,
  type Tone,
} from "./appui";

/* The hero demo. Not a screenshot and not a div dressed up as one: a working
   miniature of the Mochi grid at the real app's chrome and colours, with the
   agent panel floating inside it the way it does in the product.

   The script is the pitch in three sentences: an empty workspace is seeded into
   a CRM, the agent fills a whole column with generated product covers, and then
   answers a question about the data it just wrote. */

type Stock = "in" | "low" | "back";

interface Product {
  id: string;
  group: "Drinkware" | "Desk" | "Kitchen";
  name: string;
  price: string;
  stock: number;
  state: Stock;
  updated: string;
}

/* Sample catalogue, same shape as the real Products collection. */
const PRODUCTS: Product[] = [
  { id: "PRD-014", group: "Drinkware", name: "Ceramic mug, matte white", price: "$18.00", stock: 42, state: "in", updated: "08/02/2026" },
  { id: "PRD-027", group: "Drinkware", name: "Double-wall glass, 250ml", price: "$22.50", stock: 8, state: "low", updated: "08/05/2026" },
  { id: "PRD-031", group: "Drinkware", name: "Enamel camp mug", price: "$16.00", stock: 0, state: "back", updated: "07/29/2026" },
  { id: "PRD-042", group: "Drinkware", name: "Coffee dripper V60", price: "$28.00", stock: 126, state: "in", updated: "08/08/2026" },

  { id: "PRD-008", group: "Desk", name: "Notebook A5, dot grid", price: "$14.00", stock: 64, state: "in", updated: "08/03/2026" },
  { id: "PRD-011", group: "Desk", name: "Fineliner set, 6 colours", price: "$19.50", stock: 9, state: "low", updated: "08/06/2026" },
  { id: "PRD-019", group: "Desk", name: "Kraft folder, pack of 10", price: "$11.00", stock: 210, state: "in", updated: "07/31/2026" },
  { id: "PRD-023", group: "Desk", name: "Desk pad, felt", price: "$34.00", stock: 3, state: "low", updated: "08/09/2026" },
  { id: "PRD-036", group: "Desk", name: "Cable tidy strap, pack of 5", price: "$9.50", stock: 88, state: "in", updated: "08/04/2026" },

  { id: "PRD-005", group: "Kitchen", name: "Cast iron skillet, 26cm", price: "$62.00", stock: 17, state: "in", updated: "08/01/2026" },
  { id: "PRD-016", group: "Kitchen", name: "Olive wood board", price: "$45.00", stock: 0, state: "back", updated: "07/27/2026" },
  { id: "PRD-029", group: "Kitchen", name: "Linen apron", price: "$39.00", stock: 38, state: "in", updated: "08/07/2026" },
];

const STOCK: Record<Stock, { label: string; tone: Tone }> = {
  in: { label: "In stock", tone: "mint" },
  low: { label: "Low stock", tone: "amber" },
  back: { label: "Backorder", tone: "rose" },
};
const GROUP_TONE: Record<Product["group"], Tone> = {
  Drinkware: "blue",
  Desk: "lilac",
  Kitchen: "green",
};
const GROUPS: Product["group"][] = ["Drinkware", "Desk", "Kitchen"];

const COLLECTIONS: Collection[] = [
  { name: "Customers", tone: "amber", icon: Users },
  { name: "Interactions", tone: "lilac", icon: MessageSquare },
  { name: "Leads", tone: "green", icon: CircleCheck },
  { name: "Order_Items", tone: "blue", icon: ShoppingCart },
  { name: "Orders", tone: "rose", icon: FileText },
  { name: "Products", tone: "mint", icon: Package },
  { name: "SalesRepresentatives", tone: "amber", icon: BadgeDollarSign },
  { name: "Tasks", tone: "green", icon: ListChecks },
];

const COLS = 11;
/** The MCP call behind each turn, and roughly how long it takes. */
const TOOLS = [
  { name: "mochi.create_collections", secs: 1.2 },
  { name: "mochi.generate_covers", secs: 2.4 },
  { name: "mochi.query_records", secs: 0.6 },
];
/** what the third turn asks about, and therefore what it filters down to */
const LOW = (p: Product) => p.stock < 10;


/** The grid, kept out of the transcript's render path. Typing runs one state
 *  update per character, and re-rendering twelve rows and twelve covers on each
 *  of them made the conversation crawl. */
const Grid = memo(function Grid({
  rows,
  imaged,
  imaging,
  flash,
}: {
  rows: Product[];
  imaged: boolean;
  imaging: boolean;
  flash: "rows" | "images" | null;
}) {
  // Row numbers run continuously across groups, and start at 2 the way the
  // app numbers them once a group header occupies the first line.
  const rowNumber = new Map(rows.map((p, i) => [p.id, i + 2]));

const renderRow = (p: Product) => {
  return (
    <tr
      key={p.id}
      className="animate-row-in transition-colors duration-700"
      style={{
        background: flash ? "var(--app-flash)" : "transparent",
        animationDelay: `${Math.min((rowNumber.get(p.id) ?? 2) - 2, 12) * 35}ms`,
      }}
    >
      <Cell width={36}><Box /></Cell>
      <Cell width={40} className="text-right">
        <span className="text-[11px] tabular-nums" style={{ color: "var(--app-faint)" }}>
          {rowNumber.get(p.id)}
        </span>
      </Cell>
      <Cell width={66}>
        {/* The cell reserves its size from the start, so filling it with a
            generated cover does not shift every row underneath. */}
        <span
          className={`block h-[28px] w-[40px] overflow-hidden rounded-[3px] ${
            imaging ? "shimmer" : ""
          }`}
          style={{ background: "var(--app-band)" }}
        >
          {imaged && (
            <Image
              src={`https://picsum.photos/seed/mochi-${p.id}/80/56`}
              alt=""
              width={40}
              height={28}
              unoptimized
              className="h-full w-full object-cover"
            />
          )}
        </span>
      </Cell>
      <Cell width={132}>
        <span className="flex items-center gap-2">
          <Chip tone={GROUP_TONE[p.group]} letter="P" />
          <span className="mono text-[12px]">{p.id}</span>
        </span>
      </Cell>
      <Cell><span className="block truncate text-[12.5px]">{p.name}</span></Cell>
      <Cell width={126}><Pill tone={GROUP_TONE[p.group]}>{p.group}</Pill></Cell>
      <Cell width={100} className="text-right">
        <span className="mono text-[12px] tabular-nums">{p.price}</span>
      </Cell>
      <Cell width={88} className="text-right">
        <span className="mono text-[12px] tabular-nums">{p.stock}</span>
      </Cell>
      <Cell width={126}><Pill tone={STOCK[p.state].tone}>{STOCK[p.state].label}</Pill></Cell>
      <Cell width={120}><span className="mono text-[12px]">{p.updated}</span></Cell>
    </tr>
  );
};

  return (
      <table className="w-full min-w-[58rem] border-collapse">
        <thead>
          <tr style={{ background: "var(--app-bg)" }}>
            <th className="border-b border-r px-3 py-2" style={{ borderColor: "var(--app-line)", width: 36 }}>
              <Box />
            </th>
            <th
              className="border-b border-r px-2 py-2 text-right text-[11px] font-normal"
              style={{ borderColor: "var(--app-line)", color: "var(--app-faint)", width: 40 }}
            >
              #
            </th>
            <HeadCell icon={Package} width={66}>Cover</HeadCell>
            <HeadCell icon={Type} tag="primary" width={132}>Product_ID</HeadCell>
            <HeadCell icon={AlignLeft}>Name</HeadCell>
            <HeadCell icon={CircleDot} width={126}>Category</HeadCell>
            <HeadCell icon={Hash} width={100} align="right">Price</HeadCell>
            <HeadCell icon={Hash} width={88} align="right">Stock</HeadCell>
            <HeadCell icon={CircleDot} width={126}>Status</HeadCell>
            <HeadCell icon={Calendar} width={120}>Updated</HeadCell>
          </tr>
        </thead>
        <tbody>
          {GROUPS.map((g) => {
            const inGroup = rows.filter((p) => p.group === g);
            if (!inGroup.length) return null;
            return (
              <Fragment key={g}>
                <GroupRow label={g} count={inGroup.length} span={COLS} />
                {inGroup.map(renderRow)}
              </Fragment>
            );
          })}
        </tbody>
      </table>
  );
});

export default function HeroChatTable({ agent = "claude" }: { agent?: AgentSkin }) {
  const { m } = useLang();
  const { placeholder, empty, turns } = m.heroDemo;

  const [seeded, setSeeded] = useState(false);
  const [imaged, setImaged] = useState(false);
  const [filtered, setFiltered] = useState(false);
  const [log, setLog] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [flash, setFlash] = useState<"rows" | "images" | null>(null);
  const [tool, setTool] = useState<{ turn: number; running: boolean } | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    const apply = (turn: number) => {
      if (turn === 0) { setSeeded(true); setFlash("rows"); }
      if (turn === 1) { setImaged(true); setFlash("images"); }
      if (turn === 2) { setFiltered(true); setFlash(null); }
    };

    const settle = () => {
      // Reduced motion gets the finished workspace and the finished
      // conversation, which carries the same message without anything moving.
      setSeeded(true);
      setImaged(true);
      setLog(turns.flatMap((t) => [{ who: "you" as const, text: t.ask }, { who: "claude" as const, text: t.reply }]));
    };

    const run = async () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        settle();
        return;
      }
      while (!cancelled) {
        setSeeded(false);
        setImaged(false);
        setFiltered(false);
        setLog([]);
        setDraft("");
        setFlash(null);
        setTool(null);
        await sleep(1300);

        for (let i = 0; i < turns.length; i++) {
          if (cancelled) return;
          setFlash(null);

          const { ask, reply } = turns[i];
          for (let c = 1; c <= ask.length; c++) {
            if (cancelled) return;
            setDraft(ask.slice(0, c));
            await sleep(20);
          }
          await sleep(380);
          if (cancelled) return;
          setDraft("");
          setLog((l) => [...l, { who: "you", text: ask }]);
          await sleep(420);

          // The call runs before the answer exists, which is both how it works
          // and what makes the table changing underneath feel caused rather
          // than coincidental.
          if (cancelled) return;
          setTool({ turn: i, running: true });
          setLog((l) => [...l, { who: "claude", text: TOOLS[i].name, tool: { running: true, secs: TOOLS[i].secs } }]);
          await sleep(TOOLS[i].secs * 1000);
          if (cancelled) return;
          apply(i);
          setTool({ turn: i, running: false });
          setLog((l) => {
            const next = [...l];
            next[next.length - 1] = { ...next[next.length - 1], tool: { running: false, secs: TOOLS[i].secs } };
            return next;
          });
          await sleep(480);

          if (cancelled) return;
          setLog((l) => [...l, { who: "claude", text: "" }]);
          for (let c = 1; c <= reply.length; c++) {
            if (cancelled) return;
            setLog((l) => {
              const next = [...l];
              next[next.length - 1] = { who: "claude", text: reply.slice(0, c) };
              return next;
            });
            await sleep(16);
          }

          await sleep(2200);
        }
        await sleep(2600);
      }
    };

    run();
    return () => { cancelled = true; };
  }, [turns]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [log, draft]);

  const visible = filtered ? PRODUCTS.filter(LOW) : PRODUCTS;

  return (
    <div className="canvas appui relative">
      <AppTabs tabs={seeded ? COLLECTIONS : []} active="Products" />
      <AppToolbar view="Grid view" groups={seeded ? 1 : 0} filters={filtered ? 1 : 0} />

      <div className="h-[340px] overflow-auto sm:h-[420px] lg:h-[560px]">
        {seeded ? (
          <Grid
            rows={visible}
            imaged={imaged}
            imaging={!!tool && tool.turn === 1 && tool.running}
            flash={flash}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2">
            <Package className="h-5 w-5" strokeWidth={1.5} style={{ color: "var(--app-faint)" }} aria-hidden />
            <p className="text-[13px]" style={{ color: "var(--app-muted)" }}>{empty}</p>
          </div>
        )}
      </div>

      
      {/* Claude, floating inside the grid the way it does in the app. Below lg
          it drops into the flow instead, where it has room to be read. */}
      <ClaudePanel
        agent={agent === "codex" ? "Codex" : m.heroDemo.agent}
        skin={agent}
        placeholder={placeholder}
        draft={draft}
        scrollRef={scrollRef}
        bodyClass="h-[214px] lg:h-[248px]"
        floating="right"
      >
        {log.map((msg, i) => (
          <ClaudeMessage key={i} msg={msg} />
        ))}
      </ClaudePanel>
    </div>
  );
}
