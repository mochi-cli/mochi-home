/**
 * The two images Polar shows beside the price at checkout.
 *
 * Drawn from the same tokens as the link previews rather than exported from a
 * design tool, for the reason src/components/SocialImage.tsx gives: an image
 * that is generated cannot drift from the product it is selling. The price is
 * an argument here because it is written down in exactly one other place —
 * the Polar product — and these two must agree or the checkout contradicts
 * itself.
 *
 *   node scripts/product-image.ts
 *
 * Writes brand/polar/. Re-run and re-upload whenever the price changes.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { ImageResponse } from 'next/og.js';
import { MARK_BODY, MARK_CELLS } from '../src/lib/mark.ts';

const PAPER = '#f6f6f6';
const INK = '#0a0a0a';
const LINE = '#e3e3e3';
const MUTED = '#5f5f5f';
const SIZE = { width: 1200, height: 630 };

/** Satori takes the element shape, not JSX — this script runs under plain node. */
type El = { type: string; props: Record<string, unknown> };
const h = (type: string, props: Record<string, unknown> = {}, ...children: unknown[]): El => ({
  type,
  props: { ...props, children: children.length <= 1 ? children[0] : children },
});
const row = (style: Record<string, unknown>, ...children: unknown[]) =>
  h('div', { style: { display: 'flex', ...style } }, ...children);

/** The faint cells, on the mark's own two rows, running off both edges. */
function grid() {
  return [
    row(
      { position: 'absolute', inset: 0 },
      ...Array.from({ length: 8 }, (_, i) =>
        h('div', { key: i, style: { display: 'flex', width: 168, height: 630, borderRight: `1px solid ${LINE}` } })
      )
    ),
    row({
      position: 'absolute',
      left: 0,
      right: 0,
      top: 176,
      height: 128,
      borderTop: `1px solid ${LINE}`,
      borderBottom: `1px solid ${LINE}`,
    }),
  ];
}

function wordmark() {
  return row(
    { alignItems: 'center', gap: 18 },
    h(
      'svg',
      { width: 56, height: 56, viewBox: '0 0 512 512' },
      h('path', { fill: INK, d: MARK_BODY }),
      ...MARK_CELLS.map((c, i) =>
        h('rect', { key: i, x: c.x, y: c.y, width: c.w, height: c.h, rx: c.rx, fill: '#ffffff', opacity: c.o })
      )
    ),
    row({ fontSize: 34, color: INK, letterSpacing: -1 }, 'Mochi')
  );
}

function card({ price, per, note }: { price: string; per: string; note?: string }) {
  return row(
    {
      width: '100%',
      height: '100%',
      flexDirection: 'column',
      justifyContent: 'space-between',
      background: PAPER,
      position: 'relative',
      padding: 72,
    },
    ...grid(),
    wordmark(),
    row(
      { flexDirection: 'column' },
      row({ fontSize: 26, color: MUTED, marginBottom: 14 }, 'Mochi Pro'),
      row(
        { alignItems: 'flex-end', gap: 16 },
        row({ fontSize: 132, color: INK, letterSpacing: -6 }, price),
        row({ fontSize: 34, color: MUTED, marginBottom: 30 }, per),
        ...(note
          ? [
              row(
                {
                  marginLeft: 12,
                  marginBottom: 26,
                  fontSize: 24,
                  color: INK,
                  border: `1px solid ${LINE}`,
                  borderRadius: 999,
                  padding: '8px 20px',
                },
                note
              ),
            ]
          : [])
      ),
      row(
        { fontSize: 26, color: MUTED, marginTop: 22, maxWidth: 1020 },
        'Agent calls with no limit. 100 MB attachments. Your data stays on your machine.'
      )
    )
  );
}

const IMAGES = [
  { file: 'pro-monthly.png', price: '$5', per: 'a month' },
  { file: 'pro-yearly.png', price: '$48', per: 'a year', note: 'two months free' },
];

mkdirSync('brand/polar', { recursive: true });
for (const image of IMAGES) {
  const png = await new ImageResponse(card(image) as never, SIZE).arrayBuffer();
  writeFileSync(`brand/polar/${image.file}`, Buffer.from(png));
  console.log(`brand/polar/${image.file}`, `${Math.round(png.byteLength / 1024)}KB`);
}
