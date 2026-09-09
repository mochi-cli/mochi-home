import { Webhook, WebhookVerificationError } from 'standardwebhooks';

/**
 * What happens to an incoming webhook, decided apart from HTTP.
 *
 * Split out of the route because none of this could be tested where it was. It
 * is the one endpoint strangers can reach that changes billing state, and the
 * failures it guards against — a replay that upgrades twice, an event acted on
 * despite a bad signature, an error swallowed as 200 so Polar stops retrying —
 * are all invisible in production until somebody is charged wrong or a payer
 * sees Free. "We believe it is idempotent" is not the same as a test that
 * fails when it stops being.
 *
 * Dependencies arrive as arguments: `claim` writes the delivery id, `handle`
 * does the work. The route supplies the real ones; a test supplies counters.
 */

export interface WebhookOutcome {
  status: number;
  body: Record<string, unknown>;
  /** Set when the request was rejected, matching the app's error shape. */
  error?: { code: string; message: string };
}

export interface WebhookDeps {
  secret: string;
  /** Records the delivery id, returning false when it was already there. */
  claim: (deliveryId: string) => Promise<boolean>;
  /**
   * Does the work, and says whether it did any.
   *
   * The boolean is what keeps the counters honest. Most of what Polar sends is
   * somebody else's business — orders, benefits, customers — and a handler that
   * returned nothing made those indistinguishable from a subscription change
   * that was actually applied. `false` means read, understood, not ours.
   */
  handle: (event: { type: string; data: unknown }) => Promise<boolean | void>;
  /** Turns a verified payload into an event. Defaults to {@link readEvent}. */
  parse?: (payload: string, headers: Record<string, string>, secret: string) => unknown;
}

const ok = (body: Record<string, unknown>): WebhookOutcome => ({ status: 200, body });

const refuse = (status: number, code: string, message: string): WebhookOutcome => ({
  status,
  body: { error: { code, message } },
  error: { code, message },
});

/**
 * The signature, checked against every key Polar might have derived.
 *
 * Polar does not say which it used; it picks by the shape of the secret, and
 * the shape changed under us when one was regenerated. So rather than guess,
 * try each and accept any:
 *
 * - **Standard Webhooks** — the key is the base64-decoded part after `whsec_`.
 *   `new Webhook(secret)` does this itself, and it is what the endpoint's
 *   `uses_standard_webhook_signature` flag claims is in force.
 * - **The whole string** — the key is the literal characters including the
 *   prefix. This is what Polar's own SDK produces, by base64-encoding the
 *   secret before handing it over, and it is the only one that was here.
 * - **The string without its prefix** — the same idea, minus `whsec_`.
 *
 * Only the second was implemented, and it worked for as long as the secret was
 * `whsec_` plus 43 characters: not base64, so it could only ever have been
 * signed that way. Regenerating produced 44 characters, which is base64, and
 * every delivery started coming back 400 while the endpoint, URL, secret and
 * payload were all correct.
 *
 * Trying three costs two extra HMACs on a request that was going to be refused
 * anyway, and nothing at all on one that verifies first time. A key that is
 * simply wrong still matches none of them, which is asserted in the tests —
 * accepting several derivations must not become accepting anything.
 */
function verify(payload: string, headers: Record<string, string>, secret: string): void {
  const body = secret.startsWith('whsec_') ? secret.slice('whsec_'.length) : secret;
  const candidates = [
    secret,
    Buffer.from(secret, 'utf-8').toString('base64'),
    Buffer.from(body, 'utf-8').toString('base64'),
  ];

  let last: unknown;
  for (const key of candidates) {
    try {
      new Webhook(key).verify(payload, headers);
      return;
    } catch (error) {
      last = error;
    }
  }
  throw last;
}

/**
 * Which of the three ways a signature check can fail.
 *
 * The library says which in prose; this turns that into something a caller can
 * act on. A message it has never seen stays `bad_signature`, because guessing
 * would be worse than the honest fallback.
 */
function signatureRefusal(message: string): { code: string; message: string } {
  if (/timestamp/i.test(message)) {
    return {
      code: 'stale_timestamp',
      message: 'that delivery is signed for a time too far from now',
    };
  }
  if (/missing|header/i.test(message)) {
    return {
      code: 'missing_headers',
      message: 'this needs webhook-id, webhook-timestamp and webhook-signature',
    };
  }
  return { code: 'bad_signature', message: 'that signature does not check out' };
}

/**
 * One word for what happened, for the counters.
 *
 * Read off the outcome rather than passed alongside it, so a new branch in
 * `receiveWebhook` cannot be added without also being counted as something —
 * the alternative is a fifth outcome that silently lands in whichever bucket
 * the last `else` points at.
 */
export function outcomeLabel(outcome: WebhookOutcome): string {
  if (outcome.error) return outcome.error.code;
  if (outcome.body.duplicate === true) return 'duplicate';
  if (outcome.body.ignored === true) return 'ignored';
  return 'handled';
}

