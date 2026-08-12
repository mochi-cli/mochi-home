"use client";

import Reveal from "./Reveal";
import { useLang } from "./LanguageProvider";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  const { m } = useLang();
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <Reveal>
          <div className="bg-mesh-neutral relative overflow-hidden rounded-3xl px-8 py-20 text-center text-foreground ring-1 ring-border sm:px-16">
            <div className="relative">
              <h2 className="mx-auto max-w-2xl text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
                Ready to organize your data?
              </h2>
              <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
                {m.cta.sub}
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button render={<a href="#pricing" />} nativeButton={false} size="lg" className="h-12 w-full rounded-full px-6 text-sm sm:w-auto">
                  Get started →
                </Button>
                <div className="mono flex h-12 w-full max-w-full items-center gap-3 overflow-x-auto whitespace-nowrap rounded-full border border-border bg-card px-5 text-sm text-foreground/90 sm:w-auto">
                  <span className="text-muted-foreground">$</span> sudo npx @mochi-cli/mochi init --kit all
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
