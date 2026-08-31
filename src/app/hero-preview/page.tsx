import type { Metadata } from "next";
import HeroSplit from "@/components/HeroSplit";

export const metadata: Metadata = {
  title: "Hero prototype",
  robots: { index: false, follow: false },
};

/** Scratch route for reviewing the creative hero concept in isolation. */
export default function HeroPreviewPage() {
  return (
    <div className="min-h-[100dvh] bg-background font-sans">
      <HeroSplit />
    </div>
  );
}
