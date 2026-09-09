/** The handful of destinations the page links out to. Kept in one place so the
 *  download CTA in the hero, the closing block, the sticky bar and the
 *  post-checkout page can never drift apart. */
export const REPO_URL = "https://github.com/mochi-cli/mochi";
/**
 * Served from this site, not from GitHub Releases.
 *
 * The repository is private, so `/releases/latest` answered 404 to every
 * visitor who does not work here — the download button on the landing page
 * had not worked for anybody outside the org. `/download` redirects to the
 * current build, so this constant never has to change again.
 */
export const DOWNLOAD_URL = "/download";
export const DISCUSSIONS_URL = `${REPO_URL}/discussions`;
export const RELEASES_URL = `${REPO_URL}/releases`;
export const REPO_HOME_URL = "https://github.com/mochi-cli/home";

