import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { InlineCode } from "@/components/Prose";
import { RELEASES } from "@/content/changelog";

export const metadata: Metadata = {
  title: "Changelog",
  description: "What changed in each release of Mochi.",
  alternates: { canonical: "/changelog" },
};

export default function ChangelogPage() {
  return (
    <PageShell
      kicker="Changelog"
      title="What changed, release by release"
      sub="Each entry is the release note as written. Nothing is summarised here, so the page cannot claim more than the release did."
    >
      <section className="mx-auto max-w-[1280px] px-5 pb-28 pt-16 sm:px-8 md:pb-36">
        <ol className="border-t border-line">
          {RELEASES.map((r) => (
            <li key={r.version} className="grid gap-4 border-b border-line py-8 lg:grid-cols-[10rem_minmax(0,1fr)] lg:gap-12 lg:py-10">
              <h2 className="mono text-[13px] tabular-nums text-ink-3 lg:pt-1">{r.version}</h2>
              <ul className="flex flex-col gap-3">
                {r.items.map((item) => (
                  <li key={item} className="max-w-[62ch] text-[15px] leading-relaxed text-ink-2">
                    <InlineCode text={item} />
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

      </section>
    </PageShell>
  );
}
