"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { track } from "@vercel/analytics";
import Reveal from "./Reveal";
import { useLang } from "./LanguageProvider";
import { useEngine } from "./EngineProvider";
import { Button } from "@/components/ui/button";
import { copyText } from "@/lib/copy";

export default function CTASection() {
  const { m } = useLang();
  const { selectedEngine, installCommand } = useEngine();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!(await copyText(installCommand))) return;
    track("install_copy", { location: "cta", engine: selectedEngine.slug });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section>
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <Reveal variant="soft">
          <div className="bg-mesh-neutral relative overflow-hidden rounded-3xl px-8 py-20 text-center text-foreground ring-1 ring-border sm:px-16">
            <div className="relative">
              <h2 className="mx-auto max-w-2xl text-[length:var(--text-h2-finale)] font-semibold leading-[1.08] tracking-tight">
                {m.cta.title}
              </h2>
              <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
                {m.cta.sub}
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button render={<a href="#pricing" />} nativeButton={false} size="lg" className="h-12 w-full rounded-full bg-violet px-6 text-sm text-violet-foreground hover:bg-violet/90 sm:w-auto">
                  {m.cta.button}
                </Button>
                <div className="flex h-12 w-full max-w-full items-center gap-2 rounded-full border border-border bg-card py-2 pl-5 pr-2 sm:w-auto">
                  <code className="mono min-w-0 overflow-x-auto whitespace-nowrap text-sm text-foreground/90">
                    <span className="mr-1.5 select-none text-muted-foreground">$</span>
                    {installCommand}
                  </code>
                  <button
                    onClick={handleCopy}
                    title={m.hero.copyLabel}
                    aria-label={m.hero.copyLabel}
                    className="flex h-8 w-8 flex-none items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    {copied ? <Check className="h-4 w-4 text-brand" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
