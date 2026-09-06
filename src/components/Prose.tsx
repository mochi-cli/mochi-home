import type { ReactNode } from "react";

/** Release notes and docs are written in Markdown, and the only Markdown they
 *  use is backtick code. Rendering just that keeps the copy verbatim without
 *  pulling a parser in for one feature. */
export function InlineCode({ text }: { text: string }) {
  return (
    <>
      {text.split("`").map((part, i) =>
        i % 2 === 1 ? (
          <code
            key={i}
            className="mono rounded-[3px] bg-paper-sunk px-1 py-[1px] text-[0.92em] text-ink"
          >
            {part}
          </code>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="canvas mono mt-4 overflow-x-auto px-4 py-3 text-[13px] leading-[1.7] text-ink">
      {children}
    </pre>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return (
    <p className="mt-4 border-l-2 border-line-strong pl-4 text-[15px] leading-relaxed text-ink-2">
      {children}
    </p>
  );
}
