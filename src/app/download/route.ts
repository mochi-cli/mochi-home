import { NextResponse } from 'next/server';
import { CURRENT, SITE } from '@/lib/service/release.ts';

export const runtime = 'nodejs';

/**
 * Sends somebody to the macOS build.
 *
 * Served from this site rather than from GitHub Releases, because the source
 * repository is private: `github.com/mochi-cli/mochi/releases/latest` answers
 * 404 to everybody who does not work here, which is what the download button
 * had been doing to every visitor.
 *
 * Apple Silicon only, and that is the honest state of the product rather than
 * an omission to paper over — there is no Intel or Windows build to redirect
 * to yet, and pretending otherwise would send somebody a file that cannot run.
 */
export function GET() {
  return NextResponse.redirect(new URL(CURRENT.file, SITE), {
    status: 302,
    headers: {
      // Not cached: the whole point of the indirection is that this answer
      // changes, and a browser holding a 301 would keep handing out an old
      // build long after it stopped being current.
      'cache-control': 'no-store',
      'x-mochi-version': CURRENT.version,
    },
  });
}
