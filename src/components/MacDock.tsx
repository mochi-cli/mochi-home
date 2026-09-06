"use client";

import Image from "next/image";
import { SquareTerminal } from "lucide-react";
import type { AgentSkin } from "./appui";

/* The Mac dock under the workspace, so the hero reads as an app running on a
   machine rather than a screenshot on a page. Mochi sits in the middle with the
   running dot; either side of it are the tools it actually works alongside.

   The two agents on the left are buttons: clicking one hands the demo to it,
   the way picking an app in a dock hands it the screen.

   Claude's glyph is a Simple Icons path (CC0) inlined at build time rather than
   imported, so nothing ships a three thousand icon barrel and nothing depends
   on a CDN staying up. OpenAI's mark is not in Simple Icons, so Codex carries a
   neutral terminal glyph and is named in text rather than drawn. */

interface DockIcon {
  label: string;
  hex: string;
  path: string;
}

const CLAUDE: DockIcon = {
    label: "Claude",
    hex: "#D97757",
    path:
      "m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z",
  };

const TOOLS: DockIcon[] = [
  {
    label: "Git",
    hex: "#F03C2E",
    path:
      "M13.09 23.549a1.54 1.54 0 0 1-2.18 0L.451 13.089a1.54 1.54 0 0 1 0-2.179l7.191-7.19 2.733 2.733a1.85 1.85 0 0 0 .964 2.326v6.66a1.849 1.849 0 1 0 1.54 0V8.957l2.508 2.508a1.85 1.85 0 1 0 1.09-1.09l-2.634-2.634a1.85 1.85 0 0 0-2.378-2.377L8.73 2.63 10.91.451a1.54 1.54 0 0 1 2.179 0l10.459 10.46a1.54 1.54 0 0 1 0 2.179z",
  },
  {
    label: "GitHub",
    hex: "#181717",
    path:
      "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
  },
];

const CODEX_HEX = "#0d0d0d";

function tileClass(active: boolean) {
  return `flex h-11 w-11 flex-none items-center justify-center rounded-[11px] shadow-[0_1px_2px_rgba(0,0,0,0.18)] transition-transform duration-200 hover:-translate-y-1 ${
    active ? "" : "opacity-45 saturate-50"
  }`;
}

function Glyph({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-[22px] w-[22px] fill-white" aria-hidden focusable="false">
      <path d={path} />
    </svg>
  );
}

/** A running app keeps the dot macOS puts under it; the one that is not
 *  driving the demo dims, the way a dock shows what is in front. */
function Dot({ on }: { on: boolean }) {
  return (
    <span
      className={`absolute -bottom-[7px] h-1 w-1 rounded-full transition-opacity ${on ? "opacity-100" : "opacity-0"}`}
      style={{ background: "var(--ink-3)" }}
      aria-hidden
    />
  );
}

export default function MacDock({
  agent,
  onAgent,
  className = "",
}: {
  /** which agent is driving, when the dock is a control */
  agent?: AgentSkin;
  /** pass to make the dock a control; omit it and `agent` merely reports which
   *  app is in front. Omit both and every app reads as running, which is what a
   *  second dock on the page should be. */
  onAgent?: (next: AgentSkin) => void;
  className?: string;
}) {
  // Three modes: with `onAgent` the dock is a control; with `agent` alone it
  // only reports which app is in front, for a film that drives itself; with
  // neither, every app reads as running because nothing is picking.
  const live = (id: AgentSkin) => (agent ? agent === id : true);
  return (
    <div
      className={`flex items-end gap-2 rounded-[18px] border border-line bg-surface/80 px-2.5 py-2 shadow-[0_2px_8px_rgba(0,0,0,0.06),0_20px_50px_-18px_rgba(0,0,0,0.35)] backdrop-blur-md ${className}`}
    >
      <span className="relative flex flex-col items-center">
        {onAgent ? (
          <button
            type="button"
            onClick={() => onAgent("claude")}
            aria-pressed={agent === "claude"}
            className={tileClass(live("claude"))}
            style={{ background: CLAUDE.hex }}
            title="Claude"
          >
            <Glyph path={CLAUDE.path} />
            <span className="sr-only">Hand the demo to Claude</span>
          </button>
        ) : (
          <span className={tileClass(true)} style={{ background: CLAUDE.hex }} title="Claude">
            <Glyph path={CLAUDE.path} />
          </span>
        )}
        <Dot on={live("claude")} />
      </span>

      <span className="relative flex flex-col items-center">
        {onAgent ? (
          <button
            type="button"
            onClick={() => onAgent("codex")}
            aria-pressed={agent === "codex"}
            className={tileClass(live("codex"))}
            style={{ background: CODEX_HEX }}
            title="Codex"
          >
            <SquareTerminal className="h-[22px] w-[22px] text-white" strokeWidth={1.8} aria-hidden />
            <span className="sr-only">Hand the demo to Codex</span>
          </button>
        ) : (
          <span className={tileClass(true)} style={{ background: CODEX_HEX }} title="Codex">
            <SquareTerminal className="h-[22px] w-[22px] text-white" strokeWidth={1.8} aria-hidden />
          </span>
        )}
        <Dot on={live("codex")} />
      </span>

      {/* Mochi: its own tile, always running */}
      <span className="relative flex flex-col items-center">
        <span
          className="flex h-11 w-11 flex-none items-center justify-center rounded-[11px] border border-line bg-paper shadow-[0_1px_2px_rgba(0,0,0,0.18)] transition-transform duration-200 hover:-translate-y-1"
          title="Mochi"
        >
          <Image src="/mark.svg" alt="" width={32} height={32} className="h-[26px] w-[26px]" aria-hidden />
        </span>
        <Dot on />
      </span>

      {TOOLS.map((i) => (
        <span
          key={i.label}
          className="flex h-11 w-11 flex-none items-center justify-center rounded-[11px] shadow-[0_1px_2px_rgba(0,0,0,0.18)] transition-transform duration-200 hover:-translate-y-1"
          style={{ background: i.hex }}
          title={i.label}
        >
          <Glyph path={i.path} />
        </span>
      ))}
    </div>
  );
}
