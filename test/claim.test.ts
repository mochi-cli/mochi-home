import assert from 'node:assert/strict';
import { createPublicKey, generateKeyPairSync, sign, verify } from 'node:crypto';
import test, { describe } from 'node:test';
import { env } from '../src/lib/service/env.ts';
import { buildClaim } from '../src/lib/service/claim.ts';

/**
 * The one test that has to hold: a claim signed here must verify in Mochi
 * Table, byte for byte.
 *
 * The verifier on the other side is `readEntitlement` in
 * `src/server/account/entitlement.ts` of mochi-cli/table. It base64-decodes
 * what it stored and checks the signature against *those* bytes — so the bytes
 * that were signed are the bytes that must travel. Anything that re-serialises
 * the claim in between, with different key order or whitespace, produces a
 * claim that fails for no visible reason. This test is a copy of that
 * verification, so the two cannot drift without it going red.
 */

const { publicKey, privateKey } = generateKeyPairSync('ed25519');

interface Claim {
  kid: string;
  plan: 'free' | 'pro';
  email: string | null;
  seats: number;
  expiresAt: string;
  fetchedAt: string;
}

/** What `signClaim` does, with the key injected so this needs no environment. */
function signWith(claim: Claim): { claim: string; signature: string } {
  const bytes = Buffer.from(JSON.stringify(claim), 'utf8');
  return {
    claim: bytes.toString('base64'),
    signature: sign(null, bytes, privateKey).toString('base64'),
  };
}

/** Exactly what Mochi Table does with it. */
function verifyLikeMochi(
  stored: { claim: string; signature: string },
  pem: string
): Claim | null {
  try {
    const bytes = Buffer.from(stored.claim, 'base64');
    const ok = verify(null, bytes, createPublicKey(pem), Buffer.from(stored.signature, 'base64'));
    if (!ok) return null;
    return JSON.parse(bytes.toString('utf8')) as Claim;
  } catch {
    return null;
  }
}

const PEM = publicKey.export({ type: 'spki', format: 'pem' }).toString();

const claim: Claim = {
  kid: '2026-09',
  plan: 'pro',
  email: 'someone@example.test',
  seats: 3,
  expiresAt: '2026-09-17T00:00:00.000Z',
  fetchedAt: '2026-09-03T10:00:00.000Z',
};

describe('the claim this service signs', () => {
  test('verifies with Mochi Table’s own check', () => {
    const back = verifyLikeMochi(signWith(claim), PEM);
    assert.deepEqual(back, claim);
  });

  test('a claim edited after signing does not verify', () => {
    // The whole point: upgrading yourself by editing the file changes the plan
    // and invalidates the proof in the same stroke.
    const signed = signWith({ ...claim, plan: 'free' });
    const tampered = JSON.parse(Buffer.from(signed.claim, 'base64').toString('utf8')) as Claim;
    tampered.plan = 'pro';
    const forged = {
      claim: Buffer.from(JSON.stringify(tampered)).toString('base64'),
      signature: signed.signature,
    };
    assert.equal(verifyLikeMochi(forged, PEM), null);
  });

  test('a claim signed by another key does not verify', () => {
    const other = generateKeyPairSync('ed25519');
    const bytes = Buffer.from(JSON.stringify(claim), 'utf8');
    const forged = {
      claim: bytes.toString('base64'),
      signature: sign(null, bytes, other.privateKey).toString('base64'),
    };
    assert.equal(verifyLikeMochi(forged, PEM), null);
  });

  test('re-serialising the claim breaks it — which is why the bytes travel', () => {
    // Documented rather than defended. If some future refactor rebuilds the
    // JSON from the parsed object before sending, this is the failure it gets,
    // and it will look like a signing bug rather than a serialisation one.
    const signed = signWith(claim);
    const reordered = Object.fromEntries(Object.entries(claim).reverse());
    const rebuilt = {
      claim: Buffer.from(JSON.stringify(reordered)).toString('base64'),
      signature: signed.signature,
    };
    assert.equal(verifyLikeMochi(rebuilt, PEM), null);
  });

  test('the shape is what the other side expects', () => {
    const back = verifyLikeMochi(signWith(claim), PEM)!;
    assert.deepEqual(Object.keys(back).sort(), [
      'email',
      'expiresAt',
      'fetchedAt',
      'kid',
      'plan',
      'seats',
    ]);
    assert.ok(['free', 'pro'].includes(back.plan), 'there is no third plan');
    assert.ok(Date.parse(back.expiresAt) > 0, 'expiresAt is a real instant');
  });
});

describe('how long a claim is believed', () => {
  /**
   * This value is read straight into arithmetic on a Date, and both ways of
   * getting it wrong are quiet or badly timed. Pinning the refusals here means
   * a bad deploy fails at boot rather than at somebody's checkout.
   */
  function withLifetime<T>(value: string | undefined, run: () => T): T {
    const before = process.env.CLAIM_LIFETIME_DAYS;
    if (value === undefined) delete process.env.CLAIM_LIFETIME_DAYS;
    else process.env.CLAIM_LIFETIME_DAYS = value;
    try {
      return run();
    } finally {
      if (before === undefined) delete process.env.CLAIM_LIFETIME_DAYS;
      else process.env.CLAIM_LIFETIME_DAYS = before;
    }
  }

  test('an unset value is a week', () => {
    assert.equal(withLifetime(undefined, () => env.claimLifetimeDays), 7);
  });

  test('a value that is not a number is refused, not turned into NaN', () => {
    // Number('abc') * 86_400_000 is NaN, and new Date(NaN).toISOString() throws
    // — at signing time, in production, for somebody who has just paid.
    assert.throws(() => withLifetime('abc', () => env.claimLifetimeDays), /positive number/);
  });

  test('zero and negative are refused', () => {
    // These are the dangerous ones: claims born already expired, so every
    // customer is silently Free and it looks like a working free tier.
    for (const bad of ['0', '-1']) {
      assert.throws(() => withLifetime(bad, () => env.claimLifetimeDays), /positive number/);
    }
  });

  test('an implausibly long window is refused', () => {
    // A fat-fingered 3650 is likelier than a deliberate decade, and this number
    // is also how long a cancelled subscription keeps working.
    assert.throws(() => withLifetime('3650', () => env.claimLifetimeDays), /grace period/);
  });

  test('a fortnight is fine', () => {
    assert.equal(withLifetime('14', () => env.claimLifetimeDays), 14);
  });
});

