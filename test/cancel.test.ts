import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import {
  AlreadyCanceledSubscription,
  AlreadyCanceledSubscription$inboundSchema,
} from '@polar-sh/sdk/models/errors/alreadycanceledsubscription.js';

/**
 * Cancelling something already cancelled.
 *
 * Polar answers a second `cancelAtPeriodEnd: true` with a 403 and this error,
 * which the SDK raises as a throw. billing.ts used to let it out: the route
 * turned it into a 500, and the app told the person "the account service
 * refused the cancellation — nothing was changed". Neither half was true. The
 * subscription was cancelled, and it stayed that way while they were told to
 * go and do it again.
 *
 * The catch is an `instanceof`, so what is worth pinning is that the class our
 * code imports is the one the SDK's own parser builds. An SDK upgrade that
 * moves the class, or exports it from a different subpath, would otherwise
 * turn the check into a silent false — and the 500 would come straight back.
 */

describe('recognising an already-cancelled subscription', () => {
  const raise = () =>
    AlreadyCanceledSubscription$inboundSchema.parse({
      error: 'AlreadyCanceledSubscription',
      detail: 'This subscription is already canceled or will be at the end of the period.',
      request$: new Request('https://api.polar.sh/v1/subscriptions/x'),
      response$: new Response('', { status: 403 }),
      body$: '{"error":"AlreadyCanceledSubscription"}',
    });

  test('the SDK builds the class billing.ts catches', () => {
    assert.ok(raise() instanceof AlreadyCanceledSubscription);
  });

  test('and it is an Error, so an unrelated failure still rethrows', () => {
    assert.ok(raise() instanceof Error);
    assert.equal(new Error('network down') instanceof AlreadyCanceledSubscription, false);
  });
});
