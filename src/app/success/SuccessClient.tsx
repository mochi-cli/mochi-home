"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useLang } from "@/components/LanguageProvider";
import { Button } from "@/components/ui/button";

function SuccessContent() {
  const { m } = useLang();
  const searchParams = useSearchParams();
  const checkoutId = searchParams.get("checkout_id");

  return (
    <section className="bg-mesh-neutral relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-20">
      <div className="relative mx-auto max-w-lg text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft">
          <CheckCircle2 className="h-8 w-8 text-brand-soft-foreground" />
        </div>

        <h1 className="text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
          {m.success.title}
        </h1>
        <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
          {m.success.sub}
        </p>

        {checkoutId && (
          <p className="mono mt-4 text-xs text-muted-foreground">
            {m.success.order} {checkoutId}
          </p>
        )}

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            render={<a href="https://github.com/mochi-cli/mochi" target="_blank" rel="noopener noreferrer" />}
            nativeButton={false}
            size="lg"
            className="h-12 w-full rounded-full text-sm sm:w-auto"
          >
            {m.success.cta} →
          </Button>
          <Button render={<Link href="/" />} nativeButton={false} variant="outline" size="lg" className="h-12 w-full rounded-full text-sm sm:w-auto">
            {m.success.back}
          </Button>
        </div>

        <div className="mono mt-8 inline-flex h-11 max-w-full items-center gap-3 overflow-x-auto whitespace-nowrap rounded-full border border-border bg-card px-5 text-sm text-foreground/90">
          <span className="text-muted-foreground">$</span> npx @mochi-cli/mochi init --kit all
        </div>

        <p className="mt-8 text-xs text-muted-foreground">{m.success.note}</p>
      </div>
    </section>
  );
}

export default function SuccessClient() {
  return (
    <Suspense fallback={null}>
      <SuccessContent />
    </Suspense>
  );
}