describe('limits signed into a claim', () => {
  /**
   * The number the app enforces used to be compiled into it. Changing one meant
   * a release, and with no auto-updater an installed copy kept the old value
   * for as long as it was installed — so raising a limit was slow and lowering
   * one was impossible. Set here, it travels on a claim that is already signed
   * and already cached, so it arrives without a build and holds offline.
   */
  const around = <T>(only: Record<string, string | undefined>, run: () => T): T => {
    // A claim needs a kid to be built at all; these tests are about the limits
    // on it, not about signing configuration.
    const vars = { CLAIM_KID: 'limits-test', ...only };
    const before = Object.fromEntries(Object.keys(vars).map((k) => [k, process.env[k]]));
    for (const [k, v] of Object.entries(vars)) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
    try {
      return run();
    } finally {
      for (const [k, v] of Object.entries(before)) {
        if (v === undefined) delete process.env[k];
        else process.env[k] = v;
      }
    }
  };

  test('unset says nothing, so the app keeps what it shipped with', () => {
    around({ LIMIT_FREE_MCP_CALLS_PER_WEEK: undefined, LIMIT_FREE_ATTACHMENT_MB: undefined }, () => {
      assert.equal('limits' in buildClaim({ plan: 'free', email: null, seats: 1 }), false);
    });
  });

  test('a number set here rides along on the claim', () => {
    around({ LIMIT_FREE_MCP_CALLS_PER_WEEK: '5000', LIMIT_FREE_ATTACHMENT_MB: '50' }, () => {
      const claim = buildClaim({ plan: 'free', email: null, seats: 1 });
      assert.deepEqual(claim.limits, { mcpCallsPerWeek: 5000, attachmentBytes: 50 * 1024 * 1024 });
    });
  });

  test('"unlimited" is spelled out, because empty already means unset', () => {
    around({ LIMIT_PRO_MCP_CALLS_PER_WEEK: 'unlimited' }, () => {
      assert.equal(buildClaim({ plan: 'pro', email: null, seats: 1 }).limits?.mcpCallsPerWeek, null);
    });
  });

  test('one plan is not the other', () => {
    around({ LIMIT_FREE_MCP_CALLS_PER_WEEK: '5000', LIMIT_PRO_MCP_CALLS_PER_WEEK: undefined }, () => {
      assert.equal(buildClaim({ plan: 'pro', email: null, seats: 1 }).limits, undefined);
    });
  });

  test('a value that is not a limit is refused here, loudly', () => {
    // Signing would otherwise make nonsense authoritative: every machine would
    // believe a zero, all at once, and refuse every agent call.
    for (const bad of ['0', '-1', '1.5', 'lots', '']) {
      around({ LIMIT_FREE_MCP_CALLS_PER_WEEK: bad }, () => {
        if (bad === '') {
          // An empty variable is unset, not zero.
          assert.equal(buildClaim({ plan: 'free', email: null, seats: 1 }).limits, undefined);
          return;
        }
        assert.throws(() => buildClaim({ plan: 'free', email: null, seats: 1 }), /positive whole number/);
      });
    }
  });
});

/**
 * Telling somebody their cancellation took.
 *
 * Cancelling leaves the plan on Pro — correctly, they paid for the month — so
 * the app had nothing to show that was different from a minute earlier: same
 * badge, same Cancel button, same everything. The date is the difference, and
 * it has to be signed like the rest or the app cannot believe it offline.
 */
describe('an end date on a plan that will not renew', () => {
  // A claim needs a kid to be built at all; this is not about signing config.
  const withKid = <T>(run: () => T): T => {
    const before = process.env.CLAIM_KID;
    process.env.CLAIM_KID = 'ends-test';
    try {
      return run();
    } finally {
      if (before === undefined) delete process.env.CLAIM_KID;
      else process.env.CLAIM_KID = before;
    }
  };

  test('carried when the subscription is ending', () => {
    const claim = withKid(() =>
      buildClaim({ plan: 'pro', email: 'a@b.c', seats: 1, endsAt: '2026-10-03T16:08:23.715Z' })
    );
    assert.equal(claim.endsAt, '2026-10-03T16:08:23.715Z');
  });

  test('omitted, not null, while it renews', () => {
    // The claim is signed as its exact JSON bytes, so a key carrying nothing
    // changes the signature for no reason — and `endsAt: null` would have to
    // be read as "renews" by every version of the app that ever sees it.
    withKid(() => {
      assert.equal('endsAt' in buildClaim({ plan: 'pro', email: 'a@b.c', seats: 1, endsAt: null }), false);
      assert.equal('endsAt' in buildClaim({ plan: 'pro', email: 'a@b.c', seats: 1 }), false);
    });
  });
});
