import type { Metadata } from "next";
import StatusPage from "@/components/StatusPage";

// A billing redirect lands here; it is not a page to find.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function Cancelled() {
  return (
    <StatusPage title="Nothing was charged">
      You can close this tab. Your plan has not changed, and the free tier carries on as it was.
    </StatusPage>
  );
}
