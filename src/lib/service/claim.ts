import { createPrivateKey, sign as nodeSign } from 'node:crypto';
import { env } from './env.ts';

/**
 * The entitlement claim: what this service says about a machine's plan, and
 * the proof that this service said it.
 *
 * The exact bytes matter. Mochi Table verifies the signature against the
 * base64 it stored, so the JSON that was signed is the JSON that must travel —
 * re-serialising it anywhere in between, with different key order or
 * whitespace, produces a claim that fails verification for no visible reason.
 * `sign()` therefore returns the bytes it signed, and nothing downstream is
 * allowed to rebuild them.
 *
 * See docs/account-service.md in the mochi-cli/table repository, which is the
 * other half of this contract.
 */

export type Plan = 'free' | 'pro';

export interface Claim {
  /** Which key signed this, so a compromised one can be retired. */
  kid: string;
  plan: Plan;
  email: string | null;
  seats: number;
  /** When the app stops believing it — also the offline grace period. */
  expiresAt: string;
  fetchedAt: string;
  /**
   * When Pro ends, on a subscription that will not renew. Absent when it will.
   *
   * Signed like everything else here, so the app can show "Pro until the 3rd"
   * with the network unplugged and without trusting a response body it has no
   * way to check.
   */
  endsAt?: string;
  /**
   * What this account is allowed, when we want to say so.
   *
   * Absent is the normal case: the app uses the numbers it shipped with. Set,
   * it overrides them — signed, so it cannot be edited on the machine that
   * receives it, and cached, so it holds with the network unplugged.
   */
  limits?: { mcpCallsPerWeek?: number | null; attachmentBytes?: number };
}

export interface SignedClaim {
  /** Base64 of the exact UTF-8 JSON bytes that were signed. */
  claim: string;
  /** Base64 Ed25519 signature over those bytes. */
  signature: string;
}

export function buildClaim(input: {
  plan: Plan;
  email: string | null;
  seats: number;
  /**
   * When Pro runs out, for a subscription that will not renew.
   *
   * Null while it renews normally, and omitted from the claim in that case:
   * "no end date" is the ordinary state and does not need saying. Present, it
   * is the one thing the app could not tell a person who had just cancelled —
   * the plan still said Pro, the button still said Cancel, and nothing on
   * screen was different from a minute before.
   */
  endsAt?: string | null;
  now?: Date;
}): Claim {
  const now = input.now ?? new Date();
  const expires = new Date(now.getTime() + env.claimLifetimeDays * 86_400_000);
  const limits = env.limitsFor(input.plan);
  return {
    kid: env.signing.kid,
    plan: input.plan,
    email: input.email,
    seats: input.seats,
    expiresAt: expires.toISOString(),
    fetchedAt: now.toISOString(),
    // Omitted rather than set to undefined: the claim is signed as its exact
    // JSON bytes, and a key with no value would change them for no reason.
    ...(limits ? { limits } : {}),
    ...(input.endsAt ? { endsAt: input.endsAt } : {}),
  };
}

/**
 * Signs with Cloud KMS when configured, which is how this runs in production:
 * the key is generated in KMS and never leaves it, so a credential stolen from
 * this service can ask for signatures until it is revoked but cannot be carried
 * away and used offline afterwards.
 */
async function signWithKms(bytes: Buffer, keyName: string): Promise<Buffer> {
  const { KeyManagementServiceClient } = await import('@google-cloud/kms');
  const client = new KeyManagementServiceClient(kmsCredentials());

  // `data`, not `data_crc32c` plus a digest: the key is EC_SIGN_ED25519, which
  // Cloud KMS documents as "EdDSA on Curve25519 in pure mode (taking data as
  // input)". Ed25519 hashes internally, so pre-hashing here would sign the
  // wrong thing and the app would reject every claim.
  const [result] = await client.asymmetricSign({ name: keyName, data: bytes });
  if (!result.signature) throw new Error('KMS returned no signature');
  return Buffer.from(result.signature as Uint8Array);
}

/**
 * On Google's own infrastructure the client finds its credentials from the
 * metadata server. Vercel has no metadata server, so without this the first
 * signature in production fails with a "Could not load the default
 * credentials" that looks nothing like a configuration mistake.
 */
function kmsCredentials(): { credentials: Record<string, unknown> } | undefined {
  const json = env.signing.serviceAccount;
  if (!json) return undefined;
  try {
    return { credentials: JSON.parse(json) as Record<string, unknown> };
  } catch {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON');
  }
}

/**
 * The development path. Refused in production on purpose: a signing key in an
 * environment variable is one crash dump, one over-broad log line or one
 * over-shared team secret away from being copied, and a copied signing key
 * mints Pro forever and silently.
 */
function signLocally(bytes: Buffer, pem: string): Buffer {
  if (env.isProduction) {
    throw new Error(
      'CLAIM_SIGNING_KEY is for local development only — set CLAIM_KMS_KEY in production'
    );
  }
  return nodeSign(null, bytes, createPrivateKey(pem));
}

/**
 * Signs bytes with whatever key this deployment has.
 *
 * Split out so the policy document signs the same way a claim does, through
 * the same KMS path in production. Two signing routines would be two places to
 * get key handling wrong, and only one of them would be exercised often enough
 * to notice.
 */
export async function signBytes(bytes: Buffer): Promise<Buffer> {
  const { kmsKey, localKey } = env.signing;
  if (kmsKey) return signWithKms(bytes, kmsKey);
  if (localKey) return signLocally(bytes, localKey);
  throw new Error('no signing key configured — set CLAIM_KMS_KEY or CLAIM_SIGNING_KEY');
}

export async function signClaim(claim: Claim): Promise<SignedClaim> {
  const bytes = Buffer.from(JSON.stringify(claim), 'utf8');
  return {
    claim: bytes.toString('base64'),
    signature: (await signBytes(bytes)).toString('base64'),
  };
}

/** The free tier, which is also every failure this service can have. */
export function freeClaim(email: string | null = null): Claim {
  return buildClaim({ plan: 'free', email, seats: 1 });
}
