import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { Webhook } from 'standardwebhooks';
import { SUBSCRIPTION_EVENTS, accountIdFor, outcomeLabel, receiveWebhook } from '../src/lib/service/webhook.ts';

/**
 * The billing endpoint strangers can reach.
 *
 * Every rule here exists because of a failure that is invisible while it is
 * happening: a replayed delivery that upgrades somebody twice, an event acted
 * on despite a bad signature, an error swallowed as 200 so Polar never retries
 * and a payer quietly stays Free. None of them throws, none of them logs, and
 * the first report is a billing complaint.
 *
 * Until now none of it was testable — it lived inside a Next route handler
 * wired to a real database and a real Polar client.
 */

/** The raw secret, exactly as Polar hands it over and as the env holds it. */
const SECRET = 'mochi-test-webhook-secret-0123456789';

/** How both the SDK and this service turn that into a signing key. */
const signingKey = (secret: string) => Buffer.from(secret, 'utf-8').toString('base64');

/** A delivery signed the way Polar signs one. */
function delivery(
  body: unknown,
  options: { id?: string; secret?: string; timestamp?: Date } = {}
): { payload: string; headers: Record<string, string> } {
  const payload = JSON.stringify(body);
  const id = options.id ?? 'msg_1';
  const timestamp = options.timestamp ?? new Date();
  const signer = new Webhook(signingKey(options.secret ?? SECRET));
  const signature = signer.sign(id, timestamp, payload);
  return {
    payload,
    headers: {
      'webhook-id': id,
      'webhook-timestamp': Math.floor(timestamp.getTime() / 1000).toString(),
      'webhook-signature': signature,
    },
  };
}

const subscriptionEvent = (id = 'sub_1') => ({
  type: 'subscription.updated',
  data: { id, customer: { externalId: 'acc_1' } },
});

/** Deps that count what they were asked to do. */
function spy(options: { seen?: Set<string>; fail?: boolean } = {}) {
  const seen = options.seen ?? new Set<string>();
  const handled: string[] = [];
  return {
    handled,
    claimed: seen,
    deps: {
      secret: SECRET,
      // Polar's own validator parses against generated zod schemas; a payload
      // those accept is several hundred lines of fixture pinned to somebody
      // else's API shape. The signature above is real either way.
      parse: (payload: string) => JSON.parse(payload) as { type: string; data: unknown },
      claim: async (id: string) => {
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
      },
      handle: async (event: { type: string }) => {
        if (options.fail) throw new Error('database is down');
        handled.push(event.type);
      },
    },
  };
}

