"use client";

import { useState } from "react";
import { Check, Copy, Lock, Play, RefreshCw, ShieldCheck } from "lucide-react";
import { useLang } from "./LanguageProvider";
import { useEngine, ALL_ENGINES } from "./EngineProvider";
import { Button } from "@/components/ui/button";
import HeroStage from "./HeroStage";

const TRUST = [
  { icon: Lock, title: "No server.", desc: "Your data stays on your devices." },
  { icon: RefreshCw, title: "Peer-to-peer sync.", desc: "Works offline. Changes sync when you're back." },
  { icon: ShieldCheck, title: "Private by default.", desc: "Encrypted in transit. You own your data." },
];

/** Splits a headline into its lead clause and a final highlighted clause,
 *  e.g. "Do the thing. Skip the rest." → lead "Do the thing.", tail "Skip the rest."
 *  Locale-agnostic: falls back to no highlight when there's only one sentence. */
function splitHeadline(headline: string) {
  const parts = headline.split(/(?<=[.!?])\s+/).filter(Boolean);
  if (parts.length < 2) return { lead: headline, tail: null as string | null };
  const tail = parts.pop()!;
  return { lead: parts.join(" ") + " ", tail };
}

export default function Hero() {
  const { m } = useLang();
  const { selectedEngine, selectEngine, installCommand } = useEngine();
  const [copied, setCopied] = useState(false);

  const { lead, tail } = splitHeadline(m.hero.headline);

  const handleCopy = () => {
    navigator.clipboard.writeText(installCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="top" className="bg-hero-wash relative overflow-hidden">
      <div className="relative mx-auto grid max-w-6xl gap-14 px-6 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
        {/* left — pitch, install, trust */}
        <div className="text-center lg:text-left">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3.5 py-1.5 text-[13px] text-foreground shadow-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            Local-first · Peer-to-peer · AI-native
          </span>

          <h1 className="mx-auto mt-6 max-w-xl text-balance text-[2.3rem] font-semibold leading-[1.08] tracking-[-0.03em] text-foreground sm:text-5xl lg:mx-0">
            {lead}
            {tail && <span className="text-violet">{tail}</span>}
          </h1>
          <p className="mx-auto mt-5 max-w-md text-pretty text-[17px] leading-[1.55] text-muted-foreground lg:mx-0">
            {m.hero.sub}
          </p>

          {/* install command — the primary action, so it gets the visual weight */}
          <div className="mt-8 flex justify-center lg:justify-start">
            <div className="flex max-w-full items-center gap-3 rounded-xl border border-border bg-card py-2 pl-4 pr-2 shadow-sm">
              <code className="mono overflow-x-auto whitespace-nowrap text-[15px] text-foreground">
                <span className="mr-1.5 select-none text-muted-foreground">$</span>
                {installCommand}
              </code>
              <button
                onClick={handleCopy}
                title="Copy install command"
                aria-label="Copy install command"
                className="flex h-8 w-8 flex-none items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {copied ? <Check className="h-4 w-4 text-brand" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="mt-3.5 flex flex-wrap items-center justify-center gap-1.5 lg:justify-start">
            {ALL_ENGINES.map((engine) => {
              const isSelected = selectedEngine.slug === engine.slug;
              return (
                <button
                  key={engine.slug}
                  onClick={() => selectEngine(engine.slug)}
                  aria-pressed={isSelected}
                  className={`rounded-full border px-2 py-0.5 text-[10px] font-medium transition-colors ${
                    isSelected
                      ? "border-transparent bg-foreground/85 text-background"
                      : "border-border bg-background/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {engine.label}
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex flex-col items-center justify-center gap-2.5 sm:flex-row lg:justify-start">
            <Button
              render={<a href="#workflow" />}
              nativeButton={false}
              variant="outline"
              className="h-9 gap-1.5 rounded-lg px-4 text-[15px]"
            >
              <Play className="h-3.5 w-3.5" />
              See how it works
            </Button>
            <Button render={<a href="#pricing" />} nativeButton={false} className="h-9 rounded-lg px-4 text-[15px]">
              Get started
            </Button>
          </div>

          <div className="mt-10 grid gap-6 border-t border-border pt-8 sm:grid-cols-3 lg:text-left">
            {TRUST.map((t) => (
              <div key={t.title} className="flex flex-col items-center gap-1.5 sm:items-start">
                <t.icon className="h-4 w-4 text-muted-foreground" />
                <p className="text-[13px] font-semibold text-foreground">{t.title}</p>
                <p className="text-[12px] leading-snug text-muted-foreground">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* right — the live product, driven by the same demo script */}
        <div>
          <HeroStage />
        </div>
      </div>
    </section>
  );
}
