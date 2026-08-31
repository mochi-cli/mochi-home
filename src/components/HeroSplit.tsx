"use client";

/**
 * PROTOTYPE — creative hero concept.
 *
 * One grid of the same five rows, rendered twice: a tired spreadsheet on the
 * left, the Mochi workspace on the right, with a wipe handle between them. Both
 * layers share the exact same row and column geometry, so any wipe position
 * lines up cell-for-cell — only the styling changes. A teammate cursor drifts
 * over the Mochi side to stand in for peer-to-peer collaboration.
 *
 * Not wired into the live page. View at /hero-preview.
 */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Check, Copy, MoveHorizontal } from "lucide-react";
import { DEALS } from "./ProductPreview";
import { copyText } from "@/lib/copy";

const INSTALL = "npx --yes github:mochi-cli/mochi#main install claude-code";
const fmtUSD = (n: number) => `$${n.toLocaleString("en-US")}`;
const initials = (name: string) =>
  name.split(" ").map((p) => p[0]).slice(0, 2).join("");

// shared geometry — both layers use these exact values so the wipe aligns
const TOOLBAR_H = 38;
const HEAD_H = 36;
const ROW_H = 46;
// mobile drops the Owner column; both layers hide it the same way so the grid stays aligned
const GRID = "grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,0.9fr)] sm:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)_minmax(0,1.35fr)_minmax(0,0.8fr)]";
const OWNER_CELL = "hidden sm:flex";
const HEADERS = ["Company", "Stage", "Owner", "Value"];

