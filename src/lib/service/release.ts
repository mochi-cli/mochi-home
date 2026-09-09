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
  file: '/downloads/Mochi-Table-0.1.0-arm64.dmg',
  publishedAt: '2026-09-09T00:00:00.000Z',
  notes: [
    'Sign in opens a real browser from the desktop window.',
    'The account card stays on screen when the workspace list is long.',
    'Deleting a column can be undone from History.',
    'Cancelling a plan says so, and shows when Pro ends.',
    'One account is limited to three machines, and says why when one is signed out.',
  ].join('\n'),
} as const;

export const SITE = 'https://mochi-cli.com';
