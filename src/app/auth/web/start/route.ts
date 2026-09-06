import { NextResponse } from 'next/server';
import { authorizeUrl } from '@/lib/service/google.ts';
import { newSecret, rememberState } from '@/lib/service/web.ts';

export const runtime = 'nodejs';

/**
 * Sign-in for the profile page. Deliberately a different door from the app's:
 * the app's flow hands back a refresh token, this one hands back a session
 * that can read a profile and nothing more.
 *
 * The `web:` prefix is what tells the shared callback which of the two it is
 * looking at, and the nonce in the cookie is what stops a callback somebody
 * else triggered from signing this browser in.
 */
export async function GET(request: Request) {
  try {
    const nonce = newSecret();
    await rememberState(nonce);
    return NextResponse.redirect(authorizeUrl(`web:${nonce}`));
  } catch (error) {
    // Google is not configured, or the database is unreachable. Every other
    // route here answers that with something a caller can render rather than
    // a stack trace, and a sign-in button is the worst place to break that
    // rule: the person clicking it has done nothing wrong.
    console.error('[site] could not start web sign-in', error);
    return NextResponse.redirect(new URL('/profile?status=unavailable', request.url));
  }
}
