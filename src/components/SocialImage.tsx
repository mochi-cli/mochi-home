import { MARK_BODY, MARK_CELLS } from "@/lib/mark";

/* The link preview, drawn rather than exported: one generator, so the image a
   platform crops can never drift from the page it points at.

   It follows brand/README.md's description of the cover as closely as a 1200
   by 630 frame allows: white, because the product is a white app and the mark
   is a black shape, and faint cells running off both edges so the banner reads
   as a crop of something larger, which is what a table is. */

export const SOCIAL_SIZE = { width: 1200, height: 630 };

const PAPER = "#f6f6f6";
const INK = "#0a0a0a";
const LINE = "#e3e3e3";
const MUTED = "#5f5f5f";

export function SocialImage({ title, kicker }: { title: string; kicker?: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: PAPER,
        position: "relative",
        padding: 72,
      }}
    >
      {/* the cells, on the mark's own two rows, running off both edges */}
      <div style={{ position: "absolute", inset: 0, display: "flex" }}>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div
            key={i}
            style={{
              width: 168,
              height: 630,
              borderRight: `1px solid ${LINE}`,
              display: "flex",
            }}
          />
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 176,
          height: 128,
          borderTop: `1px solid ${LINE}`,
          borderBottom: `1px solid ${LINE}`,
          display: "flex",
        }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <svg width="64" height="64" viewBox="0 0 512 512">
          <path fill={INK} d={MARK_BODY} />
          {MARK_CELLS.map((c, i) => (
            <rect
              key={i}
              x={c.x}
              y={c.y}
              width={c.w}
              height={c.h}
              rx={c.rx}
              fill="#ffffff"
              opacity={c.o}
            />
          ))}
        </svg>
        <div style={{ display: "flex", fontSize: 40, color: INK, letterSpacing: -1 }}>Mochi</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {kicker && (
          <div style={{ display: "flex", fontSize: 26, color: MUTED, marginBottom: 18 }}>
            {kicker}
          </div>
        )}
        <div
          style={{
            display: "flex",
            fontSize: 68,
            lineHeight: 1.05,
            letterSpacing: -2,
            color: INK,
            maxWidth: 900,
          }}
        >
          {title}
        </div>
      </div>
    </div>
  );
}
