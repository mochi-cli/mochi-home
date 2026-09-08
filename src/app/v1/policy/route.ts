import { NextResponse } from 'next/server';
import { buildPolicy, signPolicy } from '@/lib/service/policy.ts';
import { fail } from '@/lib/service/http.ts';

export const runtime = 'nodejs';

/**
 * The limits, signed, for anyone who asks.
 *
 * No authentication, and deliberately nothing to authenticate: the request
 * carries no account, no machine, no workspace — it is a GET that says only
 * "what are the numbers". The answer is the same for everybody, which is why
 * it can be cached and why it does not need to know who asked.
 *
 * Signed because it is not authenticated. Anything that can answer as this
 * host could otherwise set somebody's limits; a signature the app checks
 * against keys compiled into it means the worst a hostile answer can do is be
 * ignored.
 */
export async function GET() {
  try {
    const signed = await signPolicy(buildPolicy());
    return NextResponse.json(signed, {
      headers: {
        // An hour at the edge. The app asks about once a day, so this exists
        // for the case where many of them ask at once, not for freshness.
        'cache-control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('[service] could not sign the policy', error);
    // Not a 200 with an empty policy: "we have nothing to say" and "we could
    // not answer" send the app down different paths, and only one of them
    // should make it forget what it was last told.
    return fail(503, 'policy_unavailable', 'could not sign the policy document');
  }
}
