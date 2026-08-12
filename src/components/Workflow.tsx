"use client";

import { Fragment, useState } from "react";
import Reveal from "./Reveal";
import { useLang } from "./LanguageProvider";
import { useEngine } from "./EngineProvider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, Download, LayoutGrid, Zap } from "lucide-react";

const stepMeta = [
  { n: "01", cmd: "", icon: Download, tone: "violet" as const }, // overridden per selection
  { n: "02", cmd: '"Hey Mochi create profile"', icon: LayoutGrid, tone: "violet" as const },
  { n: "03", cmd: '"Hey mochi create CRM"', icon: Zap, tone: "brand" as const },
];

function CopyableCommand({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="mono mt-6 flex items-center justify-between gap-2 rounded-xl border border-border bg-secondary/60 px-3 py-2 text-[12px] text-foreground [overflow-wrap:anywhere]">
      <span className="min-w-0 flex-1 truncate">{text}</span>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={handleCopy}
        className="shrink-0 rounded-full"
        title="Copy to clipboard"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      </Button>
    </div>
  );
}

// dashed connector between two step cards — desktop only, so mobile's
// single-column stack doesn't carry a dangling horizontal line
function Connector() {
  return (
    <div className="hidden flex-none items-start justify-center pt-[46px] md:flex md:w-8 lg:w-12" aria-hidden>
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
  const { installCommand } = useEngine();
  return (
    <section id="workflow" className="relative border-b border-border">
      <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28">
        <Reveal className="mb-12">
          <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-violet">How it works</p>
          <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {m.flow.title}
          </h2>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            Get started in minutes. No servers, no complex setup.
          </p>
        </Reveal>

        <div className="flex flex-col gap-5 md:flex-row md:items-stretch">
          {stepMeta.map((s, i) => (
            <Fragment key={s.n}>
              <Reveal className="min-w-0 md:flex-1" delay={i * 100}>
                <Card className="flex h-full min-w-0 flex-col p-7">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-violet text-sm font-semibold text-violet-foreground">
                        {i + 1}
                      </span>
                      <span
                        className={`flex h-9 w-9 flex-none items-center justify-center rounded-xl ${
                          s.tone === "brand" ? "bg-brand-soft text-brand-soft-foreground" : "bg-violet-soft text-violet-soft-foreground"
                        }`}
                      >
                        <s.icon className="h-4.5 w-4.5" />
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-violet">Step {s.n}</span>
                  </div>
                  {/* grows to fill the leftover space so every card's command
                      chip lands on the same baseline, no matter how much the
                      title/description wrap */}
                  <div className="flex-1">
                    <h3 className="mt-5 text-xl font-semibold tracking-tight text-foreground">
                      {m.flow.steps[i].title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {m.flow.steps[i].desc}
                    </p>
                  </div>
                  <CopyableCommand text={i === 0 ? installCommand : s.cmd} />
                </Card>
              </Reveal>
              {i < stepMeta.length - 1 && <Connector />}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
