"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ClaudeMessage, ClaudePanel, ToolCall, type Msg } from "../appui";
import MacDock from "../MacDock";
import { HistoryCard, Limits, Numbers, Workspace } from "./scenes";
import { LONG, SHORT, type Scene, type SceneId, cueAt, ease, runtime, seg, typed } from "./script";

/* The film. One clock, and every frame is a pure function of it: nothing here
   schedules itself, so scrubbing, restarting and pausing all fall out for free
   and a recording can be taken from any point without the picture drifting out
   of step with the transcript.

   The stage is a fixed 1920x1080 scaled to fit whatever window it is shown in.
   Record it with the window at 1920x1080 and the scale is exactly 1, so the
   type stays as sharp as the page it came from. */

const STAGE_W = 1920;
const STAGE_H = 1080;

const PROMPT_1 = "Set up a CRM for our store and fill in the product catalogue.";
const PROMPT_2 = "Generate a cover image for every product.";

/** The Claude transcript at a given moment. */
function transcript(id: SceneId, p: number): { msgs: Msg[]; draft: string } {
  const asked: Msg = { who: "you", text: PROMPT_1 };
  const built: Msg = { who: "claude", text: "mochi.create_collections", tool: { running: false, secs: 1.2 } };
  const said: Msg = { who: "claude", text: "Created 8 collections. Seeded 12 products across 3 groups." };

  if (id === "ask") {
    if (p < 0.54) return { msgs: [], draft: typed(PROMPT_1, seg(p, 0.06, 0.5)) };
    return {
      msgs: [asked, { who: "claude", text: "mochi.create_collections", tool: { running: p < 0.88, secs: 1.2 } }],
      draft: "",
    };
  }

  if (id === "build") {
    const reply = typed(said.text, seg(p, 0.3, 0.75));
    return { msgs: [asked, built, ...(reply ? [{ who: "claude" as const, text: reply }] : [])], draft: "" };
  }

  if (id === "covers") {
    if (p < 0.36) return { msgs: [asked, built, said], draft: typed(PROMPT_2, seg(p, 0.02, 0.32)) };
    return {
      msgs: [
        built,
        said,
        { who: "you", text: PROMPT_2 },
        { who: "claude", text: "mochi.generate_covers", tool: { running: p < 0.62, secs: 2.4 } },
      ],
      draft: "",
    };
  }

  // history
  const note = typed("Each one is written as me, so the row says who did it.", seg(p, 0.3, 0.8));
  return {
    msgs: [
      { who: "you", text: PROMPT_2 },
      { who: "claude", text: "mochi.generate_covers", tool: { running: false, secs: 2.4 } },
      ...(note ? [{ who: "claude" as const, text: note }] : []),
    ],
    draft: "",
  };
}

/** How much of the workspace has been built, at a given moment. */
function workspaceAt(id: SceneId, p: number) {
  if (id === "ask") return { tabs: Math.round(seg(p, 0.88, 1) * 8), rows: 0, covers: 0, flash: -1 };
  if (id === "build") return { tabs: 8, rows: Math.round(seg(p, 0.05, 0.78) * 12), covers: 0, flash: -1 };
  if (id === "covers") return { tabs: 8, rows: 12, covers: seg(p, 0.62, 0.96) * 12, flash: -1 };
  return { tabs: 8, rows: 12, covers: 12, flash: 1 };
}

const SHOWS_WORKSPACE: SceneId[] = ["ask", "build", "covers", "history"];

