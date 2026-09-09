import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { SELLER, UPDATED, MERCHANT } from "@/content/legal";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What Mochi stores, what never leaves your machine, and how to get rid of it.",
  alternates: { canonical: "/privacy" },
};

/**
 * Written from the schema rather than from a template.
 *
 * Every table named here is a table that exists, and the list of what is not
 * collected is the more useful half: a local-first product's privacy policy is
 * mostly a description of data that never moves, and saying so precisely is
 * worth more than a page of hedged generalities about "your data".
 */
export default function PrivacyPage() {
  return (
    <PageShell
      kicker="Privacy"
      title="What leaves your machine, and what does not"
      sub={`Last updated ${UPDATED}. Mochi is local-first: your tables are files on your disk, and this page is mostly a list of the few things that are not.`}
    >
      <section className="mx-auto max-w-[68ch] px-5 pb-28 pt-16 text-[15px] leading-relaxed text-ink-2 sm:px-8 md:pb-36">
        <h2 className="text-[19px] text-ink">Your workspaces never leave your machine</h2>
        <p className="mt-3">
          Tables, rows, cell values, column names, attachments and history live in SQLite files
          on your own disk. The app has no upload path for them: nothing in it sends a row
          anywhere, and no server here has anywhere to put one. If you delete the file, the data
          is gone — there is no copy here to ask us for.
        </p>
        <p className="mt-3">
          This is a design constraint rather than a promise about intentions. The app opens four
          kinds of outbound connection and no others: your account, the plan-limit document, the
          version check, and feedback you type and send deliberately. Each is described below.
        </p>

        <h2 className="mt-10 text-[19px] text-ink">What we store, in full</h2>
        <p className="mt-3">This is the complete list. Nothing is stored that is not named here.</p>
        <ul className="mt-3 flex list-disc flex-col gap-2 pl-5">
          <li>
            <strong className="text-ink">Your email address</strong>, from signing in with Google.
            It identifies your account and is what a licence is attached to. We receive your email
            from Google and nothing else — not your name, not your profile picture, not your
            contacts.
          </li>
          <li>
            <strong className="text-ink">Your subscription status</strong>: an identifier from{" "}
            {MERCHANT.name}, whether it is active, how many seats, and when the current period
            ends. No card number, no billing address, no payment history.
          </li>
          <li>
            <strong className="text-ink">A weekly count of agent calls</strong>, so a plan limit
            can be enforced. A number per week — not what the calls did, not which tables they
            touched.
          </li>
          <li>
            <strong className="text-ink">Sign-in sessions</strong>: a hash of each session token,
            when it was created, when it was last used, and a short label taken from the browser
            or app that signed in. The token itself is never stored, only its hash.
          </li>
          <li>
            <strong className="text-ink">Feedback you send</strong>, if you send any: what you
            wrote, plus the app version and platform so a bug report can be placed. Sent only when
            you press the button that says so.
          </li>
        </ul>

        <h2 className="mt-10 text-[19px] text-ink">What we never receive</h2>
        <ul className="mt-3 flex list-disc flex-col gap-2 pl-5">
          <li>The contents of your tables, or their names, or the names of your workspaces.</li>
          <li>Files you attach. They are copied into your workspace folder on your disk.</li>
          <li>Card numbers. {MERCHANT.name} is the merchant of record and handles payment; we
            are told only that a subscription exists.</li>
          <li>Analytics of how you use the app. There is no telemetry in it.</li>
        </ul>

        <h2 className="mt-10 text-[19px] text-ink">The version check</h2>
        <p className="mt-3">
          The app asks this site whether a newer build exists. That request carries no account and
          nothing about your machine — the answer is the same for everybody, so there is nothing
          to say. As with any HTTP request, the server sees the IP address it came from.
        </p>

        <h2 className="mt-10 text-[19px] text-ink">How long it is kept</h2>
        <p className="mt-3">
          Account and subscription records last as long as the account. Sign-in sessions end when
          you sign out, when you end them from your profile, or when a new machine signs in past
          the limit. Weekly usage counts are kept for the current and previous periods so a limit
          can be shown and reset. Feedback is kept until it has been acted on.
        </p>

        <h2 className="mt-10 text-[19px] text-ink">Getting rid of it</h2>
        <p className="mt-3">
          Write to {SELLER.privacyEmail} and ask. We will delete the account, its email address,
          its sessions and its usage counts. Records {MERCHANT.name} must keep for tax purposes
          are theirs rather than ours, and their policy governs those.
        </p>
        <p className="mt-3">
          You can also ask for a copy of everything above, or for a correction. If you are in the
          EU or UK, those are rights you have rather than favours we grant.
        </p>

        <h2 className="mt-10 text-[19px] text-ink">Who to write to</h2>
        <p className="mt-3">
          {SELLER.name}
          <br />
          {SELLER.address}
          <br />
          {SELLER.privacyEmail}
        </p>
      </section>
    </PageShell>
  );
}
