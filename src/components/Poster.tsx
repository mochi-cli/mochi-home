import { MARK_BODY, MARK_CELLS } from "@/lib/mark";

/* Marketing and social images, drawn by the same generator that draws the link
   previews. One source for the brand means a poster can never drift from the
   page it is advertising, and re-cutting for a new platform is a size argument
   rather than a trip through a design tool.

   Everything here is flexbox and inline styles, because these render through
   Satori: no grid, no class names, and every element with children says so. */

export const SIZES = {
  og: { width: 1200, height: 630 },
  x: { width: 1600, height: 900 },
  square: { width: 1080, height: 1080 },
  story: { width: 1080, height: 1920 },
} as const;

export type SizeName = keyof typeof SIZES;
export type VariantName = "claim" | "numbers" | "agent" | "limits" | "pricing";

const PAPER = "#f6f6f6";
const SURFACE = "#ffffff";
const INK = "#0a0a0a";
const INK_2 = "#5f5f5f";
const INK_3 = "#6f6f6f";
const LINE = "#e3e3e3";
const CONT = "#8a8a8a";

/* The product's own status colours, kept as they are: flattening them would
   misrepresent what the app looks like. */
const MINT = { bg: "#dcebdf", fg: "#1f5b31" };
const AMBER = { bg: "#f6e7cd", fg: "#7a4d10" };
const ROSE = { bg: "#f6dcdf", fg: "#8a1f31" };

const READINGS: [string, string, string][] = [
  ["0.3", "s", "From cold to open"],
  ["1", "ms", "Edit a cell"],
  ["14", "ms", "Read a thousand rows"],
  ["0", "", "Requests to anywhere else"],
];

const LIMITS = ["No telemetry", "No auto-update", "No plugin store", "No account to open a file"];

const ROWS: [string, string, keyof typeof STOCK][] = [
  ["Ceramic mug, matte white", "$18.00", "in"],
  ["Double-wall glass, 250ml", "$22.50", "low"],
  ["Enamel camp mug", "$16.00", "back"],
  ["Coffee dripper V60", "$28.00", "in"],
  ["Notebook A5, dot grid", "$14.00", "in"],
];
const STOCK = {
  in: { label: "In stock", tone: MINT },
  low: { label: "Low stock", tone: AMBER },
  back: { label: "Backorder", tone: ROSE },
};

/* Drawn rather than typed. The font Satori falls back to has no asterisk or
   tick in it, and a missing glyph renders as a filled box — which is a worse
   look on a poster than no glyph at all. */
function Asterisk({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      {[0, 60, 120].map((deg) => (
        <rect
          key={deg}
          x={11}
          y={3}
          width={2}
          height={18}
          rx={1}
          fill={color}
          transform={`rotate(${deg} 12 12)`}
        />
      ))}
    </svg>
  );
}

function Tick({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M5 13l4.5 4.5L19 7" fill="none" stroke={color} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Mark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512">
      <path fill={INK} d={MARK_BODY} />
      {MARK_CELLS.map((c, i) => (
        <rect key={i} x={c.x} y={c.y} width={c.w} height={c.h} rx={c.rx} fill="#ffffff" opacity={c.o} />
      ))}
    </svg>
  );
}

/** The miniature of the product: a grid with an agent working beside it, never
 *  on top of it. Same arrangement as the film, for the same reason. */