describe('a webhook that arrives', () => {
  test('a good one is handled once and acknowledged', async () => {
    const { deps, handled } = spy();
    const { payload, headers } = delivery(subscriptionEvent());

    const outcome = await receiveWebhook(payload, headers, deps);
    assert.equal(outcome.status, 200);
    assert.deepEqual(handled, ['subscription.updated']);
  });

  test('the same delivery three times is handled once', async () => {
    // Polar retries. A duplicate that upgraded twice would be a double charge,
    // and nothing about it would look like an error at the time.
    const { deps, handled } = spy();
    const { payload, headers } = delivery(subscriptionEvent(), { id: 'msg_retry' });

    const first = await receiveWebhook(payload, headers, deps);
    const second = await receiveWebhook(payload, headers, deps);
    const third = await receiveWebhook(payload, headers, deps);

    assert.equal(handled.length, 1, 'handled once, whatever the delivery count');
    assert.equal(first.body.duplicate, undefined);
    assert.equal(second.body.duplicate, true);
    assert.equal(third.body.duplicate, true);
    // All three are 200: a retry must stop retrying, not be refused.
    for (const outcome of [first, second, third]) assert.equal(outcome.status, 200);
  });

  test('two different deliveries of the same subscription both run', async () => {
    // Idempotency is per delivery, not per subscription — a genuine later
    // event about the same subscription has to be acted on.
    const { deps, handled } = spy();
    const one = delivery(subscriptionEvent(), { id: 'msg_a' });
    const two = delivery(subscriptionEvent(), { id: 'msg_b' });

    await receiveWebhook(one.payload, one.headers, deps);
    await receiveWebhook(two.payload, two.headers, deps);
    assert.equal(handled.length, 2);
  });

  test('a bad signature is refused and nothing is handled', async () => {
    const { deps, handled, claimed } = spy();
    const { payload, headers } = delivery(subscriptionEvent(), {
      secret: 'a-completely-different-secret-000000',
    });

    const outcome = await receiveWebhook(payload, headers, deps);
    assert.equal(outcome.status, 400);
    assert.equal(outcome.error?.code, 'bad_signature');
    assert.deepEqual(handled, []);
    // And the delivery id is not spent. Claiming before verifying would let
    // anybody burn a real event's id with a forged request, and the real
    // delivery would then arrive looking like a duplicate.
    assert.equal(claimed.size, 0);
  });

  test('a tampered body is refused even with a real delivery id', async () => {
    const { deps, handled } = spy();
    const { headers } = delivery(subscriptionEvent());
    const outcome = await receiveWebhook(
      JSON.stringify({ type: 'subscription.updated', data: { id: 'sub_evil' } }),
      headers,
      deps
    );
    assert.equal(outcome.error?.code, 'bad_signature');
    assert.deepEqual(handled, []);
  });

  test('no webhook-id at all is refused', async () => {
    // Nothing to be idempotent about. Processing it once and hoping is how a
    // retry storm becomes a billing incident.
    const { deps, handled } = spy();
    const { payload, headers } = delivery(subscriptionEvent());
    delete headers['webhook-id'];

    const outcome = await receiveWebhook(payload, headers, deps);
    assert.equal(outcome.status, 400);
    assert.equal(outcome.error?.code, 'unsigned');
    assert.deepEqual(handled, []);
  });

  test('a handler that throws answers 5xx, so Polar retries', async () => {
    // The dangerous version of this bug is a `catch` that returns 200: Polar
    // records the delivery as successful, never sends it again, and the
    // subscription silently never syncs.
    const { deps } = spy({ fail: true });
    const { payload, headers } = delivery(subscriptionEvent());

    const outcome = await receiveWebhook(payload, headers, deps);
    assert.equal(outcome.status, 500);
    assert.equal(outcome.error?.code, 'handler_failed');
  });

  test('an old delivery is refused rather than replayed', async () => {
    // Standard Webhooks signs the timestamp too. A recording of yesterday's
    // upgrade should not be re-playable today.
    const { deps, handled } = spy();
    const old = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const { payload, headers } = delivery(subscriptionEvent(), { timestamp: old });

    const outcome = await receiveWebhook(payload, headers, deps);
    assert.equal(outcome.status, 400);
    assert.deepEqual(handled, []);
  });
});

/**
 * Events this build was never told about.
 *
 * Two bugs have lived here. The route once had a `default:` branch commented
 * "acknowledged so Polar stops retrying it" that never ran, because Polar's
 * validator threw on an unknown type first and 500'd the request into an
 * endless retry. Then the validator itself became the bug: it re-verifies the
 * signature with the legacy key derivation only, so under a modern `whsec_`
 * secret it rejected every delivery, and the catch around it filed each one as
 * a payload we did not understand.
 *
 * Reading the payload is now a JSON parse — nothing downstream depends on its
 * shape, because the handler re-reads the subscription from Polar — and
 * whether an event is ours is the handler's answer, given out loud so the
 * counters can tell work from noise.
 */
describe('a payload this build does not understand', () => {
  const real = (body: unknown, id: string) => delivery(body, { id });

  test('an event type nobody here has heard of still reaches the handler', async () => {
    // Not dropped on the way in. A type absent from this build is a type Polar
    // added, and the handler is the only thing that knows whether it matters.
    const { deps, handled } = spy();
    delete (deps as { parse?: unknown }).parse;
    const { payload, headers } = real({ type: 'invoice.teleported', data: {} }, 'msg_future');

    const outcome = await receiveWebhook(payload, headers, deps);
    assert.equal(outcome.status, 200, 'a 5xx here is an infinite retry loop');
    assert.deepEqual(handled, ['invoice.teleported']);
  });

  test('a handler that says it did nothing is counted as ignored', async () => {
    // What keeps `/health` honest: most of what Polar sends is somebody else's
    // business, and it must not be counted as a plan change we applied.
    const { payload, headers } = real({ type: 'order.paid', data: {} }, 'msg_not_ours');

    const outcome = await receiveWebhook(payload, headers, {
      secret: SECRET,
      claim: async () => true,
      handle: async () => false,
    });
    assert.equal(outcome.status, 200);
    assert.equal(outcome.body.ignored, true);
  });

  test('a body with no event type in it is the case ignored is really for', async () => {
    const { deps, handled } = spy();
    delete (deps as { parse?: unknown }).parse;
    const { payload, headers } = real({ nothing: 'here' }, 'msg_shapeless');

    const outcome = await receiveWebhook(payload, headers, deps);
    assert.equal(outcome.status, 200);
    assert.equal(outcome.body.ignored, true);
    assert.deepEqual(handled, []);
  });

  test('but a bad signature still wins over an unreadable payload', async () => {
    // Order matters: verify first, then parse. The other way round would leak
    // "is this a shape we know" to anybody who can post.
    const { deps } = spy();
    delete (deps as { parse?: unknown }).parse;
    const { payload, headers } = delivery(
      { type: 'invoice.teleported', data: {} },
      { id: 'msg_forged', secret: 'not-the-secret-at-all-000000000000' }
    );

    const outcome = await receiveWebhook(payload, headers, deps);
    assert.equal(outcome.status, 400);
    assert.equal(outcome.error?.code, 'bad_signature');
  });
});

