import { NextResponse } from 'next/server';
import { CURRENT, SITE } from '@/lib/service/release.ts';

export const runtime = 'nodejs';

/**
 * What the newest build is, for a copy that is already installed.
 *
 * The app used to ask GitHub. That could never work: the source repository is
 * private, so `/releases/latest` answers 404 to every machine that is not
 * signed in as somebody who works here — and a private repository answers 404
 * rather than 403 on purpose, so it does not leak its own existence. The app
 * could not tell "no releases" from "not yours to see", and for a while read
 * both as "you are up to date".
 *
 * Answered from here instead, where the answer is known.
 *
 * Carries no account and takes none. An installed copy asking whether it is
 * current should not have to say who it belongs to, and this endpoint is
 * public because the answer is the same for everybody.
 */
export function GET() {
  return NextResponse.json(
    {
      version: CURRENT.version,
      // Absolute, because the app opens it in a browser rather than resolving
      // it against a page it is not on.
      url: `${SITE}/download`,
      notes: CURRENT.notes,
      publishedAt: CURRENT.publishedAt,
    },
    {
      headers: {
        // Ten minutes at the edge. A release does not appear more often, and
        // the app caches for an hour of its own on top of this.
        'cache-control': 'public, max-age=600',
      },
    }
  );
}
