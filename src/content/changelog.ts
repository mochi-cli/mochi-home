/* Mirrored from CHANGELOG.md in the app repo. This is a copy, not a summary:
   the wording is the release note as written, so the page cannot drift into
   claiming something the release did not do. Regenerate it from that file
   rather than editing entries here.

   Starts at 0.1.0. Everything before it was the npx-installed CLI build and
   was removed when the product became a signed .dmg. */

export interface Release {
  version: string;
  items: string[];
}

export const RELEASES: Release[] = [
  {
    version: "0.1.1",
    items: [
      "Paying anywhere other than the app is noticed when you switch back to it, instead of within a day.",
      "Free accounts are no longer told to sign in again to restore a Pro they never bought.",
      "On Pro the agent calls line says unlimited rather than counting up against nothing.",
    ],
  },
  {
    version: "0.1.0",
    items: [
      "First public build. The Mac app is self-contained: Apple Silicon and Intel, with Node inside it, so there is nothing to install before it runs.",
      "Sign in opens a real browser from the desktop window.",
      "The account card stays on screen when the workspace list is long.",
      "Deleting a column can be undone from History.",
      "Cancelling a plan says so, and shows when Pro ends.",
      "One account works on up to three machines, and says why when one is signed out.",
    ],
  },
];