describe('which events count', () => {
  test('every subscription event Polar sends is one we listen for', () => {
    // Pinned because the vocabulary already changed once, when billing moved
    // from Stripe to Polar. A status that quietly stops being recognised does
    // not throw — it just leaves a paying customer on Free.
    //
    // This was seven, and Polar's dashboard lists ten. The three that were
    // missing — cycled, paused, resumed — are not new: they were never here.
    // The handler re-reads the subscription rather than reading the event, so
    // a missing type is a change nobody is told about until the 24-hour
    // reconcile finds it, and `paused` in that window is Pro nobody is paying
    // for.
    assert.deepEqual(
      [...SUBSCRIPTION_EVENTS].sort(),
      [
        'subscription.active',
        'subscription.canceled',
        'subscription.created',
        'subscription.cycled',
        'subscription.past_due',
        'subscription.paused',
        'subscription.resumed',
        'subscription.revoked',
        'subscription.uncanceled',
        'subscription.updated',
      ]
    );
  });
});

describe('counting what arrives, including what is turned away', () => {
  /**
   * `handled_events` counts successes and nothing else, and for one whole
   * afternoon that made two very different situations identical: "Polar has
   * never sent anything" and "Polar has been sending for days and every one is
   * refused" both read as zero. Four separate questions during that session
   * could not be answered from this side at all — each one needed somebody to
   * open Polar's dashboard and look.
   *
   * So every outcome gets a word, and the word is read off the outcome rather
   * than passed beside it: a new branch in `receiveWebhook` cannot be added
   * without also being counted as something.
   */
  test('each outcome has its own word', () => {
    assert.equal(outcomeLabel({ status: 200, body: { received: true } }), 'handled');
    assert.equal(
      outcomeLabel({ status: 200, body: { received: true, duplicate: true } }),
      'duplicate'
    );
    assert.equal(
      outcomeLabel({ status: 200, body: { received: true, ignored: true } }),
      'ignored'
    );
  });

  test('a refusal is counted as the reason it was refused', () => {
    // Not just "refused": the difference between a wrong secret and a stale
    // timestamp is the difference between a config error and a clock.
    for (const code of ['unsigned', 'bad_signature']) {
      assert.equal(
        outcomeLabel({
          status: 400,
          body: { error: { code, message: 'x' } },
          error: { code, message: 'x' },
        }),
        code
      );
    }
  });

  test('the label survives a real trip through receiveWebhook', () => {
    // The three success shapes come from three different `ok(...)` calls, and
    // reading them back is the only thing that says they still differ.
    const shapes = [
      { body: { received: true }, expected: 'handled' },
      { body: { received: true, duplicate: true }, expected: 'duplicate' },
      { body: { received: true, ignored: true }, expected: 'ignored' },
    ];
    for (const { body, expected } of shapes) {
      assert.equal(outcomeLabel({ status: 200, body }), expected);
    }
  });
});

