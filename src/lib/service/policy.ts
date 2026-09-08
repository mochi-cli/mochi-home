import { env } from './env.ts';
import { signBytes } from './claim.ts';

/**
 * Numbers this service can change for every install, signed in or not.
 *
 * A claim carries limits too, and for a signed-in account that is the better
 * channel: it is per-account, and it arrives on a message the app already
 * fetches. This exists for the people a claim cannot reach — anyone who has not
 * signed in, which on the free tier is most of them. Their copy of the limits
 * was compiled into the build, and with no auto-updater it stayed there.
 *
 * Signed with the same key as a claim, and verified against the same keys the
 * app ships with, because it is fetched over a connection nobody authenticates:
 * without a signature this would be a way for anything that can answer as this
 * host to set somebody's limits.
 */
export interface Policy {
  /** When this was produced. The app prefers the newest it has seen. */
  issuedAt: string;
  /** After this, the app stops believing it and falls back to what it shipped with. */
  expiresAt: string;
  limits: {
    free?: { mcpCallsPerWeek?: number | null; attachmentBytes?: number };
    pro?: { mcpCallsPerWeek?: number | null; attachmentBytes?: number };
  };
}

export interface SignedPolicy {
  /** Base64 of the exact UTF-8 JSON bytes that were signed. */
  policy: string;
  /** Base64 Ed25519 signature over those bytes. */
  signature: string;
  /** Which key signed it, so a compromised one can be retired. */
  kid: string;
}

/**
 * How long a fetched policy is believed.
 *
 * Long enough that an app which cannot reach this service for a few days keeps
 * working on the last thing it was told, short enough that a mistake here
 * stops mattering without anyone shipping anything. When it lapses the app
 * returns to the numbers in its own build, which are conservative by
 * construction.
 */
const POLICY_LIFETIME_DAYS = 14;

export function buildPolicy(now = new Date()): Policy {
  return {
    issuedAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + POLICY_LIFETIME_DAYS * 86_400_000).toISOString(),
    limits: {
      // Omitted rather than empty: "we have nothing to say about Free" and
      // "Free is allowed nothing" must not look the same on the wire.
      ...(env.limitsFor('free') ? { free: env.limitsFor('free') } : {}),
      ...(env.limitsFor('pro') ? { pro: env.limitsFor('pro') } : {}),
    },
  };
}

export async function signPolicy(policy: Policy): Promise<SignedPolicy> {
  const bytes = Buffer.from(JSON.stringify(policy), 'utf8');
  return {
    policy: bytes.toString('base64'),
    signature: (await signBytes(bytes)).toString('base64'),
    kid: env.signing.kid,
  };
}
