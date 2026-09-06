import { NextResponse } from 'next/server';
import { env } from '@/lib/service/env.ts';
import { endWebSession } from '@/lib/service/web.ts';

export const runtime = 'nodejs';

/** POST only: a sign-out on GET is a sign-out any image tag can perform. */
export async function POST() {
  await endWebSession();
  return NextResponse.redirect(`${env.origin}/profile`, { status: 303 });
}
