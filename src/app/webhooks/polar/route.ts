import { NextResponse } from 'next/server';
import { env } from '@/lib/service/env.ts';
import { claimEvent, recordWebhook } from '@/lib/service/db.ts';
import { polar, syncSubscription } from '@/lib/service/billing.ts';
import { accountIdFor, outcomeLabel, receiveWebhook, SUBSCRIPTION_EVENTS } from '@/lib/service/webhook.ts';

export const runtime = 'nodejs';

/**
 * The one endpoint strangers can reach that changes billing state.
 *
 * The rules it enforces — verify against the raw body, be idempotent by
 * `webhook-id`, and reconcile rather than apply diffs — live in
 * `lib/webhook.ts` where they can be tested. This file is the wiring: raw
 * bytes in, real database and real Polar client attached, HTTP out.
 */
export async function POST(request: Request) {
  // `request.text()`, never `request.json()`: the signature covers the exact
  // bytes and parsing has already destroyed them.
  const payload = await request.text();
  const headers: Record<string, string> = {};
  request.headers.forEach((value, name) => {
    headers[name] = value;
  });

  const outcome = await receiveWebhook(payload, headers, {
    secret: env.polar.webhookSecret,
    claim: claimEvent,
    handle,
  });

  // Counted whatever it was, refusals included. Before this, a refused webhook
  // left no trace at all: "Polar has never sent anything" and "Polar has been
  // sending for days and every one is refused" were the same observation from
  // this side, and telling them apart meant opening somebody else's dashboard.
  await recordWebhook({ label: outcomeLabel(outcome), status: outcome.status });

  return NextResponse.json(outcome.body, { status: outcome.status });
}

/**
 * Anything that is not a POST, answered here rather than by the framework.
 *
 * Next.js already returns 405 for a method a route does not export, and that
 * 405 is invisible: it never reaches this file, so nothing counts it. The case
 * that made this whole file grow a counter was a 405 in Polar's log that could
 * not be explained from our side — a redirect that downgraded the method, a
 * misconfigured URL, a probe, all indistinguishable.
 *
 * Same status, same refusal. The difference is that `/health` can now say it
 * happened.
 */
async function wrongMethod(request: Request) {
  await recordWebhook({ label: `wrong_method:${request.method}`, status: 405 });
  return NextResponse.json(
    {
      error: {
        code: 'wrong_method',
        message: `this endpoint takes POST, not ${request.method}`,
      },
    },
    { status: 405, headers: { allow: 'POST' } }
  );
}

export const GET = wrongMethod;
export const PUT = wrongMethod;
export const PATCH = wrongMethod;
export const DELETE = wrongMethod;

/**
 * Typed loosely on purpose.
 *
 * The SDK's union covers thirty-odd payload shapes, and narrowing it here
 * would mean this file stops compiling every time Polar adds an event — for a
 * function whose first line is "is this one of ours". The two fields actually
 * read are asserted below, where they are read.
 */
async function handle(event: { type: string; data: unknown }): Promise<boolean> {
  // Everything outside the set is acknowledged and ignored — deliberately not
  // logged as a problem, because most of what Polar sends is not ours. Said
  // out loud, so `/health` counts it as ignored rather than as work done.
  if (!SUBSCRIPTION_EVENTS.has(event.type)) return false;

  // The account id travels inside the event, because checkout set it as the
  // customer's external id. No lookup table, and nothing to be out of date.
  const data = event.data as { id: string };
  const accountId = accountIdFor(event.data);
  if (!accountId) return false;

  // Re-read rather than trusting the event's snapshot: `subscription.updated`
  // can arrive before `subscription.created`, and by the time this runs the
  // subscription may have moved on again. Reading the current state makes
  // order stop mattering; applying the event's delta makes it matter
  // enormously.
  const fresh = await polar().subscriptions.get({ id: data.id });
  await syncSubscription(accountId, fresh);
  return true;
}
