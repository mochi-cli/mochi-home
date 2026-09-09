"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useLang } from "./LanguageProvider";
import HeroChatTable from "./HeroChatTable";
import MacDock from "./MacDock";
import type { AgentSkin } from "./appui";
import DownloadButton from "./DownloadButton";

/** Splits a headline into its lead clause and a final clause, so the second
 *  clause can drop to grey. Handles CJK terminators too: Japanese and Chinese
 *  end sentences with 。！？ and put no space after them, so a Latin-only
 *  "punctuation + whitespace" rule left those locales with no split at all.
 *  Falls back to a single-tone headline when there is only one sentence. */
function splitHeadline(headline: string) {
  const parts = headline.split(/(?<=[。！？])|(?<=[.!?])\s+/).filter(Boolean);
  if (parts.length < 2) return { lead: headline, tail: null as string | null };
  const tail = parts.pop()!;
  const lead = parts.join(" ");
  // CJK sets no space after 。！？, so only Latin sentences get the joining space.
  return { lead: lead + (/[。！？]$/.test(lead) ? "" : " "), tail };
}

export default function Hero() {
  const { m } = useLang();
  // Which agent is driving the demo. It lives here because the dock picks it
  // and the workspace wears it.
  const [agent, setAgent] = useState<AgentSkin>("claude");
  const { lead, tail } = splitHeadline(m.hero.headline);

  return (
    <section id="top" className="relative pt-16 sm:pt-20">
      <div className="cell-field pointer-events-none absolute inset-x-0 top-0 h-[520px]" aria-hidden />

      <div className="relative mx-auto max-w-[1280px] px-5 sm:px-8">
        <h1 className="display max-w-[19ch]">
          {lead}
          {tail && <span className="cont">{tail}</span>}
        </h1>

        <p className="lead mt-6 max-w-[54ch]">{m.hero.sub}</p>

        <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            <DownloadButton className="inline-flex h-11 items-center justify-center rounded-[var(--r)] bg-ink px-6 text-[15px] text-ink-inv transition-opacity hover:opacity-88 active:translate-y-px" />
          <a
            href="#features"
            className="group inline-flex items-center gap-1.5 whitespace-nowrap text-[15px] text-ink transition-colors hover:text-ink-2"
          >
            {m.hero.ctaSecondary}
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              strokeWidth={1.5}
            />
          </a>
        </div>


        {/* The canvas is the argument: ask in plain language, watch the grid
            change. It stays fully inside the column rather than bleeding off
            the edge, because the agent panel on its right has to be readable.
            The dock straddles its bottom edge so the whole thing reads as an
            app running on a machine, not a screenshot pasted on a page. */}
        <div className="relative mt-14 pb-8 sm:mt-16">
          <HeroChatTable agent={agent} />
          <MacDock
            agent={agent}
            onAgent={setAgent}
            className="absolute bottom-0 left-1/2 hidden -translate-x-1/2 sm:flex"
          />
        </div>
      </div>
    </section>
  );
}
