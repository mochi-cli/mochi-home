import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

/**
 * The build this page hands out. One line to change per release.
 *
 * The buttons point at `/download`, never at a file, so publishing a new
 * version does not mean finding five hrefs — and a link somebody bookmarked,
 * or pasted into a chat a month ago, keeps working and gives them the current
 * build rather than the one that was current when they saved it.
 */
const CURRENT = {
  version: '0.2.22',
  file: '/downloads/Mochi-Table-0.2.22-arm64.dmg',
};

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
  return NextResponse.redirect(new URL(CURRENT.file, 'https://mochi-cli.com'), {
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
