import type { Metadata } from "next";
import PromoFilm from "@/components/promo/PromoFilm";
import { CUTS, type CutName } from "@/components/promo/script";

/* The promo film. Not linked from anywhere and kept out of the index: it is a
   thing to point a screen recorder at, not a page to land on. */
export const metadata: Metadata = {
  title: "Mochi — promo",
  robots: { index: false, follow: false },
};

export default async function Promo({
  searchParams,
}: {
  searchParams: Promise<{ cut?: string; loop?: string; t?: string; paused?: string; theme?: string }>;
}) {
  const { cut, loop, t, paused, theme } = await searchParams;
  const at = Number(t);
  return (
    <PromoFilm
      cut={cut && cut in CUTS ? (cut as CutName) : "film"}
      loop={loop === "1"}
      startAt={Number.isFinite(at) && at > 0 ? at * 1000 : 0}
      paused={paused === "1"}
      theme={theme === "light" || theme === "dark" ? theme : undefined}
    />
  );
}
