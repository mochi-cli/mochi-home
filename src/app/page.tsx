import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import Workflow from "@/components/Workflow";
import AINative from "@/components/AINative";
import Templates from "@/components/Templates";
import MascotIntro from "@/components/MascotIntro";
import Subscription from "@/components/Subscription";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import StickyCTA from "@/components/StickyCTA";

const REPO = "mochi-cli/mochi";

/** A live star count is the cheapest social proof this page can carry, and the
 *  "Star on GitHub" button is already the best place to put it. Failing softly
 *  matters more than the number: rate limits and outages just drop the count. */
async function getStars(): Promise<number | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}`, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data: unknown = await res.json();
    const count =
      typeof data === "object" && data !== null && "stargazers_count" in data
        ? (data as { stargazers_count: unknown }).stargazers_count
        : undefined;
    return typeof count === "number" ? count : null;
  } catch {
    return null;
  }
}

export default async function Home() {
  const stars = await getStars();

  return (
    <div className="flex flex-1 flex-col bg-background font-sans">
      <Navbar stars={stars} />
      <main className="flex-1">
        {/* 1. Hook — giới thiệu sản phẩm + demo agent */}
        <Hero />
        <TrustStrip />

        {/* 2. How it works — 3 bước sử dụng */}
        <Workflow />

        {/* 3. AI-native — chat, templates, live collab, and rollback in one numbered demo */}
        <AINative />

        {/* 4. Templates — các template có sẵn */}
        <Templates />

        {/* 5. Trust — giới thiệu Mochi + so sánh Excel/Copilot/Airtable, trước khi vào giá */}
        <MascotIntro />

        {/* 6. Pricing — bảng giá */}
        <Subscription />

        {/* 7. Final CTA */}
        <CTASection />
      </main>
      <Footer />
      <StickyCTA />
    </div>
  );
}
