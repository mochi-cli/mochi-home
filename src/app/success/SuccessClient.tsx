"use client";

import { Suspense, useEffect } from "react";
import { track } from "@vercel/analytics";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLang } from "@/components/LanguageProvider";
import { DOWNLOAD_URL } from "@/lib/links";

function SuccessContent() {
  const { m } = useLang();
  const searchParams = useSearchParams();
  const checkoutId = searchParams.get("checkout_id");

  // Polar redirects here only after a completed purchase, so this is the
  // revenue end of the funnel the other four events lead into.
  useEffect(() => {
    track("checkout_success");
  }, []);

  return (
    <section className="flex min-h-[100dvh] items-center px-5 py-24 sm:px-8">
      <div className="mx-auto w-full max-w-[46rem]">
        <h1 className="display max-w-[14ch]">{m.success.title}</h1>
        <p className="lead mt-6 max-w-[52ch]">{m.success.sub}</p>

        {checkoutId && (
          <p className="mono mt-5 text-[13px] text-ink-3">
            {m.success.order} {checkoutId}
          </p>
        )}

        <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
          <a
            href={DOWNLOAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center rounded-[var(--r)] bg-ink px-6 text-[15px] text-ink-inv transition-opacity hover:opacity-88 active:translate-y-px"
          >
            {m.hero.download}
          </a>
          <a
            href={DOWNLOAD_URL}
            className="text-[15px] text-ink underline-offset-4 transition-colors hover:text-ink-2 hover:underline"
          >
            {m.hero.download}
          </a>
          <Link
            href="/"
            className="text-[15px] text-ink-2 underline-offset-4 transition-colors hover:text-ink hover:underline"
          >
            {m.success.back}
          </Link>
        </div>

        <p className="mt-12 border-t border-line pt-6 text-[14px] text-ink-2">{m.success.note}</p>
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
