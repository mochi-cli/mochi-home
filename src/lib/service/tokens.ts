import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { sql } from './db.ts';
import { env } from './env.ts';

/**
 * The refresh token a machine keeps so it can ask for a fresh claim.
 *
 * Only a hash is stored. The raw value is shown once, at sign-in, and never
 * needed again — so a leaked database hands somebody a list of hashes rather
 * than a list of working tokens.
 *
 * Deliberately not a Google token. This opens exactly one thing: the plan on
 * one account. Somebody who takes it off a laptop learns that that person has
 * Pro, which is roughly what it is worth.
 */

function hash(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/**
 * A session, and room for it.
 *
 * Seats are counted per person, so one person on several machines is fine and
 * a cap here is not the unit of sale — it is what stops one email being shared
 * by a team who would otherwise buy one seat between them. Set it wide enough
 * that nobody legitimate meets it.
 *
 * Over the cap, the least recently used session goes rather than this refusing
 * the new one. Somebody standing at a new machine cannot fix a refusal from
 * there, and telling them to go and find an old laptop is not a product.
 *
 * The evicted machine gets a row in `revoked_tokens`, so when its next refresh
 * fails it can say why. Signing somebody out in silence is the failure this
 * project keeps finding, and doing it deliberately would be worse.
 */
export async function issueRefreshToken(
  accountId: string,
  label: string | null = null
): Promise<string> {
  const token = `mrt_${randomBytes(32).toString('base64url')}`;
  await sql()`
    INSERT INTO refresh_tokens (token_sha256, account_id, label)
    VALUES (${hash(token)}, ${accountId}, ${label})
  `;

  const spare = await sql()`
    WITH ranked AS (
      SELECT token_sha256,
             row_number() OVER (
               ORDER BY coalesce(last_used_at, created_at) DESC, created_at DESC
             ) AS position
        FROM refresh_tokens
       WHERE account_id = ${accountId}
    )
    DELETE FROM refresh_tokens
     WHERE token_sha256 IN (SELECT token_sha256 FROM ranked WHERE position > ${env.sessionLimit})
    RETURNING token_sha256
  `;

  for (const row of spare) {
    await sql()`
      INSERT INTO revoked_tokens (token_sha256, account_id, reason)
      VALUES (${row.token_sha256 as string}, ${accountId}, 'signed_in_elsewhere')
      ON CONFLICT (token_sha256) DO NOTHING
    `;
  }

  return token;
}

/**
 * Which row in the session list is this caller's own.
 *
 * The same hash the table is keyed by, so the interface can mark one row as
 * "this machine" without the caller having to guess from timestamps — and it
 * would guess wrong, because reading the token updates `last_used_at` and
 * makes every caller look like the most recent one.
 */
export function sessionIdFor(token: string): string {
  return hash(token);
}

/** Sessions on an account, most recently used first. */
export async function listSessions(accountId: string): Promise<
  Array<{ id: string; label: string | null; createdAt: string; lastUsedAt: string | null }>
> {
  const rows = await sql()`
    SELECT token_sha256, label, created_at, last_used_at
      FROM refresh_tokens
     WHERE account_id = ${accountId}
     ORDER BY coalesce(last_used_at, created_at) DESC
  `;
  return rows.map((row) => ({
    // The hash, not the token: it identifies a session for revoking without
    // being usable as one.
    id: row.token_sha256 as string,
    label: (row.label as string | null) ?? null,
    createdAt: row.created_at as string,
    lastUsedAt: (row.last_used_at as string | null) ?? null,
  }));
}

/** Ends one session by its id, if it belongs to this account. */
export async function revokeSession(accountId: string, id: string): Promise<boolean> {
  const rows = await sql()`
    DELETE FROM refresh_tokens
     WHERE token_sha256 = ${id} AND account_id = ${accountId}
    RETURNING token_sha256
  `;
  if (rows.length === 0) return false;
  await sql()`
    INSERT INTO revoked_tokens (token_sha256, account_id, reason)
    VALUES (${id}, ${accountId}, 'signed_out_remotely')
    ON CONFLICT (token_sha256) DO NOTHING
  `;
  return true;
}

/**
 * What to tell a machine whose token no longer works.
 *
 * "Sign in again" is true of all three cases and useful in none of them. A
 * person whose laptop signed itself out wants to know that it was their own
 * fourth machine that did it, not to wonder whether the product is broken.
 */
export function refusalFor(reason: string | null): { code: string; message: string } {
  switch (reason) {
    case 'signed_in_elsewhere':
      return {
        code: 'signed_in_elsewhere',
        message:
          'this machine was signed out because the account reached its limit of signed-in machines — sign in again here, and the least recently used one will go instead',
      };
    case 'signed_out_remotely':
      return {
        code: 'signed_out_remotely',
        message: 'this machine was signed out from your profile on another machine',
      };
    default:
      return { code: 'unknown_token', message: 'sign in again' };
  }
}

/** The same answer, for a caller holding a token rather than a reason. */
export async function tokenRefusal(token: string): Promise<{ code: string; message: string }> {
  return refusalFor(await revocationReason(token));
}

/** Why a token stopped working, when we know. Null for one never seen. */
export async function revocationReason(token: string): Promise<string | null> {
  const rows = await sql()`SELECT reason FROM revoked_tokens WHERE token_sha256 = ${hash(token)}`;
  return (rows[0]?.reason as string | undefined) ?? null;
}

export async function accountForRefreshToken(token: string): Promise<string | null> {
  const rows = await sql()`
    UPDATE refresh_tokens SET last_used_at = now()
     WHERE token_sha256 = ${hash(token)}
     RETURNING account_id
  `;
  return (rows[0]?.account_id as string | undefined) ?? null;
}

export async function revokeRefreshToken(token: string): Promise<void> {
  await sql()`DELETE FROM refresh_tokens WHERE token_sha256 = ${hash(token)}`;
}

/** Constant-time, for comparing a PKCE challenge without leaking by timing. */
export function sameSecret(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}
