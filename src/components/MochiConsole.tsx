"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "./LanguageProvider";
import { ClaudeMessage, ClaudePanel, splitReply, type Msg } from "./appui";

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

function toMessages(line: Line): Msg[] {
  if (line.who === "you") return [{ who: "you", text: line.text }];
  return splitReply(line.text);
}

// Rough, deterministic "tokens burned" readout under each finished agent turn,
// the same idea as the usage line Claude's own UI shows. Derived from the reply
// length so it varies per message without needing per-locale data in every one
// of the 7 translated scripts.
const estimateTokens = (text: string) => Math.max(120, Math.round(text.length * 2.4));
const estimateSecs = (text: string) => Math.max(0.4, Math.round((text.length / 240) * 10) / 10);

function Pipeline({ stage }: { stage: number }) {
  return (
    <div
      className="flex-none rounded-[8px] border px-2.5 py-2"
      style={{ borderColor: "var(--cl-line)", background: "var(--cl-field)" }}
    >
      <div className="flex items-center">
        {STAGES.map((s, i) => {
          const done = i < stage;
          const active = i === stage;
          return (
            <div key={s} className="flex flex-1 items-center">
              {/* The dot is state, not a label: a numeral at this size is
                  unreadable and would be text failing contrast for no gain. */}
              <div className="flex flex-col items-center gap-1">
                <span
                  className={`h-2.5 w-2.5 flex-none rounded-full transition-colors duration-300 ${
                    active ? "animate-pulse" : ""
                  }`}
                  style={{ background: active || done ? "var(--cl-accent)" : "var(--cl-line)" }}
                  aria-hidden
                />
                <span
                  className="mono text-[10px]"
                  style={{ color: active || done ? "var(--cl-text)" : "var(--cl-muted)" }}
                >
                  {s}
                </span>
              </div>
              {i < STAGES.length - 1 && (
                <div className="mx-1 h-px flex-1" style={{ background: "var(--cl-line)" }}>
                  <div
                    className="h-full transition-all duration-300"
                    style={{ background: "var(--cl-accent)", width: i < stage ? "100%" : 0 }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function MochiConsole({
  customScript,
  heightClass = "h-[168px]",
  consoleId,
  initialDelay = 0,
  fullWidth = false,
  floating = false,
  agentLabel,
  status,
}: {
  customScript?: Line[];
  heightClass?: string;
  consoleId?: string;
  initialDelay?: number;
  fullWidth?: boolean;
  /** dock this console inside a workspace window, on the given side */
  floating?: false | "left" | "right";
  agentLabel?: string;
  status?: string;
}) {
  const { m } = useLang();
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
  }, [consoleId, customScript, initialDelay]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [history, partial, processing]);

  // A "you" line is still being typed into the composer; an agent line is
  // already streaming into the transcript.
  const composing = typing?.who === "you" ? partial : "";
  const streaming = typing?.who === "mochi" ? { ...typing, text: partial } : null;

  const panel = (
    <ClaudePanel
      agent={agentLabel ?? m.heroDemo.agent}
      placeholder={m.heroDemo.placeholder}
      draft={composing}
      scrollRef={scrollRef}
      bodyClass={heightClass}
      floating={floating}
      status={processing ? "working" : status ?? "MCP"}
    >
        {history.map((line, i) => (
          <div key={i} className="flex flex-none flex-col gap-1.5">
            {toMessages(line).map((msg, j) => (
              <ClaudeMessage key={j} msg={msg} />
            ))}
            {line.who === "mochi" && (
              <p className="mono pl-[22px] text-[10px]" style={{ color: "var(--cl-muted)" }}>
                {estimateSecs(line.text)}s &#8595; {estimateTokens(line.text).toLocaleString("en-US")} tokens
              </p>
            )}
          </div>
        ))}
        {processing && <Pipeline stage={stage} />}
        {streaming &&
          toMessages(streaming).map((msg, j, arr) => (
            <ClaudeMessage key={j} msg={msg} caret={j === arr.length - 1} />
          ))}
    </ClaudePanel>
  );

  if (floating) return panel;
  return <div className={fullWidth ? "w-full" : "mx-auto w-full max-w-xl"}>{panel}</div>;
}
