"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { GitCommit, ArrowUp } from "lucide-react";
import ProductPreview, { DEALS, type Deal } from "./ProductPreview";

/* ── the demo script ───────────────────────────────────────────────────────────
   One loop of "teammate asks → agent runs a tool → the table changes". Every
   beat is a full snapshot, so the loop can restart from any point without
   accumulating state. Row data is the real seeded Deals table, so the write
   beat lands on exactly the 5 rows that exist in the live workspace. */

const BASE_ROWS: Deal[] = DEALS.slice(0, 4);
const ALL_ROWS: Deal[] = DEALS;
const RICH_ROWS: Deal[] = DEALS.filter((d) => d.value > 30000);

type ChatMsg = { who: "them" | "mochi"; text: string };
const CHAT: ChatMsg[] = [
  { who: "them", text: "@mochi add Northstar Robotics — $32.9k, negotiation, Priya owns it" },
  { who: "mochi", text: "Added to Deals ✓" },
  { who: "them", text: "@mochi which of these are over $30k?" },
  { who: "mochi", text: "3 of 5 — filtered the view" },
];

const TERM: string[][] = [
  [],
  ["> create record in Deals", "● Ran 1 command", "└ create-records"],
  ["> create record in Deals", "● Ran 1 command", "└ create-records", "✓ 1 row written", "· 0.9s · ↓ 640 tokens"],
  ["> filter Deals where Value > 30000", "● Ran 1 command", "└ configure-view"],
  ["> filter Deals where Value > 30000", "● Ran 1 command", "└ configure-view", "✓ 3 of 5 rows match", "· 0.6s · ↓ 410 tokens"],
];

const ACTIVITY = [
  { kind: "commit" as const, who: "sarah", msg: "add Northstar Robotics" },
  { kind: "push" as const, who: "mochi", msg: "push to origin/main" },
];

type Beat = {
  chat: number;
  term: number;
  rows: Deal[];
  act: number;
  hi: string | null;
  filter: string | null;
  writing?: boolean;
  ms: number;
};

const BEATS: Beat[] = [
  { chat: 0, term: 0, rows: BASE_ROWS, act: 0, hi: null, filter: null, ms: 2000 },
  { chat: 1, term: 0, rows: BASE_ROWS, act: 0, hi: null, filter: null, ms: 1700 },
  { chat: 1, term: 1, rows: BASE_ROWS, act: 0, hi: null, filter: null, writing: true, ms: 1400 },
  { chat: 2, term: 2, rows: ALL_ROWS, act: 1, hi: "Northstar Robotics", filter: null, ms: 2600 },
  { chat: 3, term: 2, rows: ALL_ROWS, act: 2, hi: null, filter: null, ms: 1700 },
  { chat: 3, term: 3, rows: ALL_ROWS, act: 2, hi: null, filter: null, ms: 1300 },
  { chat: 4, term: 4, rows: RICH_ROWS, act: 2, hi: null, filter: "Value > $30,000", ms: 3200 },
];

/** macOS-style traffic lights, shared by every window on the stage */
function TrafficLights() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
    </div>
  );
}

