"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { track } from "@vercel/analytics";
import { useLang } from "./LanguageProvider";
import { useEngine } from "./EngineProvider";
import { Button } from "@/components/ui/button";
import { copyText } from "@/lib/copy";

const proProductId = process.env.NEXT_PUBLIC_POLAR_PRO_PRODUCT_ID;

/** Pricing sits ~73% down the page, so most visitors never reach a CTA after the
 *  hero scrolls away. This bar covers that gap: it appears once the hero is gone
 *  and steps aside again inside the pricing section, where it would be noise. */
export default function StickyCTA() {
  const { m } = useLang();
  const { selectedEngine, installCommand } = useEngine();
  const [shown, setShown] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Two rect reads per scroll event, measured synchronously in a passive
    // listener. rAF coalescing was the first instinct, but rAF is paused while
    // the document is hidden, and the reads are cheap enough not to need it.
    const measure = () => {
      const hero = document.getElementById("top");
      const pricing = document.getElementById("pricing");
      if (!hero || !pricing) return;

      const heroGone = hero.getBoundingClientRect().bottom <= 0;
      const pricingRect = pricing.getBoundingClientRect();
      const pricingOnScreen =
        pricingRect.top < window.innerHeight && pricingRect.bottom > 0;

      setShown(heroGone && !pricingOnScreen);
    };

    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const handleCopy = async () => {
    if (!(await copyText(installCommand))) return;
    track("install_copy", { location: "sticky", engine: selectedEngine.slug });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      aria-hidden={!shown}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 backdrop-blur transition-transform duration-300 ${
        shown ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
        <div className="hidden min-w-0 flex-1 items-center gap-2 rounded-full border border-border bg-card py-1.5 pl-4 pr-1.5 sm:flex">
          <code className="mono min-w-0 overflow-x-auto whitespace-nowrap text-[13px] text-foreground">
            <span className="mr-1.5 select-none text-muted-foreground">$</span>
            {installCommand}
          </code>
          <button
            onClick={handleCopy}
            title={m.hero.copyLabel}
            aria-label={m.hero.copyLabel}
            tabIndex={shown ? 0 : -1}
            className="flex h-7 w-7 flex-none items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-brand" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>

        <Button
          onClick={handleCopy}
          variant="outline"
          className="h-10 flex-1 rounded-full text-sm sm:hidden"
          tabIndex={shown ? 0 : -1}
        >
          {copied ? <Check className="h-4 w-4 text-brand" /> : <Copy className="h-4 w-4" />}
          {m.hero.copyLabel}
        </Button>

        <Button
          render={
            <a href={proProductId ? `/api/checkout?products=${proProductId}` : "#pricing"} />
          }
          nativeButton={false}
          onClick={() => track("pro_click", { location: "sticky" })}
          tabIndex={shown ? 0 : -1}
          className="h-10 flex-none rounded-full bg-violet px-5 text-sm text-violet-foreground hover:bg-violet/90"
        >
          {m.price.getPro}
        </Button>
      </div>
    </div>
  );
}
