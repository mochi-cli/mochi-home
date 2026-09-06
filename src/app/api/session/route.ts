import { NextResponse } from 'next/server';
import { currentSubscription, planFor } from '@/lib/service/billing.ts';
import { currentAccount } from '@/lib/service/web.ts';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * What the browser is allowed to know about itself.
 *
 * The nav has to say "Log in" or "Account", and it is a client component that
 * cannot read an httpOnly cookie. Reading the session on the server instead
 * would make every page dynamic — the home page is a marketing page that wants
 * to stay static — so the nav asks this once after it mounts.
 *
 * Deliberately not under /v1: that path is the CLI's published API, and this
 * is a browser convenience that should be free to change.
 *
 * Nothing here is a secret the caller does not already hold. It is gated by
 * their own cookie and returns their own email and plan.
 */
export async function GET() {
  const nothing = NextResponse.json(
    { signedIn: false },
    { headers: { 'cache-control': 'no-store' } }
  );

  try {
    const account = await currentAccount();
    if (!account) return nothing;

    const { plan } = planFor(await currentSubscription(account.id));
    return NextResponse.json(
      { signedIn: true, email: account.email, plan },
      { headers: { 'cache-control': 'no-store' } }
    );
  } catch (error) {
    // A nav that cannot reach the database should render signed out, not break
    // the page it sits on.
    console.error('[site] could not read the session', error);
    return nothing;
  }
}
