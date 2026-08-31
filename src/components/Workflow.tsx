"use client";

import { Fragment } from "react";
import Reveal from "./Reveal";
import { useLang } from "./LanguageProvider";
import { Card } from "@/components/ui/card";

// dashed connector between two step cards — desktop only, so mobile's
// single-column stack doesn't carry a dangling horizontal line
function Connector() {
  return (
    <div className="hidden flex-none items-start justify-center pt-[42px] md:flex md:w-8 lg:w-12" aria-hidden>
      <div className="relative h-px w-full">
        <span className="absolute -left-0.5 -top-[3px] h-1.5 w-1.5 rounded-full bg-violet/50" />
        <div className="h-px w-full border-t-2 border-dashed border-violet/30" />
        <span className="absolute -right-0.5 -top-[3px] h-1.5 w-1.5 rounded-full bg-violet/50" />
      </div>
    </div>
  );
}

export default function Workflow() {
  const { m } = useLang();
  return (
    <section id="workflow" className="section-alt relative">
      <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-20">
        <Reveal className="mb-12">
          <h2 className="max-w-3xl text-[length:var(--text-h2)] font-semibold tracking-tight text-foreground">
            {m.flow.title}
          </h2>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            {m.flow.sub}
          </p>
        </Reveal>

        <div className="flex flex-col gap-5 md:flex-row md:items-stretch">
          {m.flow.steps.map((step, i) => (
            <Fragment key={step.title}>
              <Reveal className="min-w-0 md:flex-1" delay={i * 100} variant="soft">
                <Card className="flex h-full min-w-0 flex-col p-7">
                  <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-violet text-sm font-semibold text-violet-foreground">
                    {i + 1}
                  </span>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.desc}
                  </p>
                </Card>
              </Reveal>
              {i < m.flow.steps.length - 1 && <Connector />}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
