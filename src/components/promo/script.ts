/* The film, as data. Every scene derives its state from one clock, so a cut is
   nothing but a different list of durations: shortening a scene speeds up what
   happens inside it rather than truncating it.

   The shape is borrowed deliberately. A claim before any product, a logo, one
   establishing shot, then blocks that all run the same way — chapter card, real
   interface, a typed request, the result, and one beat of a person editing by
   hand — closing on how you get it rather than on what it does. The repetition
   is the point: it turns a long film into several short ones. */

export type SceneId =
  | "claim"
  | "chapter"
  | "overview"
  | "ask"
  | "build"
  | "edit"
  | "covers"
  | "handoff"
  | "history"
  | "undo"
  | "git"
  | "numbers"
  | "coldstart"
  | "search"
  | "compare"
  | "limits"
  | "pricing"
  | "logo";

export interface Scene {
  id: SceneId;
  dur: number;
  /** the line that reads under the picture while this scene plays */
  caption?: string;
  /** the words on a card: the claim, a chapter name */
  title?: string;
}

const card = (title: string, dur = 5000): Scene => ({ id: "chapter", dur, title });

/** The full cut: five minutes, five blocks, every claim shown rather than said. */
export const FILM: Scene[] = [
  { id: "claim", dur: 4500, title: "Your team's data, in a file your AI can actually work in." },
  { id: "logo", dur: 3500 },
  { id: "overview", dur: 7000 },

  card("Tables", 3500),
  { id: "ask", dur: 9000, caption: "Ask for a workspace the way you would ask a colleague." },
  { id: "build", dur: 6500, caption: "It writes into your table. Not into a chat window." },
  { id: "edit", dur: 12000, caption: "And it is still your table. Type in it." },

  card("Any agent, the same file", 3500),
  { id: "covers", dur: 11000, caption: "One sentence. One column. Twelve rows." },
  { id: "handoff", dur: 16000, caption: "Claude, Codex, OpenCode. Nothing moves." },

  card("Nothing happens anonymously", 3500),
  { id: "history", dur: 9000, caption: "Every change is signed with who made it." },
  { id: "undo", dur: 8000, caption: "And every change goes back." },
  { id: "git", dur: 11000, caption: "Underneath it is git. The history is yours." },

  card("Small enough to forget it is running", 3500),
  { id: "numbers", dur: 8000, caption: "Measured on a table of 10,000 rows." },
  { id: "coldstart", dur: 7000, caption: "Open it before you finish reaching for it." },
  { id: "search", dur: 6000, caption: "Search ten thousand rows in a millisecond." },

  card("It stops paying to look around", 3500),
  { id: "compare", dur: 10000, caption: "It asks for the rows it needs, not for the table." },
  { id: "limits", dur: 11000, caption: "It does what you asked, and nothing else." },

  { id: "pricing", dur: 9000 },
  { id: "logo", dur: 14000 },
];

/** The trailer: the same footage, cut to the three strongest blocks. */
export const LONG: Scene[] = [
  { id: "claim", dur: 5000, title: "Your team's data, in a file your AI can actually work in." },
  { id: "logo", dur: 4000 },
  card("Tables", 4000),
  { id: "ask", dur: 8000, caption: "Ask for a workspace the way you would ask a colleague." },
  { id: "build", dur: 7000, caption: "It writes into your table. Not into a chat window." },
  { id: "edit", dur: 8000, caption: "And it is still your table." },
  card("Nothing happens anonymously", 4000),
  { id: "history", dur: 8000, caption: "Every change is signed." },
  { id: "undo", dur: 8000, caption: "And every change goes back." },
  card("Small enough to forget it is running", 4000),
  { id: "numbers", dur: 9000, caption: "Measured on a table of 10,000 rows." },
  { id: "pricing", dur: 8000 },
  { id: "logo", dur: 13000 },
];

/** The social cut: straight to the demo. */
export const SHORT: Scene[] = [
  { id: "claim", dur: 3000, title: "Your data, in a file your AI can work in." },
  { id: "ask", dur: 4200, caption: "Ask for a workspace." },
  { id: "build", dur: 4500, caption: "It writes into your table." },
  { id: "covers", dur: 4800, caption: "Real cells. Not a chat window." },
  { id: "numbers", dur: 4000, caption: "10,000 rows. Still instant." },
  { id: "logo", dur: 3000 },
];

export const CUTS = { film: FILM, long: LONG, short: SHORT };
export type CutName = keyof typeof CUTS;

export interface Cue {
  scene: Scene;
  /** where this scene sits on the master clock */
  start: number;
  /** 0 → 1 through the scene */
  p: number;
  index: number;
}

export const runtime = (cut: Scene[]) => cut.reduce((n, s) => n + s.dur, 0);

/** Which scene the clock is in, and how far through it. Past the end it holds
 *  on the last frame rather than snapping back, so a recording can be stopped
 *  without catching a flash of the first scene. */
export function cueAt(cut: Scene[], t: number): Cue {
  let start = 0;
  for (let i = 0; i < cut.length; i++) {
    const s = cut[i];
    if (t < start + s.dur || i === cut.length - 1) {
      return { scene: s, start, p: Math.max(0, Math.min(1, (t - start) / s.dur)), index: i };
    }
    start += s.dur;
  }
  throw new Error("unreachable: a cut always has a last scene");
}

/** Whether the agent driving the demo has been handed over yet. Once a scene
 *  has passed the hand-off the panel stays with the agent it was given to:
 *  swapping back would undo the very thing that scene demonstrates. */
export function skinAt(cut: Scene[], index: number, p: number): "claude" | "codex" {
  const handoff = cut.findIndex((s) => s.id === "handoff");
  if (handoff === -1) return "claude";
  if (index > handoff) return "codex";
  if (index === handoff && p > 0.42) return "codex";
  return "claude";
}

export const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

/** Progress across a window of the scene, as 0 → 1. */
export const seg = (p: number, from: number, to: number) => clamp01((p - from) / (to - from));

/** Ease so movement starts and stops rather than cutting on and off. */
export const ease = (n: number) => (n < 0.5 ? 2 * n * n : 1 - (-2 * n + 2) ** 2 / 2);

/** A string revealed one character at a time. */
export const typed = (text: string, p: number) => text.slice(0, Math.round(clamp01(p) * text.length));
