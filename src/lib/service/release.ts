/**
 * The build this site hands out, in one place.
 *
 * Two things need it and must never disagree: `/download`, which sends a
 * person to the file, and `/v1/release`, which tells an installed copy that
 * there is something newer. A version named twice is a version that will be
 * bumped once.
 */
export const CURRENT = {
  version: '0.1.0',
  /** The tag the asset hangs off. Derived, so there is still one number. */
  get tag() {
    return `v${CURRENT.version}`;
  },
  publishedAt: '2026-09-09T00:00:00.000Z',
  notes: [
    'Sign in opens a real browser from the desktop window.',
    'The account card stays on screen when the workspace list is long.',
    'Deleting a column can be undone from History.',
    'Cancelling a plan says so, and shows when Pro ends.',
    'One account is limited to three machines, and says why when one is signed out.',
  ].join('\n'),
};

export const SITE = 'https://mochi-cli.com';

/** Where the builds live. Private, which is the whole reason for the token. */
const REPO = 'mochi-cli/mochi';

/**
 * A short-lived URL anybody can download the .dmg from.
 *
 * The release lives in a private repository, so the asset cannot be linked to
 * directly. Asking GitHub for it with a token returns a 302 to a signed URL on
 * its CDN — and that URL works *without* the token, for a few minutes.
 *
 * So this reads the redirect and hands the visitor the signed address rather
 * than streaming four megabytes through a serverless function that has a
 * response size limit and no business carrying them.
 *
 * The token never leaves this process. What the visitor receives is a link
 * that expires and grants nothing but this one file.
 */
export async function signedAssetUrl(): Promise<
  { ok: true; url: string } | { ok: false; reason: string }
> {
  const token = process.env.GITHUB_RELEASE_TOKEN?.trim();
  if (!token) return { ok: false, reason: 'GITHUB_RELEASE_TOKEN is not set' };

  const headers = { authorization: `Bearer ${token}`, 'user-agent': 'mochi-cli.com' };

  const release = await fetch(
    `https://api.github.com/repos/${REPO}/releases/tags/${CURRENT.tag}`,
    { headers: { ...headers, accept: 'application/vnd.github+json' }, cache: 'no-store' }
  );
  if (!release.ok) return { ok: false, reason: `release ${CURRENT.tag}: HTTP ${release.status}` };

  const body = (await release.json()) as { assets?: Array<{ id: number; name: string }> };
  // By extension rather than by name: GitHub rewrites spaces in an uploaded
  // filename, and a build renamed upstream should not take the page down.
  const asset = (body.assets ?? []).find((candidate) => candidate.name.endsWith('.dmg'));
  if (!asset) return { ok: false, reason: `no .dmg on ${CURRENT.tag}` };

  const signed = await fetch(`https://api.github.com/repos/${REPO}/releases/assets/${asset.id}`, {
    headers: { ...headers, accept: 'application/octet-stream' },
    // The redirect *is* the answer. Following it here would pull the file
    // into this function, which is exactly what this avoids.
    redirect: 'manual',
    cache: 'no-store',
  });
  const location = signed.headers.get('location');
  if (!location) return { ok: false, reason: `asset ${asset.id}: HTTP ${signed.status}, no redirect` };

  return { ok: true, url: location };
}
