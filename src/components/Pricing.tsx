"use client";

import { Check } from "lucide-react";
import Reveal from "./Reveal";
import { useLang } from "./LanguageProvider";
import { DOWNLOAD_URL } from "@/lib/links";
import type { Plans } from "@/lib/service/plans";

/** Two plans, split by a single rule. The Pro price comes from Polar rather
 *  than from a number typed here, so what the page says and what the card is
 *  charged cannot drift apart. When billing is not configured the section
 *  still renders: a marketing page with a gap is better than one that fails. */
export default function Pricing({ plans }: { plans: Plans | null }) {
  const { m } = useLang();
  const [free, pro] = m.price.plans;

  const money = (amount: number, currency: string) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount);

  return (
    <section id="pricing" className="border-t border-line py-28 md:py-36">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <Reveal className="text-center">
          <p className="kicker">{m.nav.pricing}</p>
          <h2 className="display mx-auto mt-4 max-w-[20ch]">{m.price.title}</h2>
          <p className="lead mx-auto mt-6 max-w-[52ch]">{m.price.sub}</p>
        </Reveal>

        <Reveal variant="soft" className="mt-16">
          <div className="grid border-t border-line md:grid-cols-2">
            <div className="flex flex-col border-b border-line py-10 md:border-b-0 md:pr-12 lg:pr-20">
              <h3 className="text-[17px] text-ink">{m.price.free}</h3>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="display-sm">{money(0, "USD")}</span>
              </div>
              <p className="mt-3 text-[15px] text-ink-2">{free.tagline}</p>
              <Features items={free.features} />
              <div className="mt-auto pt-8">
                <a
                  href={DOWNLOAD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center justify-center rounded-[var(--r)] border border-line-strong px-6 text-[15px] text-ink transition-colors hover:bg-paper-sunk active:translate-y-px"
                >
                  {m.hero.download}
                </a>
              </div>
            </div>

            <div className="flex flex-col py-10 md:border-l md:border-line md:pl-12 lg:pl-20">
              <h3 className="text-[17px] text-ink">Pro</h3>
              <div className="mt-6 flex items-baseline gap-2">
                {plans?.monthly ? (
                  <>
                    <span className="display-sm">
                      {money(plans.monthly.amount, plans.monthly.currency)}
                    </span>
                    <span className="text-[15px] text-ink-3">{m.price.perMonth}</span>
                  </>
                ) : (
                  <span className="display-sm text-ink-3">{m.price.soon}</span>
                )}
              </div>
              {plans?.yearly && (
                <p className="mono mt-2 text-[13px] text-ink-3">
                  {money(plans.yearly.amount, plans.yearly.currency)} {m.price.perYear}
                </p>
              )}
              <p className="mt-3 text-[15px] text-ink-2">{pro.tagline}</p>
              <Features items={pro.features} />
              <div className="mt-auto pt-8">
                <a
                  href="/profile"
                  className="inline-flex h-11 items-center justify-center rounded-[var(--r)] bg-ink px-6 text-[15px] text-ink-inv transition-opacity hover:opacity-88 active:translate-y-px"
                >
                  {m.price.cta}
                </a>
              </div>
            </div>
          </div>

          <p className="mt-8 border-t border-line pt-6 text-[14px] text-ink-2">{m.price.note}</p>
        </Reveal>
      </div>
    </section>
  );
}

function Features({ items }: { items: string[] }) {
  return (
    <ul className="mt-8 flex flex-col gap-3">
      {items.map((f) => (
        <li key={f} className="flex items-start gap-2.5 text-[15px] text-ink-2">
          <Check className="mt-1 h-3.5 w-3.5 flex-none text-ink-3" strokeWidth={2} aria-hidden />
          <span>{f}</span>
        </li>
      ))}
    </ul>
  );
}
