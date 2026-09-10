import type { Metadata } from "next";
import StatusPage from "@/components/StatusPage";

// Reached only by redirect from Google. Nothing to index.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/**
 * Where Google sends people back to. Nothing of value is in this page — no
 * token, no claim — because the app is polling for those over its own
 * connection. That is what makes the browser half of this flow uninteresting
 * to steal from.
 */
export default async function SignedIn({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  if (status === "expired") {
    return (
      <StatusPage title="That took a little too long">
        The sign-in expired while this tab was open. Go back to Mochi and start again. Nothing was
        changed.
      </StatusPage>
    );
  }

  if (status === "failed") {
    return (
      <StatusPage title="That did not work">
        Google did not confirm the sign-in. Go back to Mochi and try once more.
      </StatusPage>
    );
  }

  return (
    <StatusPage title="Signed in">
      You can close this tab. Mochi has already picked it up.
    </StatusPage>
  );
}
