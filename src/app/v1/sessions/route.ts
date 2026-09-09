import { NextResponse } from 'next/server';
import {
  accountForRefreshToken,
  listSessions,
  revokeSession,
  sessionIdFor,
  tokenRefusal,
} from '@/lib/service/tokens.ts';
import { env } from '@/lib/service/env.ts';
import { bearer, fail, guarded } from '@/lib/service/http.ts';

export const runtime = 'nodejs';

/**
 * The machines signed in to this account.
 *
 * Exists so that being signed out is something a person can see coming and
 * act on, rather than something that happens to them. The limit evicts the
 * least recently used session, and without a list of them that eviction is
 * indistinguishable from the app breaking.
 *
 * Ids here are the stored hash of each token. That identifies a session well
 * enough to end it and is not a token, so this list is safe to hand back to
 * the machine that asked.
 */
export async function GET(request: Request) {
  return guarded(async () => {
    const token = bearer(request);
    if (!token) return fail(401, 'no_token', 'sign in first');
    const accountId = await accountForRefreshToken(token);
    if (!accountId) {
      const refusal = await tokenRefusal(token);
      return fail(401, refusal.code, refusal.message);
    }

    const mine = sessionIdFor(token);
    return NextResponse.json({
      limit: env.sessionLimit,
      sessions: (await listSessions(accountId)).map((session) => ({
        ...session,
        // Marked rather than guessed: reading the token just updated
        // `last_used_at`, so picking the most recent row would call every
        // caller the current one.
        current: session.id === mine,
      })),
    });
  });
}

/** Ends one session. The caller's own is allowed: that is just signing out. */
export async function DELETE(request: Request) {
  return guarded(async () => {
    const token = bearer(request);
    if (!token) return fail(401, 'no_token', 'sign in first');
    const accountId = await accountForRefreshToken(token);
    if (!accountId) {
      const refusal = await tokenRefusal(token);
      return fail(401, refusal.code, refusal.message);
    }

    const id = new URL(request.url).searchParams.get('id');
    if (!id) return fail(400, 'no_session', 'which session?');
    if (!(await revokeSession(accountId, id))) {
      return fail(404, 'unknown_session', 'no session by that id on this account');
    }
    return NextResponse.json({ revoked: true });
  });
}