export async function receiveWebhook(
  payload: string,
  headers: Record<string, string>,
  deps: WebhookDeps
): Promise<WebhookOutcome> {
  // Standard Webhooks puts the delivery's identity in a header, not in the
  // body — unlike Stripe, there is no event id inside to key on. Without it
  // there is nothing to be idempotent about, so it is refused rather than
  // processed once and hoped about.
  const deliveryId = headers['webhook-id'];
  if (!deliveryId) return refuse(400, 'unsigned', 'no webhook-id on this request');

  try {
    // The raw bytes, before anything parses them: signing covers the exact
    // string, and a framework that hands you parsed JSON has already destroyed
    // it. Verified *before* the claim, so a forged delivery id cannot burn a
    // real event's id and leave the real one looking like a duplicate.
    verify(payload, headers, deps.secret);
  } catch (error) {
    if (error instanceof WebhookVerificationError) {
      // Named, not lumped together. These three fail for reasons needing
      // completely different fixes — a wrong secret, a clock, a sender that is
      // not speaking this protocol — and calling all of them "bad signature"
      // cost most of an afternoon: every delivery said the same thing, so every
      // hypothesis looked equally likely.
      //
      // The reason travels in the response body, so it also lands in the
      // sender's own delivery log, which is where whoever is debugging this is
      // already looking.
      const refusal = signatureRefusal(error.message);
      console.error('[service] webhook refused:', refusal.code, error.message);
      return refuse(400, refusal.code, refusal.message);
    }
    throw error;
  }

  let event: { type: string; data: unknown };
  try {
    event = (deps.parse ?? readEvent)(payload, headers, deps.secret) as {
      type: string;
      data: unknown;
    };
  } catch (error) {
    /**
     * Signed by Polar, and not something this build can read.
     *
     * Acknowledged rather than retried: retrying cannot fix a payload we
     * cannot parse, and reconcile-on-read picks the subscription up anyway.
     *
     * Worth knowing what this branch is *not* for. It used to catch the SDK's
     * `validateEvent`, which verifies the signature a second time and knows
     * only the legacy key derivation — so every event under a modern `whsec_`
     * secret passed `verify` above, failed here, and was written down as a
     * payload this build did not understand. The counter said "ignored", which
     * reads as "not ours", and every plan change Polar sent was silently
     * dropped for as long as that lasted.
     */
    console.error('[service] webhook payload not recognised', error);
    return ok({ received: true, ignored: true });
  }

  try {
    if (!(await deps.claim(deliveryId))) {
      // Seen before. Acknowledged so Polar stops retrying, and emphatically
      // not handled again.
      return ok({ received: true, duplicate: true });
    }
    const acted = await deps.handle(event);
    return acted === false ? ok({ received: true, ignored: true }) : ok({ received: true });
  } catch (error) {
    // Polar treats any 2xx as delivered, so a failure has to leave as a
    // non-2xx or the event is gone for good.
    console.error('[service] webhook handling failed', event.type, error);
    return refuse(500, 'handler_failed', 'could not handle that event — please retry');
  }
}

/**
 * The event, read rather than validated against Polar's schemas.
 *
 * There is nothing here to validate. `handle` takes the subscription id and
 * re-reads the current state from Polar precisely so that it does not depend
 * on the shape, or the freshness, of what arrived — so parsing the rest
 * against generated schemas bought no safety, and cost a second signature
 * check performed with a key derivation this service had already found to be
 * the wrong one.
 *
 * It also means a new event type, or a new field on an existing one, costs
 * nothing. Polar adds both.
 */
export function readEvent(payload: string): { type: string; data: unknown } {
  const parsed: unknown = JSON.parse(payload);
  if (typeof parsed !== 'object' || parsed === null) throw new Error('payload is not an object');
  const { type, data } = parsed as { type?: unknown; data?: unknown };
  if (typeof type !== 'string') throw new Error('payload carries no event type');
  return { type, data };
}

/**
 * The account an event is about, from Polar's own JSON.
 *
 * That JSON is snake_case. It used to arrive here camelCased because the SDK's
 * generated schemas remapped every field on the way in — and when those
 * schemas went, the remap went with them. `customer.externalId` then read
 * undefined on every delivery, the handler answered "not mine", and the
 * counter said "ignored" a second time in one day about an entirely different
 * cause. One word, two bugs, both invisible.
 *
 * Both spellings are accepted, and the wire one wins.
 */
export function accountIdFor(data: unknown): string | undefined {
  const customer = (data as { customer?: Record<string, unknown> } | null)?.customer;
  if (!customer) return undefined;
  const wire = customer.external_id;
  if (typeof wire === 'string' && wire !== '') return wire;
  const camel = customer.externalId;
  return typeof camel === 'string' && camel !== '' ? camel : undefined;
}

/** The subscription events this service acts on. Everything else is noise. */
export const SUBSCRIPTION_EVENTS = new Set([
  'subscription.created',
  'subscription.updated',
  'subscription.active',
  'subscription.canceled',
  'subscription.uncanceled',
  'subscription.past_due',
  'subscription.revoked',
  // The three below were missing, and the reason they matter is that the
  // handler does not read the event: it takes the subscription id and re-reads
  // the current state from Polar. So an event type here is a *trigger*, not a
  // meaning, and one that is absent is simply a change nobody is told about
  // until the 24-hour reconcile notices.
  //
  // `paused` is the one that costs money: `isActive` correctly refuses a paused
  // subscription, but nothing asked, so somebody who paused kept Pro for up to
  // a day. `cycled` is a renewal, which leaves `current_period_end` stale for
  // the same window. `resumed` is the way back.
  'subscription.cycled',
  'subscription.paused',
  'subscription.resumed',
]);
