import { createHash, randomBytes } from 'node:crypto';
import { cookies } from 'next/headers';
import { sql } from './db.ts';

/**
 * The browser's half of sign-in, kept apart from the app's.
 *
 * `auth/google/callback` says it plainly: nothing worth stealing lands in a
 * tab, and that is what removes the usual web token-theft surface. A profile
 * page needs *something* in the browser, so this is the smallest thing that
 * works: a random id, hashed at rest, good for twelve hours, that can read one
 * account's email, plan and usage and do nothing else. It is not a refresh
 * token and cannot be exchanged for one.
 */

export const SESSION_COOKIE = 'mochi_web';
export const STATE_COOKIE = 'mochi_web_state';
const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;

function hash(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

export function newSecret(): string {
  return randomBytes(32).toString('base64url');
}

/** Shared by both cookies: httpOnly so script cannot read them, lax so the
 *  redirect back from Google still carries them. */
function cookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: maxAgeSeconds,
  };
}

export async function startWebSession(accountId: string): Promise<void> {
  const secret = newSecret();
  const expires = new Date(Date.now() + TWELVE_HOURS_MS);
  await sql()`
    INSERT INTO web_sessions (id_sha256, account_id, expires_at)
    VALUES (${hash(secret)}, ${accountId}, ${expires.toISOString()})
  `;
  (await cookies()).set(SESSION_COOKIE, secret, cookieOptions(TWELVE_HOURS_MS / 1000));
}

/** The account this browser is signed in as, or null. Expired rows never
 *  match, so a stale cookie is the same as no cookie. */
export async function currentAccount(): Promise<{ id: string; email: string } | null> {
  const secret = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!secret) return null;
  const rows = await sql()`
    SELECT a.id, a.email
      FROM web_sessions s
      JOIN accounts a ON a.id = s.account_id
     WHERE s.id_sha256 = ${hash(secret)} AND s.expires_at > now()
  `;
  const row = rows[0];
  return row ? { id: row.id as string, email: row.email as string } : null;
}

export async function endWebSession(): Promise<void> {
  const jar = await cookies();
  const secret = jar.get(SESSION_COOKIE)?.value;
  if (secret) await sql()`DELETE FROM web_sessions WHERE id_sha256 = ${hash(secret)}`;
  jar.delete(SESSION_COOKIE);
}

/** A nonce that has to come back from Google unchanged, so a stray callback
 *  cannot sign somebody into an account they did not ask for. */
export async function rememberState(state: string): Promise<void> {
  (await cookies()).set(STATE_COOKIE, state, cookieOptions(10 * 60));
}

export async function takeState(): Promise<string | null> {
  const jar = await cookies();
  const value = jar.get(STATE_COOKIE)?.value ?? null;
  jar.delete(STATE_COOKIE);
  return value;
}
