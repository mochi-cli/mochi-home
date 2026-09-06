import { env } from './env.ts';
import { polar } from './billing.ts';

/**
 * What Pro costs, read from Polar rather than written down twice.
 *
 * The alternative is a number in the app, and a number in the app drifts: the
 * feature table said $5 a month for weeks after the real product was set to
 * something else, and nobody noticed because nothing compares them. A price
 * shown to somebody about to pay has to be the price they will be charged, so
 * it comes from the same place that charges them.
 *
 * The page and /v1/plans both call this, so the marketing price and the API
 * price cannot disagree either.
 */
export interface Price {
  amount: number;
  currency: string;
  interval: string | null;
}

export interface Plans {
  monthly: Price | null;
  yearly: Price | null;
}

export async function readPlans(): Promise<Plans> {
  const client = polar();
  const [monthly, yearly] = await Promise.all([
    client.products.get({ id: env.polar.productMonthly }),
    client.products.get({ id: env.polar.productYearly }),
  ]);

  // Polar quotes money in minor units — cents — and a price rendered a
  // hundred times too large is the kind of bug that stops a sale outright.
  const price = (product: typeof monthly): Price | null => {
    const fixed = product.prices.find(
      (candidate) => 'priceAmount' in candidate && candidate.amountType === 'fixed'
    );
    if (!fixed || !('priceAmount' in fixed)) return null;
    return {
      amount: fixed.priceAmount / 100,
      currency: fixed.priceCurrency.toUpperCase(),
      interval: product.recurringInterval,
    };
  };

  return { monthly: price(monthly), yearly: price(yearly) };
}

/**
 * The same read, for a page that must render whether or not billing is set up.
 * A marketing page with no prices is a page with a gap in it; a marketing page
 * that fails to build because Polar is unreachable is a site that is down.
 */
export async function plansOrNull(): Promise<Plans | null> {
  try {
    return await readPlans();
  } catch (error) {
    console.error('[site] could not read plans from Polar', error);
    return null;
  }
}
