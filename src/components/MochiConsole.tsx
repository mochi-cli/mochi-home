"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";

type Who = "you" | "mochi";
export interface Line {
  who: Who;
  text: string;
  process?: boolean;
  id?: string;
}

const DEFAULT_SCRIPT: Line[] = [
  { who: "you", text: 'add customer "Acme" to crm' },
  { who: "mochi", text: "record #A-102 · Acme Inc created ✓", process: true },
  { who: "you", text: "any new customers this week?" },
  { who: "mochi", text: "found 12 new customers in 'crm'", process: true },
  { who: "you", text: "commit to git" },
  { who: "mochi", text: "bundle exported → workspace/crm ✓", process: true },
];

const STAGES = ["INIT", "QUERY", "WRITE", "COMMIT"];

export default function MochiConsole({ customScript, heightClass = "h-[168px]", consoleId, initialDelay = 0, fullWidth = false }: { customScript?: Line[], heightClass?: string, consoleId?: string, initialDelay?: number, fullWidth?: boolean }) {
  const [history, setHistory] = useState<Line[]>([]);
  const [typing, setTyping] = useState<Line | null>(null);
  const [partial, setPartial] = useState("");
  const [stage, setStage] = useState(-1); // -1 = idle, 0..3 processing
  const [processing, setProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    const typeOut = async (line: Line) => {
      setTyping(line);
      setPartial("");
      for (let i = 1; i <= line.text.length; i++) {
        if (cancelled) return;
        setPartial(line.text.slice(0, i));
        await sleep(line.who === "mochi" ? (line.text.length > 100 ? 5 : 26) : 34);
      }
    };

    const run = async () => {
      if (initialDelay > 0) await sleep(initialDelay);
      const activeScript = customScript || DEFAULT_SCRIPT;
      while (!cancelled) {
        if (consoleId) {
          window.dispatchEvent(new CustomEvent(`mochi-reset-${consoleId}`));
        }
        setHistory([]);
        setTyping(null);
        setPartial("");
        for (const line of activeScript) {
          if (cancelled) return;
          if (line.process) {
            setProcessing(true);
            for (let s = 0; s < STAGES.length; s++) {
              if (cancelled) return;
              setStage(s);
              await sleep(800);
            }
            setStage(-1);
            setProcessing(false);
          }
          await typeOut(line);
          if (cancelled) return;
          if (line.who === "you") {
            await sleep(200);
          }
          setHistory((h) => [...h, line].slice(-20));
          setTyping(null);
          setPartial("");

          if (consoleId && line.id) {
            window.dispatchEvent(new CustomEvent(`mochi-action-${consoleId}`, { detail: line.id }));
          }

          await sleep(line.process ? 900 : 550);
        }
        await sleep(5000);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [consoleId, customScript]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [history, partial, processing]);

  return (
    <div className={`w-full overflow-hidden rounded-2xl border border-border bg-card text-left shadow-[var(--shadow-card)] ${fullWidth ? "" : "mx-auto max-w-xl"}`}>
      {/* title bar */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <span className="text-xs font-semibold text-foreground">Mochi</span>
        </div>
        <span
          className={`mono flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors ${
            processing ? "bg-secondary text-muted-foreground" : "bg-brand-soft text-brand-soft-foreground"
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${processing ? "bg-muted-foreground animate-pulse" : "bg-brand"}`} />
          {processing ? "Processing" : "Live"}
        </span>
      </div>

      {/* conversation */}
      <div ref={scrollRef} className={`${heightClass} space-y-2 overflow-y-auto overflow-x-hidden px-4 py-4 scroll-smooth`}>
        {history.map((l, i) => (
          <Bubble key={i} line={l} />
        ))}
        {processing && <Pipeline stage={stage} />}
        {typing?.who === "mochi" && <Bubble line={{ ...typing, text: partial }} caret />}
      </div>

      {/* input bar */}
      <div className="flex items-center gap-2 border-t border-border bg-secondary/40 px-4 py-3">
        <span className="mono text-sm text-muted-foreground mt-0.5 self-start">›</span>
        <span className={`mono text-sm flex-1 leading-snug ${typing?.who === "you" ? "text-foreground" : "text-muted-foreground"}`}>
          {typing?.who === "you" ? (
            <>
              {partial}
              <span className="animate-cursor ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-current align-middle" />
            </>
          ) : (
            "talk to mochi…"
          )}
        </span>
        <span className={`ml-auto mono text-[10px] self-end transition-colors ${typing?.who === "you" ? "text-foreground" : "text-muted-foreground"}`}>
          ENTER ⏎
        </span>
      </div>
    </div>
  );
}

function Cursor() {
  return <span className="animate-cursor ml-0.5 inline-block h-4 w-1.5 translate-y-0.5 bg-current align-middle" />;
}

// Rough, deterministic "tokens burned" readout under each finished agent
// turn — same idea as the usage line Claude/Codex's own UIs show. Derived
// from the reply length so it varies per message without needing per-locale
// data in every one of the 7 translated scripts.
const estimateTokens = (text: string) => Math.max(120, Math.round(text.length * 2.4));
const estimateSecs = (text: string) => Math.max(0.4, Math.round((text.length / 240) * 10) / 10);

// Chat layout takes a light cue from Claude's own UI — a plain-text reply
// with a small mark beside it, rather than a filled bubble — since this
// panel is literally demonstrating "chat with Claude, Codex & OpenCode".
function Bubble({ line, caret }: { line: Line; caret?: boolean }) {
  if (line.who === "you") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl bg-secondary px-4 py-2.5 text-[13.5px] leading-relaxed text-foreground">
          {line.text}
          {caret && <Cursor />}
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-foreground text-background">
        <Sparkles className="h-3.5 w-3.5" />
      </span>
      <div className="max-w-[85%] min-w-0">
        <p className="whitespace-pre-wrap pt-0.5 text-[13.5px] leading-relaxed text-foreground">
          {line.text}
          {caret && <Cursor />}
        </p>
        {!caret && (
          <p className="mono mt-1 text-[10px] text-muted-foreground/70">
            {estimateSecs(line.text)}s · ↓ {estimateTokens(line.text).toLocaleString("en-US")} tokens
          </p>
        )}
      </div>
    </div>
  );
}

function Pipeline({ stage }: { stage: number }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/40 px-3 py-2.5">
      <div className="mb-2 flex items-center justify-between">
        <span className="mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Workflow</span>
        <span className="mono animate-blink text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Running…</span>
      </div>

      <div className="flex items-center">
        {STAGES.map((s, i) => {
          const done = i < stage;
          const active = i === stage;
          return (
            <div key={s} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1">
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded-full text-[7px] transition-colors duration-300 ${
                    active
                      ? "bg-foreground text-background"
                      : done
                        ? "bg-brand text-white"
                        : "bg-border text-muted-foreground"
                  }`}
                >
                  {done ? "✓" : i + 1}
                </span>
                <span className={`mono text-[9px] ${active ? "text-foreground" : done ? "text-brand-soft-foreground" : "text-muted-foreground"}`}>{s}</span>
              </div>
              {i < STAGES.length - 1 && (
                <div className="mx-1 h-px flex-1 overflow-hidden rounded-full bg-border">
                  <div className={`h-full bg-brand transition-all duration-300 ${i < stage ? "w-full" : "w-0"}`} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
