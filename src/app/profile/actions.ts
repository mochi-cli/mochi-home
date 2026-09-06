'use server';

import { redirect } from 'next/navigation';
import { sql } from '@/lib/service/db.ts';
import { checkoutUrl, portalUrl } from '@/lib/service/billing.ts';
import { currentAccount, endWebSession } from '@/lib/service/web.ts';

/**
 * The two things the profile page can do, both of them behind the browser
 * session and both of them ending at Polar's own pages. No card number ever
 * reaches this origin, which is the same promise /v1/checkout makes.
 */

async function accountOr403() {
  const account = await currentAccount();
  if (!account) redirect('/profile');
  const rows = await sql()`SELECT id, email FROM accounts WHERE id = ${account.id}`;
  const row = rows[0];
  if (!row) redirect('/profile');
  return { id: row.id as string, email: row.email as string };
}

export async function openCheckout(formData: FormData) {
  const account = await accountOr403();
  const cadence = formData.get('cadence') === 'yearly' ? 'yearly' : 'monthly';
  redirect(await checkoutUrl(account, cadence));
}

export async function openPortal() {
  const account = await accountOr403();
  redirect(await portalUrl(account));
}

export async function signOut() {
  await endWebSession();
  redirect('/profile');
}
