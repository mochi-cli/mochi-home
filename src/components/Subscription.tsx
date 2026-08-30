"use client";

import { Check, ShieldCheck } from "lucide-react";
import { track } from "@vercel/analytics";
import Reveal from "./Reveal";
import { useLang } from "./LanguageProvider";
import WaitlistForm, { waitlistEnabled } from "./WaitlistForm";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const proProductId = process.env.NEXT_PUBLIC_POLAR_PRO_PRODUCT_ID;
const proCheckoutHref = proProductId
  ? `/api/checkout?products=${proProductId}`
  : null;

export default function Subscription() {
  const { m } = useLang();
  const [freeCopy, proCopy] = m.price.plans;

  return (
    <section id="pricing" className="section-alt relative">
      <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
        <Reveal
          className="mb-12 text-center"
          onVisible={() => track("pricing_view")}
        >
          <p className="eyebrow eyebrow-accent">{m.eyebrow.price}</p>
          <h2 className="mt-3 text-[length:var(--text-h2)] font-semibold tracking-tight text-foreground">
            {m.price.title}
          </h2>
          <p className="mt-3 text-base text-muted-foreground">{m.price.sub}</p>
        </Reveal>

        <div className="mx-auto grid max-w-3xl items-start gap-5 md:grid-cols-2">
          {/* Free — not shippable yet, so it sells the waitlist instead of a
              price and a dead button. */}
          <Reveal className="relative" variant="soft">
            <Card className="relative flex h-full flex-col p-8">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Free</span>
                <span className="rounded-full border border-border px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                  {m.price.soon}
                </span>
              </div>

              <p className="mt-6 text-xl font-semibold leading-snug text-foreground">
                {m.waitlist.title}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{freeCopy.tagline}</p>

              <div className="my-6 h-px w-full bg-border" />

              <ul className="flex flex-1 flex-col gap-3">
                {freeCopy.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 flex-none text-muted-foreground/60" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {waitlistEnabled ? (
                <>
                  <p className="mt-8 text-xs leading-relaxed text-muted-foreground">
                    {m.waitlist.sub}
                  </p>
                  <WaitlistForm />
                </>
              ) : (
                <span
                  aria-disabled="true"
                  className="mt-8 inline-flex h-11 w-full cursor-not-allowed items-center justify-center rounded-full border border-border bg-secondary text-sm text-muted-foreground"
                >
                  {m.price.soon}
                </span>
              )}
            </Card>
          </Reveal>

          {/* Pro — the only plan you can actually buy today. */}
          <Reveal delay={90} className="relative" variant="soft">
            <Badge className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap border-transparent bg-violet text-violet-foreground">
              ★ {m.price.popular}
            </Badge>
            <Card className="relative flex h-full flex-col p-8 ring-2 ring-violet">
              <span className="text-sm font-medium text-foreground">Pro</span>

              <div className="mt-6 flex items-end gap-1.5">
                <span className="text-5xl font-semibold leading-none">$19</span>
                <span className="mb-1.5 text-sm text-muted-foreground">{m.price.forever}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{proCopy.tagline}</p>

              <div className="my-6 h-px w-full bg-border" />

              <ul className="flex flex-1 flex-col gap-3">
                {proCopy.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-foreground">
                    <Check className="mt-0.5 h-4 w-4 flex-none text-violet" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {proCheckoutHref ? (
                <Button
                  render={<a href={proCheckoutHref} />}
                  nativeButton={false}
                  size="lg"
                  onClick={() => track("pro_click")}
                  className="mt-8 h-11 w-full rounded-full bg-violet text-sm text-violet-foreground hover:bg-violet/90"
                >
                  {m.price.getPro}
                </Button>
              ) : (
                <span
                  aria-disabled="true"
                  className="mt-8 inline-flex h-11 w-full cursor-not-allowed items-center justify-center rounded-full border border-border bg-secondary text-sm text-muted-foreground"
                >
                  {m.price.soon}
                </span>
              )}
            </Card>
          </Reveal>
        </div>

        <p className="mt-8 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5" />
          {m.price.billed}
        </p>
      </div>
    </section>
  );
}
