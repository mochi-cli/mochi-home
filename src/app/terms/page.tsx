import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { SELLER, UPDATED, MERCHANT } from "@/content/legal";

export const metadata: Metadata = {
  title: "Terms",
  description: "What you are buying, what it does, and what it does not promise.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <PageShell
      kicker="Terms"
      title="What you are buying"
      sub={`Last updated ${UPDATED}. Written to be read, not to be got past.`}
    >
      <section className="mx-auto max-w-[68ch] px-5 pb-28 pt-16 text-[15px] leading-relaxed text-ink-2 sm:px-8 md:pb-36">
        <h2 className="text-[19px] text-ink">Who you are dealing with</h2>
        <p className="mt-3">
          Mochi is sold by {SELLER.name}, {SELLER.address}. Questions go to {SELLER.email}.
        </p>
        <p className="mt-3">
          Payment is taken by {MERCHANT.name} as merchant of record. They are the seller of the
          subscription for tax purposes, they hold your payment details, and they owe the VAT or
          sales tax in your country. We never see a card number.
        </p>

        <h2 className="mt-10 text-[19px] text-ink">What the licence is</h2>
        <p className="mt-3">
          A Mochi Pro subscription is a licence to use the app for as long as the subscription is
          paid. It is not a transfer of ownership of the software, and it is per person: one
          subscription covers one person on their own machines, up to the limit shown in your
          profile.
        </p>
        <p className="mt-3">
          The free tier is a licence too, on the same terms, with the limits described on the
          pricing page.
        </p>

        <h2 className="mt-10 text-[19px] text-ink">Your data is yours</h2>
        <p className="mt-3">
          Your workspaces are files on your disk in a documented format. Nothing here claims any
          right over their contents, and ending a subscription does not lock them: the files stay
          readable by the free tier and by anything else that reads SQLite.
        </p>
        <p className="mt-3">
          Because those files are yours and live only on your machine, backing them up is yours
          too. We cannot restore something we never had a copy of.
        </p>

        <h2 className="mt-10 text-[19px] text-ink">Billing</h2>
        <ul className="mt-3 flex list-disc flex-col gap-2 pl-5">
          <li>Subscriptions renew automatically until cancelled.</li>
          <li>
            Cancelling stops the renewal. It does not end the period you have already paid for —
            Pro runs to the end of it, and your profile shows the date.
          </li>
          <li>Prices may change, but not for a period already paid.</li>
          <li>Refunds are described on the <a className="text-ink underline underline-offset-4" href="/refund">refund page</a>.</li>
        </ul>

        <h2 className="mt-10 text-[19px] text-ink">What we can stop doing</h2>
        <p className="mt-3">
          We may end an account that is being used to break the law, to attack the service, or to
          resell access. If that happens you will be told why, and any unused part of a paid
          period will be refunded.
        </p>
        <p className="mt-3">
          The app itself is not remotely disabled. It is software on your machine and it keeps
          running; what ends is the account and the Pro limits attached to it.
        </p>

        <h2 className="mt-10 text-[19px] text-ink">What is not promised</h2>
        <p className="mt-3">
          The software is provided as it is. It is tested and it is used daily by the people who
          make it, but it is not promised to be free of defects, to suit a particular purpose, or
          to be available without interruption.
        </p>
        <p className="mt-3">
          Where the law allows a limit on liability, ours is the amount you paid in the twelve
          months before the problem. Where the law does not allow that — and in several countries
          it does not, particularly for consumers — the law wins and this paragraph does not apply
          to you.
        </p>

        <h2 className="mt-10 text-[19px] text-ink">Changes to these terms</h2>
        <p className="mt-3">
          If these change in a way that matters, subscribers will be told by email before it takes
          effect, and the date at the top of this page will move. Continuing to use the app after
          that is acceptance; if you would rather not, cancel and the refund page applies.
        </p>
      </section>
    </PageShell>
  );
}
