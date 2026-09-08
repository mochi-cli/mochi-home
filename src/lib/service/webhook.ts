import { Webhook, WebhookVerificationError } from 'standardwebhooks';
import { validateEvent } from '@polar-sh/sdk/webhooks.js';

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
  handle: (event: { type: string; data: unknown }) => Promise<void>;
  /**
   * Turns a verified payload into an event.
   *
   * A seam, because the real one is Polar's `validateEvent`, which parses
   * against generated zod schemas — building a payload those accept takes
   * several hundred lines of fixture and pins this service's tests to the
   * shape of somebody else's API.
   */
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
    event = (deps.parse ?? validateEvent)(payload, headers, deps.secret) as {
      type: string;
      data: unknown;
    };
  } catch (error) {
    /**
     * Signed by Polar, and not something this build understands.
     *
     * This used to be a 500. The old code had a `default:` branch commented
     * "acknowledged so Polar stops retrying it" — which never ran, because the
     * SDK throws on an unknown event type before the switch is reached. Polar
     * sends new event types, and adds fields to existing ones; either would
     * have turned this endpoint into a permanent retry loop with no symptom
     * except error noise nobody was reading.
     *
     * Acknowledged instead. Retrying cannot fix a payload we cannot read, and
     * reconcile-on-read picks the subscription up on the next request anyway.
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
    await deps.handle(event);
    return ok({ received: true });
  } catch (error) {
    // Polar treats any 2xx as delivered, so a failure has to leave as a
    // non-2xx or the event is gone for good.
    console.error('[service] webhook handling failed', event.type, error);
    return refuse(500, 'handler_failed', 'could not handle that event — please retry');
  }
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
