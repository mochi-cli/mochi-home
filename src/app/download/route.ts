import { NextResponse } from 'next/server';
import { CURRENT, DEFAULT_ARCH, signedAssetUrl, type Arch } from '@/lib/service/release.ts';

export const runtime = 'nodejs';

/**
 * Sends somebody to the macOS build.
 *
 * The builds live in a private repository, so `github.com/mochi-cli/mochi/
 * releases/latest` answers 404 to everybody who does not work here — which is
 * what the download button on the landing page had been doing to every
 * visitor, silently, because GitHub's 404 is a page rather than an error.
 *
 * This asks GitHub for the asset with a token and hands back the short-lived
 * signed URL it answers with. The bytes come off GitHub's CDN, not through
 * this function; the token stays here; the repository stays private.
 *
 * Apple Silicon only, and that is the honest state of the product rather than
 * an omission to paper over — there is no Intel or Windows build to redirect
 * to, and sending somebody a file that cannot run is worse than telling them.
 */
export async function GET(request: Request) {
  // Asked for, never sniffed. `?arch=x64` is what the Intel link on the page
  // sends; anything else falls back rather than failing, because a download
  // button is the wrong place to be strict about a query string.
  const wanted = new URL(request.url).searchParams.get('arch');
  const arch: Arch = wanted === 'x64' ? 'x64' : DEFAULT_ARCH;

  const asset = await signedAssetUrl(arch);

  if (!asset.ok) {
    // Said out loud, on the page and in the log. A download button that
    // quietly does nothing is the failure this whole route exists to end, and
    // replacing one silent 404 with a silent 500 would be no improvement.
    console.error('[site] download unavailable:', asset.reason);
    return new NextResponse(
      'The download is temporarily unavailable. This has been logged — please try again shortly.',
      { status: 503, headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' } }
    );
  }

  return NextResponse.redirect(asset.url, {
    status: 302,
    headers: {
      // Never cached: the address expires within minutes, and a browser or an
      // edge holding on to it would hand out a dead link.
      'cache-control': 'no-store',
      'x-mochi-version': CURRENT.version,
      'x-mochi-arch': arch,
    },
  });
}
