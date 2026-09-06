import type { Metadata } from "next";
import { sql } from "@/lib/service/db.ts";
import { currentSubscription, planFor } from "@/lib/service/billing.ts";
import { currentAccount } from "@/lib/service/web.ts";
import PageShell from "@/components/PageShell";
import { openCheckout, openPortal, signOut } from "./actions";

export const metadata: Metadata = {
  title: "Your account",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/** The current ISO week, the same key the app reports usage under. */
function thisWeek(): string {
  const now = new Date();
  const target = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const day = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((target.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${target.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 border-b border-line py-5 sm:grid-cols-[14rem_minmax(0,1fr)] sm:gap-8">
      <dt className="text-[15px] text-ink-2">{label}</dt>
      <dd className="text-[15px] text-ink">{children}</dd>
    </div>
  );
}

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const account = await currentAccount().catch(() => null);

  if (!account) {
    return (
      <PageShell
        kicker="Account"
        title="Sign in to see your plan"
        sub="This shows your email, what you are on, and how much the agents have been asking for. It never shows what is in your tables, because this service has never seen them."
      >
        <section className="mx-auto max-w-[1280px] px-5 pb-28 pt-12 sm:px-8 md:pb-36">
          {status === "unavailable" ? (
            <p className="max-w-[52ch] text-[15px] text-ink-2">
              Sign-in is not available right now. Nothing was changed, and the app on your machine
              carries on working without it.
            </p>
          ) : (
            <a
              href="/auth/web/start"
              className="inline-flex h-11 items-center justify-center rounded-[var(--r)] bg-ink px-6 text-[15px] text-ink-inv transition-opacity hover:opacity-88 active:translate-y-px"
            >
              Sign in with Google
            </a>
          )}
        </section>
      </PageShell>
    );
  }

  const subscription = await currentSubscription(account.id);
  const { plan, seats } = planFor(subscription);
  const usage = await sql()`
    SELECT mcp_calls FROM usage WHERE account_id = ${account.id} AND week = ${thisWeek()}
  `;
  const calls = (usage[0]?.mcp_calls as number | undefined) ?? 0;

  return (
    <PageShell
      kicker="Account"
      title={plan === "pro" ? "You are on Pro" : "You are on the free plan"}
      sub="Everything below is what this service knows about you. It has never seen a row of your data."
    >
      <section className="mx-auto max-w-[1280px] px-5 pb-28 pt-12 sm:px-8 md:pb-36">
        <dl className="border-t border-line">
          <Row label="Signed in as">{account.email}</Row>
          <Row label="Plan">{plan === "pro" ? "Pro" : "Free"}</Row>
          <Row label="Seats">{seats}</Row>
          {subscription && (
            <Row label="Status">
              <span className="mono text-[14px]">{subscription.status}</span>
            </Row>
          )}
          <Row label="Agent calls this week">
            <span className="mono tabular-nums">{calls.toLocaleString("en-US")}</span>
          </Row>
        </dl>

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
          {plan === "pro" ? (
            <form action={openPortal}>
              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center rounded-[var(--r)] bg-ink px-6 text-[15px] text-ink-inv transition-opacity hover:opacity-88 active:translate-y-px"
              >
                Manage billing
              </button>
            </form>
          ) : (
            <form action={openCheckout}>
              <input type="hidden" name="cadence" value="monthly" />
              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center rounded-[var(--r)] bg-ink px-6 text-[15px] text-ink-inv transition-opacity hover:opacity-88 active:translate-y-px"
              >
                Get Pro
              </button>
            </form>
          )}

          <form action={signOut}>
            <button
              type="submit"
              className="text-[15px] text-ink-2 underline-offset-4 transition-colors hover:text-ink hover:underline"
            >
              Sign out
            </button>
          </form>
        </div>
      </section>
    </PageShell>
  );
}