export default function PromoFilm({
  cut: cutName,
  loop,
  startAt = 0,
  paused = false,
  theme,
}: {
  cut: "short" | "long";
  loop: boolean;
  /** where to open the clock, in ms; with `paused` this holds one frame still */
  startAt?: number;
  paused?: boolean;
  /** pin the film's theme, so a machine in dark mode can still shoot a light cut */
  theme?: "light" | "dark";
}) {
  const cut: Scene[] = cutName === "short" ? SHORT : LONG;
  const total = runtime(cut);

  const [t, setT] = useState(startAt);
  const [playing, setPlaying] = useState(!paused);
  const [chrome, setChrome] = useState(true);
  const [scale, setScale] = useState(1);
  const startedAt = useRef(0);
  const offset = useRef(startAt);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!theme) return;
    const root = document.documentElement;
    const had = root.getAttribute("data-theme");
    root.setAttribute("data-theme", theme);
    return () => {
      if (had) root.setAttribute("data-theme", had);
      else root.removeAttribute("data-theme");
    };
  }, [theme]);

  // Fit the stage to the window. At exactly 1920x1080 this is 1, and the film
  // records pixel for pixel. Observed rather than measured once on a resize
  // event: a window can end up a different size than it was at mount without
  // ever firing one, and a stage measured against the wrong width stays wrong
  // for the whole take.
  useEffect(() => {
    const fit = () => setScale(Math.min(window.innerWidth / STAGE_W, window.innerHeight / STAGE_H));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(document.documentElement);
    window.addEventListener("resize", fit);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, []);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    startedAt.current = performance.now() - offset.current;
    const tick = (now: number) => {
      const next = now - startedAt.current;
      if (next >= total) {
        if (loop) {
          startedAt.current = now;
          offset.current = 0;
          setT(0);
        } else {
          offset.current = total;
          setT(total);
          setPlaying(false);
          return;
        }
      } else {
        offset.current = next;
        setT(next);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, total, loop]);

  const restart = useCallback(() => {
    offset.current = 0;
    // The running loop measures from this origin, so resetting the offset alone
    // is overwritten on the very next frame.
    startedAt.current = performance.now();
    setT(0);
    setPlaying(true);
  }, []);

  // The controls are for setting up a take, so they get out of the way on their
  // own: a still mouse means the recording has started.
  useEffect(() => {
    const wake = () => {
      setChrome(true);
      if (hideTimer.current) clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => setChrome(false), 2200);
    };
    wake();
    window.addEventListener("mousemove", wake);
    return () => {
      window.removeEventListener("mousemove", wake);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " ") { e.preventDefault(); setPlaying((v) => !v); }
      if (e.key.toLowerCase() === "r") restart();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [restart]);

  const { scene, p } = cueAt(cut, t);
  const id = scene.id;
  const onStage = SHOWS_WORKSPACE.includes(id);
  const { msgs, draft } = transcript(onStage ? id : "history", p);
  const { tabs, rows, covers, flash } = workspaceAt(id, p);

  // Scenes arrive and leave rather than cutting, except into the logo, which
  // lands on the beat.
  const inP = ease(seg(p, 0, 0.06));
  const outP = 1 - ease(seg(p, 0.94, 1));
  const fade = id === "logo" ? ease(seg(p, 0, 0.12)) : Math.min(inP, outP);

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-paper">
      <div
        className="relative flex-none bg-paper"
        style={{ width: STAGE_W, height: STAGE_H, transform: `scale(${scale})` }}
      >
        <div className="flex h-full flex-col items-center px-24 py-16">
          {id !== "logo" && (
            <div className="flex w-full flex-none items-center" style={{ opacity: fade }}>
              <span className="flex items-center gap-3">
                <Image src="/mark.svg" alt="" width={34} height={34} className="h-[34px] w-[34px]" aria-hidden />
                <span className="text-[26px] font-[520] tracking-[-0.02em] text-ink">Mochi</span>
              </span>
            </div>
          )}

          <div className="relative flex w-full flex-1 items-center justify-center">
            {onStage && (
              <div
                className="relative h-[640px] w-full"
                style={{ opacity: fade, transform: `translateY(${(1 - fade) * 10}px)` }}
              >
                <Workspace rows={rows} covers={covers} tabs={tabs} flash={flash} />

                <div className="absolute bottom-5 left-5 h-[320px] w-[400px]">
                  <ClaudePanel
                    agent="Claude"
                    placeholder="Ask Claude to change the table…"
                    draft={draft}
                    bodyClass="flex-1"
                  >
                    {msgs.map((msg, i) =>
                      msg.tool ? (
                        <ToolCall key={i} name={msg.text} running={msg.tool.running} secs={msg.tool.secs} />
                      ) : (
                        <ClaudeMessage key={i} msg={msg} caret={i === msgs.length - 1 && msg.who === "claude"} />
                      ),
                    )}
                  </ClaudePanel>
                </div>

                {id === "history" && <HistoryCard p={p} />}
              </div>
            )}

            {id === "numbers" && (
              <div className="w-full" style={{ opacity: fade }}>
                <Numbers p={p} />
              </div>
            )}

            {id === "limits" && (
              <div style={{ opacity: fade }}>
                <Limits p={p} />
              </div>
            )}

            {id === "logo" && (
              <div className="flex flex-col items-center" style={{ opacity: fade }}>
                <Image
                  src="/mark.svg"
                  alt=""
                  width={150}
                  height={150}
                  className="h-[150px] w-[150px]"
                  style={{ transform: `scale(${0.94 + 0.06 * ease(seg(p, 0, 0.3))})` }}
                  aria-hidden
                />
                <p className="mt-10 text-[100px] font-[380] leading-none tracking-[-0.03em] text-ink">Mochi</p>
                <p
                  className="mt-8 text-[34px] leading-snug text-ink-2"
                  style={{ opacity: ease(seg(p, 0.18, 0.42)) }}
                >
                  One place for all your team&rsquo;s work.
                </p>
                <p
                  className="mono mt-14 text-[26px] tracking-[0.02em] text-ink"
                  style={{ opacity: ease(seg(p, 0.34, 0.58)) }}
                >
                  mochi-cli.com
                </p>
              </div>
            )}
          </div>

          {/* The dock sets the scene for the application; it has no business
              under a band of numbers or a closing logo. */}
          {onStage && <MacDock className="mt-8 flex-none" />}

          <div className="mt-10 flex h-[104px] w-full flex-none items-start justify-center">
            {scene.caption && (
              <p
                className="max-w-[36ch] text-center text-[40px] font-[380] leading-tight tracking-[-0.025em] text-ink"
                style={{ opacity: Math.min(ease(seg(p, 0.06, 0.22)), 1 - ease(seg(p, 0.88, 1))) }}
              >
                {scene.caption}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Setup controls. Not part of the film: leave the mouse alone and they go. */}
      <div
        className="fixed bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-4 rounded-full border border-line bg-surface/95 px-5 py-2.5 text-[13px] text-ink-2 shadow-lg transition-opacity duration-300"
        style={{ opacity: chrome ? 1 : 0, pointerEvents: chrome ? "auto" : "none" }}
      >
        <button onClick={() => setPlaying((v) => !v)} className="text-ink">
          {playing ? "Pause" : "Play"}
        </button>
        <button onClick={restart} className="text-ink">Restart</button>
        <span className="mono tabular-nums">
          {(t / 1000).toFixed(1)}s / {(total / 1000).toFixed(1)}s
        </span>
        <span>·</span>
        <a href={`/promo?cut=${cutName === "short" ? "long" : "short"}`} className="text-ink underline-offset-4 hover:underline">
          {cutName === "short" ? "long cut" : "short cut"}
        </a>
        <span>·</span>
        <span>space = play, R = restart</span>
      </div>
    </div>
  );
}
