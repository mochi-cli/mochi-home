/* The film, as data. Every scene derives its state from one clock, so a cut is
   nothing but a different list of durations: shortening a scene speeds up what
   happens inside it rather than truncating it. */

export type SceneId = "ask" | "build" | "covers" | "history" | "numbers" | "limits" | "logo";

export interface Scene {
  id: SceneId;
  dur: number;
  /** the line that reads under the picture while this scene plays */
  caption?: string;
}

/** The long cut: the whole argument, for a home page or a send-out. */
export const LONG: Scene[] = [
  { id: "ask", dur: 6500, caption: "Ask for a workspace the way you would ask a colleague." },
  { id: "build", dur: 7500, caption: "It writes into your table. Not into a chat window." },
  { id: "covers", dur: 8000, caption: "Every cell it touches is a real cell you can edit." },
  { id: "history", dur: 7000, caption: "Every change is signed. Every change goes back." },
  { id: "numbers", dur: 8000, caption: "Measured on a table of 10,000 rows." },
  { id: "limits", dur: 6500, caption: "It does what you asked, and nothing else." },
  { id: "logo", dur: 5000 },
];

/** The short cut: the same footage with the argument cut to the demo. */
export const SHORT: Scene[] = [
  { id: "ask", dur: 4200, caption: "Ask for a workspace." },
  { id: "build", dur: 4500, caption: "It writes into your table." },
  { id: "covers", dur: 4800, caption: "Real cells. Not a chat window." },
  { id: "numbers", dur: 4000, caption: "10,000 rows. Still instant." },
  { id: "logo", dur: 3000 },
];

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

export const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

/** Progress across a window of the scene, as 0 → 1. */
export const seg = (p: number, from: number, to: number) => clamp01((p - from) / (to - from));

/** Ease so movement starts and stops rather than cutting on and off. */
export const ease = (n: number) => (n < 0.5 ? 2 * n * n : 1 - (-2 * n + 2) ** 2 / 2);

/** A string revealed one character at a time. */
export const typed = (text: string, p: number) => text.slice(0, Math.round(clamp01(p) * text.length));
