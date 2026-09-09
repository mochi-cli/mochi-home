import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { SELLER, UPDATED, MERCHANT } from "@/content/legal";

export const metadata: Metadata = {
  title: "Refunds",
  description: "When you get your money back, and how to ask.",
  alternates: { canonical: "/refund" },
};

export default function RefundPage() {
  return (
    <PageShell
      kicker="Refunds"
      title="Getting your money back"
      sub={`Last updated ${UPDATED}. The short version: ask within 14 days and you get it back, no reason needed.`}
    >
      <section className="mx-auto max-w-[68ch] px-5 pb-28 pt-16 text-[15px] leading-relaxed text-ink-2 sm:px-8 md:pb-36">
        <h2 className="text-[19px] text-ink">Fourteen days, no reason needed</h2>
        <p className="mt-3">
          Write to {SELLER.email} within 14 days of a payment and it is refunded in full. You do
          not have to say why, and being asked to justify it would defeat the point.
        </p>
        <p className="mt-3">
          This applies to the first payment of a subscription and to each renewal. If a renewal
          went through and you had meant to cancel, that is exactly what this is for.
        </p>

        <h2 className="mt-10 text-[19px] text-ink">After fourteen days</h2>
        <p className="mt-3">
          Cancelling stops the next renewal but does not refund the period you are in — Pro runs
          to the end of it, and your profile shows the date. If something is broken rather than
          merely unwanted, write anyway; a product that does not do what it said is a refund
          regardless of the calendar.
        </p>

        <h2 className="mt-10 text-[19px] text-ink">If you are in the EU or UK</h2>
        <p className="mt-3">
          Consumer law gives you a 14-day right to withdraw from a distance purchase. Downloading
          the app does not waive it. Where that law gives you more than this page does, it wins.
        </p>

        <h2 className="mt-10 text-[19px] text-ink">How it is paid back</h2>
        <p className="mt-3">
          {MERCHANT.name} took the payment as merchant of record, so the refund goes back through
          them to the card or account you paid with. That usually takes a few working days on
          their side and then however long your bank takes.
        </p>
        <p className="mt-3">
          Your workspaces are files on your own disk and are not affected by a refund. Nothing is
          deleted, and the free tier keeps opening them.
        </p>

        <h2 className="mt-10 text-[19px] text-ink">Asking</h2>
        <p className="mt-3">
          {SELLER.email} — the order reference from your receipt makes it quicker, but your email
          address is enough to find it.
        </p>
      </section>
    </PageShell>
  );
}
