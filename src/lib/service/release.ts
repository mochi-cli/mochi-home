/**
 * The build this site hands out, in one place.
 *
 * Two things need it and must never disagree: `/download`, which sends a
 * person to the file, and `/v1/release`, which tells an installed copy that
 * there is something newer. A version named twice is a version that will be
 * bumped once.
 */
export const CURRENT = {
  version: '0.1.3',
  /** The tag the asset hangs off. Derived, so there is still one number. */
  get tag() {
    return `v${CURRENT.version}`;
  },
  publishedAt: '2026-09-10T00:00:00.000Z',
  notes: [
    'Installing an update while an agent was connected left the new build on disk and the old one on screen, with nothing saying so. The window now says which version is serving it, and how to stop it happening.',
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
export type Arch = 'arm64' | 'x64';

/**
 * Which build to hand out when nobody said.
 *
 * Apple Silicon, because that is every Mac sold since 2020 — and because the
 * one thing that cannot be done is *guess*: Safari on Apple Silicon reports
 * "Intel Mac OS X" in its user agent, so sniffing would send the majority the
 * wrong file. The page names both and lets somebody choose.
 */
export const DEFAULT_ARCH: Arch = 'arm64';

export async function signedAssetUrl(
  arch: Arch = DEFAULT_ARCH
): Promise<{ ok: true; url: string } | { ok: false; reason: string }> {
  const token = process.env.GITHUB_RELEASE_TOKEN?.trim();
  if (!token) return { ok: false, reason: 'GITHUB_RELEASE_TOKEN is not set' };

  const headers = { authorization: `Bearer ${token}`, 'user-agent': 'mochi-cli.com' };

  const found = await assetId(arch, headers);
  if (!found.ok) return found;

  const signed = await sign(found.id, headers);
  if (signed.ok) return signed;

  // The id was remembered and is gone — an asset replaced under the same tag,
  // which is what re-uploading a build looks like from here. Forget it and ask
  // once more, so a re-upload costs one failed request rather than every
  // download until this instance happens to be recycled.
  if (!found.cached) return signed;
  assetIds.delete(`${CURRENT.tag}:${arch}`);
  const again = await assetId(arch, headers);
  return again.ok ? await sign(again.id, headers) : again;
}

/**
 * The asset's id, remembered for as long as this instance lives.
 *
 * Every download used to cost two authenticated GitHub calls, and the
 * authenticated budget is 5,000 an hour *for the account the token belongs
 * to* — so the download button had a ceiling of about 2,500 people an hour,
 * shared with everything else that token does. The traffic shape that reaches
 * it is a front page or a launch, which is the hour it can least afford to
 * answer 503.
 *
 * Safe to keep because the id of a published asset does not change, and the
 * key carries the tag: publishing a release moves CURRENT.version, which moves
 * the key, so nothing has to remember to clear this. Failures are not cached —
 * only an id that was actually found.
 */
const assetIds = new Map<string, number>();

async function assetId(
  arch: Arch,
  headers: Record<string, string>
): Promise<{ ok: true; id: number; cached: boolean } | { ok: false; reason: string }> {
  const key = `${CURRENT.tag}:${arch}`;
  const known = assetIds.get(key);
  if (known !== undefined) return { ok: true, id: known, cached: true };

  const release = await fetch(
    `https://api.github.com/repos/${REPO}/releases/tags/${CURRENT.tag}`,
    { headers: { ...headers, accept: 'application/vnd.github+json' }, cache: 'no-store' }
  );
  if (!release.ok) return { ok: false, reason: `release ${CURRENT.tag}: HTTP ${release.status}` };

  const body = (await release.json()) as { assets?: Array<{ id: number; name: string }> };
  // By extension rather than by name: GitHub rewrites spaces in an uploaded
  // filename, and a build renamed upstream should not take the page down.
  // By architecture in the name. Matching the first .dmg would have worked
  // while there was one, and quietly handed Intel users the Apple Silicon
  // build the moment there were two.
  const asset = (body.assets ?? []).find(
    (candidate) => candidate.name.endsWith('.dmg') && candidate.name.includes(arch)
  );
  if (!asset) return { ok: false, reason: `no ${arch} .dmg on ${CURRENT.tag}` };

  assetIds.set(key, asset.id);
  return { ok: true, id: asset.id, cached: false };
}

/** Trades an asset id for the short-lived CDN address of the file itself. */
async function sign(
  id: number,
  headers: Record<string, string>
): Promise<{ ok: true; url: string } | { ok: false; reason: string }> {
  const signed = await fetch(`https://api.github.com/repos/${REPO}/releases/assets/${id}`, {
    headers: { ...headers, accept: 'application/octet-stream' },
    // The redirect *is* the answer. Following it here would pull the file
    // into this function, which is exactly what this avoids.
    redirect: 'manual',
    cache: 'no-store',
  });
  const location = signed.headers.get('location');
  if (!location) return { ok: false, reason: `asset ${id}: HTTP ${signed.status}, no redirect` };
  return { ok: true, url: location };
}