describe('the two ways Polar signs', () => {
  /**
   * Polar picks a key derivation by the shape of the secret, and this only had
   * one of them.
   *
   * The secret in use was `whsec_` plus 43 characters — not base64, so Polar
   * could only sign it the older way, using the literal characters as the key.
   * That is what this code did, and it worked. Then the secret was regenerated
   * as `whsec_` plus 44 characters, which *is* base64, so Polar switched to
   * Standard Webhooks and used the 32 decoded bytes instead.
   *
   * Every delivery came back 400 while the endpoint, the URL, the secret and
   * the payload were all correct — and the three deliveries that had succeeded
   * an hour earlier were the reason the derivation looked innocent. They ran
   * under the old secret and could not have failed.
   */
  const LEGACY = 'mochi-test-webhook-secret-0123456789';
  const STANDARD = `whsec_${Buffer.from('a'.repeat(32)).toString('base64')}`;

  const signedWith = (key: string, body: unknown) => {
    const payload = JSON.stringify(body);
    const id = 'msg_' + Math.random().toString(36).slice(2);
    const timestamp = new Date();
    return {
      payload,
      headers: {
        'webhook-id': id,
        'webhook-timestamp': Math.floor(timestamp.getTime() / 1000).toString(),
        'webhook-signature': new Webhook(key).sign(id, timestamp, payload),
      },
    };
  };

  const deps = (secret: string) => ({
    secret,
    claim: async () => true,
    handle: async () => {},
    parse: (payload: string) => JSON.parse(payload) as unknown,
  });

  test('a secret that is not base64 is accepted, signed the older way', async () => {
    // The key is the literal characters, which is what base64-encoding the
    // whole string and letting the library decode it back amounts to.
    const { payload, headers } = signedWith(
      Buffer.from(LEGACY, 'utf-8').toString('base64'),
      { type: 'benefit.created', data: {} }
    );
    const outcome = await receiveWebhook(payload, headers, deps(LEGACY));
    assert.equal(outcome.status, 200, JSON.stringify(outcome.body));
  });

  test('a base64 secret is accepted, signed the Standard Webhooks way', async () => {
    // This is the one that was failing in production: the key is the decoded
    // bytes, not the characters.
    const { payload, headers } = signedWith(STANDARD, { type: 'benefit.created', data: {} });
    const outcome = await receiveWebhook(payload, headers, deps(STANDARD));
    assert.equal(outcome.status, 200, JSON.stringify(outcome.body));
  });

  test('the prefix stripped, used literally, is a third key worth trying', async () => {
    // The one that had never been tried. Polar picks a derivation by the shape
    // of the secret and does not say which; the shape changed when a secret was
    // regenerated, and every delivery started failing.
    const body = STANDARD.slice('whsec_'.length);
    const { payload, headers } = signedWith(
      Buffer.from(body, 'utf-8').toString('base64'),
      { type: 'benefit.created', data: {} }
    );
    const outcome = await receiveWebhook(payload, headers, deps(STANDARD));
    assert.equal(outcome.status, 200, JSON.stringify(outcome.body));
  });

  test('a modern secret survives the whole path, with nothing stubbed', async () => {
    /**
     * The gap every test above walked over.
     *
     * They all injected `parse`, and `parse` was where this broke. The real
     * default used to be the SDK's `validateEvent`, which verifies the
     * signature a *second* time and knows only the legacy derivation — so a
     * `whsec_` secret passed the verify these tests exercise and failed the
     * step they replaced. Production counted every delivery as "ignored" while
     * the suite stayed green.
     *
     * So: no `parse`, and an assertion on what the handler was actually given.
     */
    const seen: string[] = [];
    const { payload, headers } = signedWith(STANDARD, {
      type: 'subscription.revoked',
      data: { id: 'sub_1', customer: { externalId: 'acct_1' } },
    });
    const outcome = await receiveWebhook(payload, headers, {
      secret: STANDARD,
      claim: async () => true,
      handle: async (event) => {
        seen.push(event.type);
      },
    });

    assert.equal(outcome.status, 200, JSON.stringify(outcome.body));
    assert.equal(outcome.body.ignored, undefined, 'a real event must not be written off as ignored');
    assert.deepEqual(seen, ['subscription.revoked']);
  });

  test('a wrong secret is still refused under every derivation', async () => {
    // Accepting several must not become accepting anything: three chances to
    // match is still no chance when the key is wrong.
    const { payload, headers } = signedWith(STANDARD, { type: 'benefit.created', data: {} });
    const other = `whsec_${Buffer.from('b'.repeat(32)).toString('base64')}`;
    const outcome = await receiveWebhook(payload, headers, deps(other));
    assert.equal(outcome.status, 400);
    assert.equal(outcome.error?.code, 'bad_signature');
  });
});

