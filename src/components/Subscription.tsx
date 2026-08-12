"use client";

import { Check, ShieldCheck } from "lucide-react";
import Reveal from "./Reveal";
import { useLang } from "./LanguageProvider";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Plan {
  name: string;
  price: string;
  priceSuffix: string;
  credits: string;
  popular: boolean;
  ctaLabel: string;
  ctaHref: string | null;
}

const proProductId = process.env.NEXT_PUBLIC_POLAR_PRO_PRODUCT_ID;

const plans: Plan[] = [
  {
    name: "Free",
    price: "$0",
    priceSuffix: "/mo",
    credits: "0 CR",
    popular: false,
    ctaLabel: "Soon",
    ctaHref: null,
  },
  {
    name: "Pro",
    price: "$19",
    priceSuffix: "/forever",
    credits: "12 CR",
    popular: true,
    ctaLabel: "Get Pro →",
    ctaHref: proProductId ? `/api/checkout?products=${proProductId}` : null,
  },
];

export default function Subscription() {
  const { m } = useLang();

  return (
    <section id="pricing" className="relative border-b border-border bg-secondary/30">
      <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28">
        <Reveal className="mb-12 text-center">
          <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-violet">Pricing</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {m.price.title}
          </h2>
          <p className="mt-3 text-base text-muted-foreground">{m.price.sub}</p>
        </Reveal>

        <div className="mx-auto grid max-w-3xl gap-5 md:grid-cols-2">
          {plans.map((plan, i) => {
            const data = m.price.plans[i];
            const hot = plan.popular;
            return (
              <Reveal key={plan.name} delay={i * 90} className="relative">
                {hot && (
                  <Badge className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap border-transparent bg-violet text-violet-foreground">
                    ★ {m.price.popular}
                  </Badge>
                )}
                <Card
                  className={`relative flex h-full flex-col p-8 ${
                    hot ? "ring-2 ring-violet" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{plan.name}</span>
                    <span className="text-xs font-medium text-muted-foreground">{plan.credits}</span>
                  </div>

                  <div className="mt-6 flex items-end gap-1.5">
                    <span className="text-5xl font-semibold leading-none">{plan.price}</span>
                    <span className="mb-1.5 text-sm text-muted-foreground">{plan.priceSuffix}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{data.tagline}</p>

                  <div className="my-6 h-px w-full bg-border" />

                  <ul className="flex flex-1 flex-col gap-3">
                    {data.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-foreground">
                        <Check className={`mt-0.5 h-4 w-4 flex-none ${hot ? "text-violet" : "text-foreground"}`} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.ctaHref ? (
                    <Button
                      render={
                        <a
                          href={plan.ctaHref}
                          {...(plan.ctaHref.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        />
                      }
                      nativeButton={false}
                      size="lg"
                      className={`mt-8 h-11 w-full rounded-full text-sm ${hot ? "bg-violet text-violet-foreground hover:bg-violet/90" : ""}`}
                    >
                      {plan.ctaLabel}
                    </Button>
                  ) : (
                    <span
                      aria-disabled="true"
                      className="mt-8 inline-flex h-11 w-full cursor-not-allowed items-center justify-center rounded-full border border-border bg-secondary text-sm text-muted-foreground"
                    >
                      {plan.ctaLabel}
                    </span>
                  )}
                </Card>
              </Reveal>
            );
          })}
        </div>

        <p className="mt-8 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5" />
          {m.price.billed}
        </p>
      </div>
    </section>
  );
}
