import { NextResponse } from 'next/server';
import { readPlans } from '@/lib/service/plans.ts';
import { fail } from '@/lib/service/http.ts';

export const runtime = 'nodejs';

/** What Pro costs. No authentication: this is a price list. */
export async function GET() {
  try {
    return NextResponse.json(await readPlans());
  } catch (error) {
    /**
     * Not the usual opaque 500. A price list has no secret in it, and the two
     * ways this fails are worth telling apart from outside: a 404 means a
     * product id is wrong, a 401 or 403 means the token cannot read products.
     * Both are configuration, and both look identical behind a generic error.
     *
     * The upstream status only — never the exception text, which is where a
     * client library likes to quote the request it made.
     */
    const status = (error as { statusCode?: number; status?: number }).statusCode ??
      (error as { status?: number }).status ?? null;
    console.error('[service] could not read plans from Polar', status, error);
    return fail(
      502,
      'plans_unavailable',
      status === 404
        ? 'Polar does not know one of POLAR_PRODUCT_MONTHLY or POLAR_PRODUCT_YEARLY'
        : status === 401 || status === 403
          ? 'POLAR_ACCESS_TOKEN cannot read products — check its scopes'
          : `could not reach Polar${status ? ` (${status})` : ''}`
    );
  }
}