function Window({
  children,
  className = "",
  dark = false,
}: {
  children: ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border shadow-[0_18px_50px_rgba(23,25,60,0.16)] ${
        dark ? "border-white/10 bg-[#16181d]" : "border-border bg-card"
      } ${className}`}
    >
      <div className={`flex h-8 items-center px-3 ${dark ? "bg-white/5" : "bg-secondary/70"}`}>
        <TrafficLights />
      </div>
      {children}
    </div>
  );
}

/* ── satellite 1: a teammate pinging the agent from team chat ─────────────── */
function ChatWindow({ msgs }: { msgs: ChatMsg[] }) {
  return (
    <Window className="w-full">
      <div className="px-3 py-3">
        <p className="text-[11px] font-medium text-muted-foreground">#revenue</p>
        <div className="mt-2.5 min-h-[92px] space-y-2">
          {msgs.map((msg, i) => (
            <div
              key={i}
              className="flex animate-in fade-in slide-in-from-bottom-1 items-start gap-2 duration-300"
            >
              <span
                className={`flex h-5 w-5 flex-none items-center justify-center rounded-full text-[10px] font-semibold ${
                  msg.who === "mochi"
                    ? "bg-foreground text-background"
                    : "bg-brand-soft text-brand-soft-foreground"
                }`}
              >
                {msg.who === "mochi" ? "M" : "S"}
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-foreground">
                  {msg.who === "mochi" ? "Mochi" : "Sarah"}
                  {msg.who === "mochi" && (
                    <span className="ml-1 rounded bg-secondary px-1 text-[9px] font-normal text-muted-foreground">
                      APP
                    </span>
                  )}
                </p>
                <p className="mt-0.5 text-[11px] leading-snug text-foreground">{msg.text}</p>
              </div>
            </div>
          ))}
          {msgs.length === 0 && (
            <p className="py-2 text-[11px] text-muted-foreground">Ask Mochi anything…</p>
          )}
        </div>
      </div>
    </Window>
  );
}

/* ── satellite 2: the CLI doing the work, agent-native ────────────────────── */
function TerminalWindow({ lines }: { lines: string[] }) {
  const tone = (l: string) =>
    l.startsWith(">")
      ? "rounded bg-white/10 px-1.5 py-1 text-white/90"
      : l.startsWith("✓")
        ? "text-[#28c840]"
        : l.startsWith("●")
          ? "text-[#f97316]"
          : l.startsWith("·")
            ? "pl-2 text-[9px] text-white/35"
            : "pl-2 text-white/45";

  return (
    <Window dark className="w-full">
      <div className="mono min-h-[92px] space-y-1.5 px-3 py-3 text-[10px] leading-relaxed">
        {lines.map((l, i) => (
          <p key={i} className={`animate-in fade-in duration-200 ${tone(l)}`}>
            {l}
          </p>
        ))}
        <div className="mt-2 rounded border border-white/10 px-1.5 py-1.5 text-white/50">
          &gt;<span className="animate-cursor ml-0.5 inline-block h-2.5 w-1 translate-y-px bg-white/70 align-middle" />
        </div>
      </div>
      <div className="mono flex items-center gap-1.5 border-t border-white/10 px-3 py-2 text-[9px] text-white/40">
        <span className="text-[#28c840]">▶▶ auto</span>
        <span>mochi · local-first</span>
      </div>
    </Window>
  );
}

/* ── satellite 3: git-backed history, the trust story ─────────────────────── */
function ActivityWindow({ count }: { count: number }) {
  const events = ACTIVITY.slice(0, count);
  return (
    <Window className="w-full">
      <div className="border-b border-border px-3 py-2">
        <p className="text-[11px] font-medium text-foreground">Workspace activity</p>
      </div>
      <div className="min-h-[92px] space-y-2.5 px-3 py-3">
        {events.length === 0 && (
          <p className="text-[11px] text-muted-foreground">No changes yet</p>
        )}
        {events.map((e) => (
          <div
            key={e.msg}
            className="flex animate-in fade-in slide-in-from-right-1 items-start gap-2 duration-300"
          >
            {e.kind === "push" ? (
              <ArrowUp className="mt-0.5 h-3 w-3 flex-none text-brand" />
            ) : (
              <GitCommit className="mt-0.5 h-3 w-3 flex-none text-muted-foreground" />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-[11px] leading-snug text-foreground">{e.msg}</p>
              <p className="mono text-[10px] text-muted-foreground">{e.who} · just now</p>
            </div>
          </div>
        ))}
        <div className="flex items-center gap-1.5 border-t border-border pt-2.5">
          <span className="h-1.5 w-1.5 rounded-full bg-brand" />
          <span className="mono text-[10px] text-muted-foreground">synced peer-to-peer</span>
        </div>
      </div>
    </Window>
  );
}

export default function HeroStage() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [beat, setBeat] = useState(0);
  const [live, setLive] = useState(false); // only run the script while on screen

  // pause the loop whenever the stage is scrolled out of view, so an idle tab
  // isn't re-rendering the table forever
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!live) return;
    const id = setTimeout(() => setBeat((b) => (b + 1) % BEATS.length), BEATS[beat].ms);
    return () => clearTimeout(id);
  }, [beat, live]);

  const b = BEATS[beat];

  return (
    <div ref={ref} className="mx-auto w-full max-w-lg">
      {/* live badge, floating above the device row */}
      <div className="flex justify-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3.5 py-1.5 text-[12px] text-foreground shadow-xs">
          <span className="h-1.5 w-1.5 animate-blink rounded-full bg-brand" />
          Live workspace — synced <span className="text-violet">peer-to-peer</span>
        </span>
      </div>

      {/* the real Mochi table, live data */}
      <div className="mt-2">
        <ProductPreview chrome rows={b.rows} highlight={b.hi} filterLabel={b.filter} writing={b.writing} />
      </div>

      {/* three views into the same demo — chat drives the terminal drives the table */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <ChatWindow msgs={CHAT.slice(0, b.chat)} />
        <TerminalWindow lines={TERM[b.term]} />
        <ActivityWindow count={b.act} />
      </div>
    </div>
  );
}