function Miniature({ k, rows }: { k: number; rows: number }) {
  return (
    <div style={{ display: "flex", width: "100%", gap: 20 * k }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          background: SURFACE,
          border: `1px solid ${LINE}`,
          borderRadius: 8 * k,
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", padding: `${11 * k}px ${14 * k}px`, borderBottom: `1px solid ${LINE}`, gap: 10 * k }}>
          <div style={{ display: "flex", fontSize: 15 * k, color: INK }}>Products</div>
          <div style={{ display: "flex", fontSize: 15 * k, color: INK_3 }}>All</div>
        </div>
        {ROWS.slice(0, rows).map(([name, price, state]) => (
          <div
            key={name}
            style={{
              display: "flex",
              alignItems: "center",
              padding: `${11 * k}px ${14 * k}px`,
              borderBottom: `1px solid ${LINE}`,
              gap: 12 * k,
            }}
          >
            <div style={{ display: "flex", flex: 1, fontSize: 16 * k, color: INK }}>{name}</div>
            <div style={{ display: "flex", fontSize: 16 * k, color: INK_2 }}>{price}</div>
            <div
              style={{
                display: "flex",
                fontSize: 13 * k,
                color: STOCK[state].tone.fg,
                background: STOCK[state].tone.bg,
                padding: `${4 * k}px ${8 * k}px`,
                borderRadius: 3 * k,
              }}
            >
              {STOCK[state].label}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: 260 * k,
          background: "#fbf9f7",
          border: "1px solid #e6ddd6",
          borderRadius: 8 * k,
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", padding: `${11 * k}px ${14 * k}px`, borderBottom: "1px solid #e6ddd6", gap: 8 * k }}>
          <Asterisk size={16 * k} color="#c05f38" />
          <div style={{ display: "flex", fontSize: 15 * k, color: INK }}>Claude</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", padding: 14 * k, gap: 10 * k }}>
          <div style={{ display: "flex", fontSize: 15 * k, color: INK_2, lineHeight: 1.4 }}>
            Set up a CRM and fill in the catalogue.
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8 * k,
              border: "1px solid #e6ddd6",
              borderRadius: 6 * k,
              padding: `${8 * k}px ${10 * k}px`,
            }}
          >
            <Tick size={14 * k} color="#c05f38" />
            <div style={{ display: "flex", flex: 1, fontSize: 13 * k, color: INK_2 }}>mochi.create_collections</div>
            <div style={{ display: "flex", fontSize: 12 * k, color: INK_3 }}>1.2s</div>
          </div>
          <div style={{ display: "flex", fontSize: 15 * k, color: INK_2, lineHeight: 1.4 }}>
            Created 8 collections. Seeded 12 products.
          </div>
        </div>
      </div>
    </div>
  );
}

export function Poster({ variant, size }: { variant: VariantName; size: SizeName }) {
  const { width, height } = SIZES[size];
  // A story is 1080 wide but viewed filling a phone, so scaling type off width
  // alone leaves it too small to read at a thumb's distance.
  const k = (width / 1200) * (size === "story" ? 1.35 : 1);
  const tall = height > width;
  // A square is not tall enough to change the type scale, but it is too tall to
  // let the content sit on the floor the way a 1.9:1 crop wants it to.
  const centred = height >= width;
  const pad = (tall ? 84 : 72) * k;

  // The four readings sit in a row where there is width for it and stack into
  // pairs where there is not.
  const numberCols = tall || size === "square" ? 2 : 4;

  const heading = (text: string, max = 0.86) => (
    <div
      style={{
        display: "flex",
        fontSize: (tall ? 78 : 68) * k,
        lineHeight: 1.05,
        letterSpacing: -2 * k,
        color: INK,
        maxWidth: (width - pad * 2) * max,
      }}
    >
      {text}
    </div>
  );

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: PAPER,
        padding: pad,
        position: "relative",
      }}
    >
      {/* the mark's own two rows, running off both edges, so the frame reads as
          a crop of something larger — which is what a table is */}
      <div style={{ position: "absolute", inset: 0, display: "flex" }}>
        {Array.from({ length: Math.ceil(width / (168 * k)) }).map((_, i) => (
          // an explicit height: a percentage inside an absolutely positioned
          // flex box resolves to nothing here, and the rules vanish
          <div key={i} style={{ display: "flex", width: 168 * k, height, borderRight: `1px solid ${LINE}` }} />
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: height * 0.28,
          height: height * 0.2,
          borderTop: `1px solid ${LINE}`,
          borderBottom: `1px solid ${LINE}`,
          display: "flex",
        }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: 20 * k }}>
        <Mark size={64 * k} />
        <div style={{ display: "flex", fontSize: 40 * k, color: INK, letterSpacing: -1 * k }}>Mochi</div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 26 * k,
          ...(centred ? { flex: 1, justifyContent: "center" } : {}),
        }}
      >
        {variant === "claim" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 22 * k }}>
            {heading("Your team's data, in a file your AI can actually work in.")}
            <div style={{ display: "flex", fontSize: 28 * k, color: INK_2 }}>
              A table your agent edits through MCP, kept in git on your own machine.
            </div>
          </div>
        )}

        {variant === "agent" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 30 * k }}>
            <div
              style={{
                display: "flex",
                fontSize: (tall ? 62 : 52) * k,
                lineHeight: 1.06,
                letterSpacing: -1.6 * k,
                color: INK,
                maxWidth: (width - pad * 2) * 0.82,
              }}
            >
              It writes into your table. Not into a chat window.
            </div>
            <Miniature k={k * (tall ? 0.94 : 0.72)} rows={tall ? 5 : 4} />
          </div>
        )}

        {/* 1200x630 is the tightest frame of the four, so this block is sized
            to fit it; every other size is the same content at a larger k. */}
        {variant === "numbers" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 * k }}>
            <div
              style={{
                display: "flex",
                fontSize: (tall ? 68 : 56) * k,
                lineHeight: 1.06,
                letterSpacing: -1.6 * k,
                color: INK,
                maxWidth: (width - pad * 2) * 0.8,
              }}
            >
              Small enough to open. Quick enough to forget.
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", width: "100%" }}>
              {READINGS.map(([v, unit, label]) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: `${100 / numberCols}%`,
                    borderTop: `1px solid ${LINE}`,
                    paddingTop: 16 * k,
                    paddingBottom: 16 * k,
                    paddingRight: 20 * k,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8 * k }}>
                    <div style={{ display: "flex", fontSize: 54 * k, color: INK, letterSpacing: -2 * k }}>{v}</div>
                    {unit && <div style={{ display: "flex", fontSize: 30 * k, color: CONT }}>{unit}</div>}
                  </div>
                  <div style={{ display: "flex", fontSize: 20 * k, color: INK_2, marginTop: 8 * k }}>{label}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", fontSize: 20 * k, color: INK_3 }}>
              Measured on a MacBook, on a table of 10,000 rows and 6 columns.
            </div>
          </div>
        )}

        {variant === "limits" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 30 * k }}>
            {heading("It does what you asked, and nothing else.", 0.8)}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 * k }}>
              {LIMITS.map((line) => (
                <div key={line} style={{ display: "flex", alignItems: "center", gap: 18 * k }}>
                  <div style={{ display: "flex", width: 26 * k, height: 1, background: INK }} />
                  <div style={{ display: "flex", fontSize: 34 * k, color: INK_2 }}>{line}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {variant === "pricing" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 34 * k }}>
            {heading("Free while it is just you.", 0.8)}
            <div style={{ display: "flex", flexDirection: tall ? "column" : "row", gap: 24 * k }}>
              {[
                ["Free", "For one person", "Everything runs on your own machine"],
                ["Pro", "For a team", "Seats for the rest of your team"],
              ].map(([name, tagline, note]) => (
                <div
                  key={name}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    background: SURFACE,
                    border: `1px solid ${LINE}`,
                    borderRadius: 8 * k,
                    padding: 30 * k,
                    gap: 10 * k,
                  }}
                >
                  <div style={{ display: "flex", fontSize: 40 * k, color: INK, letterSpacing: -1 * k }}>{name}</div>
                  <div style={{ display: "flex", fontSize: 24 * k, color: INK_2 }}>{tagline}</div>
                  <div style={{ display: "flex", fontSize: 21 * k, color: INK_3, lineHeight: 1.4 }}>{note}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      <div style={{ display: "flex", fontSize: 26 * k, color: INK_3 }}>mochi-cli.com</div>
    </div>
  );
}
