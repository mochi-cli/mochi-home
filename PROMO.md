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
   - the film, **3:00** — `http://localhost:3000/promo`
   - the trailer, **1:30** — `http://localhost:3000/promo?cut=long`
   - the social cut, **23 s** — `http://localhost:3000/promo?cut=short`
3. Add `&theme=light` (or `dark`) to pin the look. Without it the film follows
   the machine's own setting, so a laptop in dark mode shoots a dark film.
4. Press **R** to restart, then take your hand off the mouse. The control bar
   fades out after 2.2 s of stillness and is not part of the picture.
5. Record the window. Stop after the logo — the film holds on the last frame
   rather than snapping back, so there is nothing to trim off the end.

### The rest of the switches

| | |
|---|---|
| `?cut=long` | the 1:30 trailer |
| `?cut=short` | the 23 s social cut |
| `?loop=1` | run it again from the top, for a screen at a stand |
| `?t=33&paused=1` | hold one frame at 33 s — for a poster or a thumbnail |
| `?theme=light` / `?theme=dark` | pin the look regardless of the machine |

Space plays and pauses. R restarts.

## What is in it

The shape is borrowed on purpose, from an ad that works: a claim before any
product, a logo, one establishing shot, then blocks that all run identically —
chapter card, real interface, a typed request, the result, and one beat of a
person editing by hand — closing on how you get it rather than on what it does.
The repetition is what turns five minutes into five short films, and it is why
the same material cuts down without being rewritten.

Every number spoken or shown is a reading from the app's own benchmark run over
a table of 10,000 rows and 6 columns. Nothing here is invented for the ad.

| | film | trailer | social |
|---|---|---|---|
| the claim | 0:00 | 0:00 | 0:00 |
| logo | 0:04 | 0:05 | — |
| the workspace, established | 0:08 | — | — |
| **Tables** | 0:15 | 0:09 | — |
| an empty file, and the request typed into it | 0:18 | 0:13 | 0:03 |
| collections appear, rows land in groups | 0:27 | 0:21 | 0:07 |
| a person edits a cell by hand | 0:34 | 0:28 | — |
| **Any agent, the same file** | 0:46 | — | — |
| a second request fills a whole column | 0:49 | — | 0:12 |
| the dock hands the file to Codex mid-conversation | 1:00 | — | — |
| **Nothing happens anonymously** | 1:16 | 0:36 | — |
| the row history: who changed what | 1:20 | 0:40 | — |
| undo, and the value goes back | 1:29 | 0:48 | — |
| the same edits as commits, with the undo among them | 1:37 | — | — |
| **Small enough to forget it is running** | 1:48 | 0:56 | — |
| the four readings | 1:51 | 1:00 | 0:16 |
| cold start, on a stopwatch | 1:59 | — | — |
| search narrowing the grid | 2:06 | — | — |
| **It stops paying to look around** | 2:12 | — | — |
| a whole table into the conversation, against a summary of it | 2:16 | — | — |
| what it deliberately does not do | 2:26 | — | — |
| Free and Pro | 2:37 | 1:09 | — |
| logo | 2:46 | 1:17 | 0:20 |

The agent panel sits beside the grid at the same height, never over it. A panel
floating on top hides the rows it is talking about, which is the one thing this
film cannot afford to hide.

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

---

# Social and marketing images

`public/social/` holds the posters. They are a **build**, not artwork: the
source is `/api/poster`, and `scripts/posters.sh` writes the set out of a
running dev server. Reword a claim in `src/components/Poster.tsx`, run the
script, and every size is redrawn at once — there is no PNG to hand-edit and
no design file to keep in step.

```bash
npm run dev            # in another terminal
./scripts/posters.sh
```

| variant | says | sizes |
|---|---|---|
| `claim` | Your team's data, in a file your AI can actually work in. | og, x, square, story |
| `numbers` | Small enough to open. Quick enough to forget. | og, x, square, story |
| `agent` | It writes into your table. Not into a chat window. | og, x, square |
| `limits` | It does what you asked, and nothing else. | x, square |
| `pricing` | Free while it is just you. | x, square |

| size | pixels | for |
|---|---|---|
| `og` | 1200×630 | link previews, Facebook, Telegram |
| `x` | 1600×900 | X posts, blog headers, slides |
| `square` | 1080×1080 | Instagram, Threads, LinkedIn |
| `story` | 1080×1920 | Stories and Reels |

Preview any combination live at `/api/poster?v=numbers&s=story`.

The `agent` poster draws the product the way the film does — grid on the left,
agent beside it, never over it — using the app's real status colours, because
flattening them to the page's monochrome would misrepresent what the app looks
like. Every figure on the `numbers` poster is a reading from the benchmark run.

Two details worth knowing before editing `Poster.tsx`: it renders through
Satori, so it is flexbox and inline styles only — no grid, no class names, and
every element with children must say `display: "flex"`. And the fallback font
has no `✳` or `✓`, which render as filled boxes, so those glyphs are drawn as
SVG instead.
