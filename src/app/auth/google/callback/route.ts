import { NextResponse } from 'next/server';
import { completeSession } from '@/lib/service/codes.ts';
import { upsertAccount } from '@/lib/service/db.ts';
import { emailFromCode } from '@/lib/service/google.ts';
import { env } from '@/lib/service/env.ts';
import { startWebSession, takeState } from '@/lib/service/web.ts';

export const runtime = 'nodejs';

/**
 * Where Google sends the browser back to.
 *
 * The only thing this hands the browser afterwards is a page saying it can be
 * closed. No token, no claim, nothing worth stealing lands in a tab — which is
 * what removes the usual web token-theft surface entirely: there is nothing in
 * the page to take.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const googleCode = url.searchParams.get('code');
  const ourCode = url.searchParams.get('state');

  const back = (status: string) =>
    NextResponse.redirect(`${env.origin}/signed-in?status=${status}`);

  if (!googleCode || !ourCode) return back('failed');

  const email = await emailFromCode(googleCode).catch(() => null);
  if (!email) return back('failed');

  // The profile page's own flow. It never issues a refresh token: the browser
  // gets a session that can read one account and nothing else.
  if (ourCode.startsWith('web:')) {
    const expected = await takeState();
    // A callback this browser did not start. Consuming the state above means a
    // replay of the same link fails too.
    if (!expected || expected !== ourCode.slice(4)) return back('failed');
    try {
      const account = await upsertAccount(email);
      await startWebSession(account.id);
    } catch (error) {
      // Everything else in this flow answers with a page. Letting the database
      // throw through here means somebody who did nothing wrong gets a raw 500
      // at the end of a sign-in, with nothing to do about it.
      console.error('[service] web sign-in failed', error);
      return back('failed');
    }
    return NextResponse.redirect(`${env.origin}/profile`);
  }

  // The session may have expired while the person was choosing an account.
  const ok = await completeSession(ourCode, email);
  return back(ok ? 'ok' : 'expired');
}
