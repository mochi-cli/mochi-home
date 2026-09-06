# The promo film

`/promo` is a self-playing film built from the real product surfaces — the same
grid, the same agent panel, the same dock and the same mark the site uses. It is
not linked from anywhere and is marked `noindex`: it exists to be pointed a
screen recorder at.

There is no video file in this repo. You record one.

## Recording a take

1. Size the browser window so the viewport is exactly **1920 × 1080**. The stage
   is a fixed 1920 × 1080 box scaled to fit, so at that size the scale is exactly
   1 and the type records as sharp as the page it came from. Anything smaller
   still works, it just records smaller.
2. Open the cut you want:
   - long, about **48.5 s** — `http://localhost:3000/promo`
   - short, about **20.5 s** — `http://localhost:3000/promo?cut=short`
3. Add `&theme=light` (or `dark`) to pin the look. Without it the film follows
   the machine's own setting, so a laptop in dark mode shoots a dark film.
4. Press **R** to restart, then take your hand off the mouse. The control bar
   fades out after 2.2 s of stillness and is not part of the picture.
5. Record the window. Stop after the logo — the film holds on the last frame
   rather than snapping back, so there is nothing to trim off the end.

### The rest of the switches

| | |
|---|---|
| `?cut=short` | the 20.5 s cut |
| `?loop=1` | run it again from the top, for a screen at a stand |
| `?t=33&paused=1` | hold one frame at 33 s — for a poster or a thumbnail |
| `?theme=light` / `?theme=dark` | pin the look regardless of the machine |

Space plays and pauses. R restarts.

## What is in it

Every number spoken or shown is a reading from the app's own benchmark run over
a table of 10,000 rows and 6 columns. Nothing here is invented for the ad.

| scene | long cut | short cut |
|---|---|---|
| the ask — an empty workspace, the prompt typed in | 0.0 – 6.5 | 0.0 – 4.2 |
| it builds — collections appear, rows land in groups | 6.5 – 14.0 | 4.2 – 8.7 |
| covers — a second ask, a whole column filled | 14.0 – 22.0 | 8.7 – 13.5 |
| history — who changed what, and that it goes back | 22.0 – 29.0 | — |
| the numbers — 0.3 s, 1 ms, 14 ms, 0 | 29.0 – 37.0 | 13.5 – 17.5 |
| the limits — what it deliberately does not do | 37.0 – 43.5 | — |
| logo | 43.5 – 48.5 | 17.5 – 20.5 |

## Voiceover, long cut

The film is built to play silent with the on-screen lines carrying it. If you
add a voice, these are written to sit inside the picture rather than describe
it, and the timings leave the on-screen line a beat to itself.

| in | out | line |
|---|---|---|
| 0.5 | 6.0 | An empty workspace. Ask for what you need, the way you would ask a colleague. |
| 7.0 | 13.5 | It writes the answer into your table. Not into a chat window you have to copy out of. |
| 14.5 | 21.5 | Ask for more. Every cell it touches is a real cell you can edit. |
| 22.5 | 28.5 | Every change is signed with who made it, and every change goes back. |
| 29.5 | 36.5 | It is fast because it is small. Ten thousand rows, and an edit still lands in a millisecond. |
| 37.5 | 43.0 | No telemetry. No account to open a file. It does what you asked, and nothing else. |
| 44.0 | 48.0 | Mochi. One place for all your team's work. |

## Voiceover, short cut

| in | out | line |
|---|---|---|
| 0.3 | 4.0 | An empty workspace. Ask for what you need. |
| 4.5 | 8.5 | It writes into your table, not into a chat window. |
| 9.0 | 13.2 | Every cell it touches is a real cell you can edit. |
| 13.8 | 17.2 | Ten thousand rows. An edit still lands in a millisecond. |
| 17.8 | 20.3 | Mochi. One place for all your team's work. |

## Changing it

`src/components/promo/script.ts` is the film as data: a cut is a list of scenes
and durations, and shortening a scene speeds up what happens inside it rather
than cutting it off, because every scene draws itself from its own progress
rather than from a timer. Adding a third cut is adding a third array.

`scenes.tsx` holds the pictures, `PromoFilm.tsx` the clock and the staging.