/* ── left layer: the spreadsheet you already have ─────────────────────────── */
function SheetLayer() {
  return (
    <div className="absolute inset-0 select-none bg-white font-[Calibri,'Segoe_UI',Arial,sans-serif] text-[13px] text-[#1f2937]">
      <div
        className="flex items-center gap-2 border-b border-[#cfcfcf] bg-[#f3f3f3] px-3 text-[11px] text-[#6b7280]"
        style={{ height: TOOLBAR_H }}
      >
        <span className="font-semibold text-[#217346]">X</span>
        <span className="truncate">deals.xlsx</span>
        <span className="ml-auto text-[#9ca3af]">Sheet1</span>
      </div>
      <div
        className={`${GRID} border-b border-[#cfcfcf] bg-[#eef1ee] font-semibold text-[#4b5563]`}
        style={{ height: HEAD_H }}
      >
        {HEADERS.map((h, i) => (
          <div
            key={h}
            className={`flex items-center border-r border-[#cfcfcf] px-2.5 ${i === 2 ? OWNER_CELL : ""} ${i === 3 ? "justify-end" : ""}`}
          >
            {h}
          </div>
        ))}
      </div>
      {DEALS.map((d, i) => (
        <div
          key={d.company}
          className={`${GRID} border-b border-[#dcdcdc]`}
          style={{ height: ROW_H, background: i % 2 ? "#fafafa" : "#ffffff" }}
        >
          {[d.company, d.stage, d.owner, fmtUSD(d.value)].map((v, c) => (
            <div
              key={c}
              className={`flex items-center overflow-hidden whitespace-nowrap border-r border-[#dcdcdc] px-2.5 ${
                c === 2 ? OWNER_CELL : ""
              } ${i === 3 && c === 1 ? "bg-[#d5eade] outline outline-2 -outline-offset-2 outline-[#217346]" : ""} ${
                c === 3 ? "justify-end tabular-nums" : ""
              }`}
            >
              {v}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ── right layer: the same rows, in Mochi ─────────────────────────────────── */
function MochiLayer() {
  return (
    <div className="absolute inset-0 select-none bg-card text-foreground">
      <div
        className="flex items-center gap-2 border-b border-border bg-secondary/60 px-3 text-[11px] text-muted-foreground"
        style={{ height: TOOLBAR_H }}
      >
        <span className="flex h-4 w-4 items-center justify-center rounded bg-brand-soft text-[9px] font-bold text-brand-soft-foreground">D</span>
        <span className="font-medium text-foreground">Deals</span>
        <span className="ml-auto flex items-center gap-1 text-[10px]">
          <span className="h-1.5 w-1.5 rounded-full bg-brand" />
          synced
        </span>
      </div>
      <div
        className={`${GRID} items-center border-b border-border bg-secondary/25 text-[10px] font-medium uppercase tracking-wide text-muted-foreground`}
        style={{ height: HEAD_H }}
      >
        {HEADERS.map((h, i) => (
          <span key={h} className={`px-3 ${i === 2 ? OWNER_CELL : ""} ${i === 3 ? "text-right" : ""}`}>
            {h}
          </span>
        ))}
      </div>
      {DEALS.map((d) => (
        <div
          key={d.company}
          className={`${GRID} items-center border-b border-border/70 text-[12.5px]`}
          style={{ height: ROW_H }}
        >
          <span className="truncate px-3 font-medium text-foreground">{d.company}</span>
          <span className="px-3">
            <span
              className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10.5px] font-medium"
              style={{ borderColor: STAGE_TONE[d.stage].bd, background: STAGE_TONE[d.stage].bg, color: STAGE_TONE[d.stage].fg }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: STAGE_TONE[d.stage].fg }} />
              {d.stage}
            </span>
          </span>
          <span className={`${OWNER_CELL} items-center gap-2 px-3 text-muted-foreground`}>
            <span
              className="flex h-6 w-6 flex-none items-center justify-center rounded-full text-[9px] font-semibold text-white"
              style={{ background: AVATAR_TONE[initials(d.owner).charCodeAt(0) % AVATAR_TONE.length] }}
            >
              {initials(d.owner)}
            </span>
            <span className="truncate text-foreground">{d.owner}</span>
          </span>
          <span className="mono px-3 text-right text-[13px] font-semibold tabular-nums text-foreground">
            {fmtUSD(d.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

const STAGE_TONE: Record<string, { bg: string; fg: string; bd: string }> = {
  Discovery: { bg: "#eef2ff", fg: "#4f46e5", bd: "#c7d2fe" },
  Negotiation: { bg: "#fff7ed", fg: "#c2410c", bd: "#fed7aa" },
  "Closed won": { bg: "#ecfdf3", fg: "#047857", bd: "#a7f3d0" },
};
const AVATAR_TONE = ["#6d5ef8", "#0ea5e9", "#f59e0b", "#ef4444", "#10b981"];

/* ── the teammate cursor drifting over the Mochi side ─────────────────────── */
function PeerCursor() {
  return (
    <div className="peer-cursor pointer-events-none absolute left-[52%] top-[74px] z-20 hidden sm:block motion-reduce:hidden">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M2 2L14.5 8.5L8.7 9.8L6.2 15.5L2 2Z" fill="#6d5ef8" stroke="white" strokeWidth="1.3" />
      </svg>
      <span className="ml-2 -mt-1 inline-block whitespace-nowrap rounded-md bg-[#6d5ef8] px-1.5 py-0.5 text-[10px] font-medium text-white">
        Priya
      </span>
    </div>
  );
}

export default function HeroSplit() {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const touched = useRef(false);
  const [copied, setCopied] = useState(false);

  const setSplit = useCallback((pct: number) => {
    const el = trackRef.current;
    if (!el) return;
    const clamped = Math.max(6, Math.min(94, pct));
    el.style.setProperty("--x", `${clamped}%`);
    el.setAttribute("aria-valuenow", String(Math.round(clamped)));
  }, []);

  const fromClientX = useCallback(
    (clientX: number) => {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setSplit(((clientX - rect.left) / rect.width) * 100);
    },
    [setSplit],
  );

  const onPointerDown = (e: ReactPointerEvent) => {
    dragging.current = true;
    touched.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    fromClientX(e.clientX);
  };
  const onPointerMove = (e: ReactPointerEvent) => {
    if (dragging.current) fromClientX(e.clientX);
  };
  const stopDrag = () => {
    dragging.current = false;
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    const cur = Number(trackRef.current?.style.getPropertyValue("--x").replace("%", "") || 50);
    if (e.key === "ArrowLeft") { touched.current = true; setSplit(cur - 4); }
    if (e.key === "ArrowRight") { touched.current = true; setSplit(cur + 4); }
  };

  // idle nudge: sweep the handle a couple of times on load so it reads as
  // draggable, then rest at centre. Stops the moment the user grabs it, and
  // never runs under reduced motion.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSplit(44);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const DURATION = 3800;
    const tick = (now: number) => {
      if (touched.current) return;
      const t = (now - start) / DURATION;
      if (t >= 1) { setSplit(44); return; }
      setSplit(44 + Math.sin(t * Math.PI * 2) * 12);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [setSplit]);

  const copy = async () => {
    if (!(await copyText(INSTALL))) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const trackH = TOOLBAR_H + HEAD_H + ROW_H * DEALS.length;

  return (
    <section className="bg-hero-wash relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-[1fr_1.05fr] lg:py-24">
        {/* pitch */}
        <div className="text-center lg:text-left">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3.5 py-1.5 text-[13px] shadow-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            Local-first · agent-native
          </span>
          <h1 className="mx-auto mt-6 max-w-xl text-balance text-[length:var(--text-hero)] font-semibold leading-[1.06] tracking-[-0.03em] lg:mx-0">
            The spreadsheet you have.{" "}
            <span className="text-violet">The workspace you want.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-md text-[17px] leading-[1.55] text-muted-foreground lg:mx-0">
            Same rows, no migration. Mochi gives your data a schema, a full
            history, and an agent, and still runs on your laptop.
          </p>

          <div className="mt-8 flex justify-center lg:justify-start">
            <div className="flex w-full items-center gap-3 rounded-xl border border-border bg-card py-2 pl-4 pr-2 shadow-sm sm:w-auto">
              <code className="mono min-w-0 flex-1 whitespace-pre-wrap break-all text-[13px] sm:flex-none sm:whitespace-nowrap sm:break-normal sm:text-[14px]">
                <span className="mr-1.5 select-none text-muted-foreground">$</span>
                {INSTALL}
              </code>
              <button
                onClick={copy}
                aria-label="Copy install command"
                className="flex h-8 w-8 flex-none items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {copied ? <Check className="h-4 w-4 text-brand" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* the wipe */}
        <div>
          <div
            ref={trackRef}
            role="slider"
            tabIndex={0}
            aria-label="Drag to compare a spreadsheet with Mochi"
            aria-valuemin={6}
            aria-valuemax={94}
            aria-valuenow={44}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={stopDrag}
            onPointerCancel={stopDrag}
            onKeyDown={onKeyDown}
            style={{ ["--x" as string]: "44%", height: trackH }}
            className="relative w-full cursor-ew-resize touch-none overflow-hidden rounded-2xl border border-border bg-white shadow-[var(--shadow-window)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet"
          >
            <SheetLayer />
            <div
              className="absolute inset-0 shadow-[-14px_0_18px_-8px_rgba(255,255,255,0.9)]"
              style={{ clipPath: "inset(0 0 0 var(--x))" }}
            >
              <MochiLayer />
              <PeerCursor />
            </div>

            {/* divider + handle */}
            <div
              className="absolute inset-y-0 z-10 -ml-px w-0.5 bg-violet shadow-[0_0_0_1px_rgba(255,255,255,0.7)]"
              style={{ left: "var(--x)" }}
            >
              <span className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-violet/25 bg-white text-violet shadow-lg">
                <MoveHorizontal className="h-4 w-4" />
              </span>
            </div>
          </div>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-[12px] text-muted-foreground lg:justify-start">
            <MoveHorizontal className="h-3.5 w-3.5" />
            Drag the handle. Same five rows, both sides.
          </p>
        </div>
      </div>

      <style>{`
        .peer-cursor { animation: peer-path 8s ease-in-out infinite; }
        @keyframes peer-path {
          0%   { transform: translate(10px, 90px);  opacity: 0; }
          8%   { opacity: 1; }
          28%  { transform: translate(90px, 20px); }
          50%  { transform: translate(150px, 128px); }
          72%  { transform: translate(24px, 172px); }
          92%  { transform: translate(10px, 90px);  opacity: 1; }
          100% { transform: translate(10px, 90px);  opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .peer-cursor { animation: none; }
        }
      `}</style>
    </section>
  );
}