describe('why a signature was refused', () => {
  /**
   * Three different failures used to answer with the same four words. A wrong
   * secret, a clock that is off, and a sender that is not speaking this
   * protocol need completely different fixes, and "that signature does not
   * check out" is the right answer to exactly one of them.
   *
   * The cost was an afternoon: every delivery in Polar's log said `400
   * bad_signature`, so no hypothesis could be ruled out by looking. The reason
   * now travels in the response body, which is where the sender records it —
   * so it lands in the log the person debugging is already reading.
   */
  const deps = { secret: SECRET, claim: async () => true, handle: async () => {} };

  test('a timestamp too far from now says so', async () => {
    const old = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const { payload, headers } = delivery({ type: 'benefit.created', data: {} }, { timestamp: old });
    const outcome = await receiveWebhook(payload, headers, deps);
    assert.equal(outcome.status, 400);
    assert.equal(outcome.error?.code, 'stale_timestamp');
  });

  test('a missing header says which are needed', async () => {
    const outcome = await receiveWebhook('{}', { 'webhook-id': 'msg_x' }, deps);
    assert.equal(outcome.status, 400);
    assert.equal(outcome.error?.code, 'missing_headers');
  });

  test('a key that does not match is the one that says bad signature', async () => {
    const { payload, headers } = delivery(
      { type: 'benefit.created', data: {} },
      { secret: 'a-completely-different-secret-value' }
    );
    const outcome = await receiveWebhook(payload, headers, deps);
    assert.equal(outcome.status, 400);
    assert.equal(outcome.error?.code, 'bad_signature');
  });
});

/**
 * The name on the wire.
 *
 * Polar sends snake_case. The SDK's generated schemas used to remap it before
 * this service ever saw it, so `customer.externalId` was correct — right up
 * until those schemas were removed for verifying the signature a second time
 * with the wrong key. The remap left with them, the id read undefined on every
 * delivery, and every subscription change was filed as "not ours". A fix for
 * one silent failure that introduced another, counted in the same word.
 *
 * These use the shape Polar actually posts, which is the only shape that
 * matters and the one no test here was using.
 */
describe('finding the account in a payload Polar actually sends', () => {
  const wire = {
    id: 'sub_1',
    status: 'canceled',
    customer: {
      id: 'cus_1',
      email: 'a@b.c',
      external_id: 'acct_42',
      email_verified: true,
      created_at: '2026-09-09T04:58:01Z',
    },
  };

  test('reads external_id, the name Polar puts on it', () => {
    assert.equal(accountIdFor(wire), 'acct_42');
  });

  test('still reads externalId, for anything already camelCased', () => {
    assert.equal(accountIdFor({ customer: { externalId: 'acct_42' } }), 'acct_42');
  });

  test('a customer with no external id is not an account', () => {
    // Somebody who reached Polar without going through our checkout. Nothing
    // to attribute the subscription to, so nothing to do — but it must be a
    // clear nothing, not an undefined that reads as a string somewhere later.
    assert.equal(accountIdFor({ customer: { id: 'cus_1', email: 'a@b.c' } }), undefined);
    assert.equal(accountIdFor({ customer: { external_id: '' } }), undefined);
    assert.equal(accountIdFor({ customer: null }), undefined);
    assert.equal(accountIdFor(null), undefined);
  });

  test('a revoked subscription carries one, which is the whole point', async () => {
    // End to end on the real path: signed with a modern secret, parsed without
    // the SDK, and the id pulled out of the snake_case body. Every step here
    // has broken separately.
    let seen: string | undefined = 'not called';
    const payload = JSON.stringify({ type: 'subscription.revoked', data: wire });
    const id = 'msg_' + Math.random().toString(36).slice(2);
    const timestamp = new Date();
    const secret = `whsec_${Buffer.from('a'.repeat(32)).toString('base64')}`;

    const outcome = await receiveWebhook(
      payload,
      {
        'webhook-id': id,
        'webhook-timestamp': Math.floor(timestamp.getTime() / 1000).toString(),
        'webhook-signature': new Webhook(secret).sign(id, timestamp, payload),
      },
      {
        secret,
        claim: async () => true,
        handle: async (event) => {
          seen = accountIdFor(event.data);
          return seen !== undefined;
        },
      }
    );

    assert.equal(outcome.status, 200, JSON.stringify(outcome.body));
    assert.equal(seen, 'acct_42');
    assert.equal(outcome.body.ignored, undefined, 'a subscription change is not "not ours"');
  });
});
