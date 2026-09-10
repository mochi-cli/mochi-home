import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import AINative from "@/components/AINative";
import Views from "@/components/Views";
import Templates from "@/components/Templates";
import Speed from "@/components/Speed";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import Pricing from "@/components/Pricing";
import StickyCTA from "@/components/StickyCTA";
import { plansOrNull } from "@/lib/service/plans";

/**
 * Rebuild the page at most once an hour.
 *
 * Without this the page is fully static, and the price is whatever Polar said
 * at deploy time — so raising it in Polar changes /v1/plans and the app, while
 * this page, the one somebody reads before clicking Get Pro, keeps quoting the
 * old number until an unrelated commit happens to redeploy. That is the exact
 * drift readPlans() exists to prevent, reintroduced by the cache.
 *
 * An hour rather than seconds: a price is read here far more often than it is
 * changed, and a stale hour after a change costs nothing next to rendering the
 * marketing page from scratch for every visitor.
 */
export const revalidate = 3600;

export default async function Home() {
  // Read once on the server so the price on the page is the price Polar charges.
  const plans = await plansOrNull();

  return (
    <div className="flex flex-1 flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        {/* pitch, install command, and the workspace itself running off the fold */}
        <Hero />
        <TrustStrip />


        {/* the product working: agents, git history, live collaboration, audit */}
        <AINative />

        {/* one dataset, five ways to look at it */}
        <Views />

        {/* what you start from */}
        <Templates />

        {/* light, fast, and cheap for an agent to ask questions of */}
        <Speed />

        <Pricing plans={plans} />

      </main>

      {/* closing ask and footer share one ink slab */}
      <CTASection />
      <Footer>
        <a
          href="https://www.scrolllaunch.com/products/mochi-table?ref=badge"
          target="_blank"
          rel="noopener"
        >
          <img
            src="https://www.scrolllaunch.com/api/badge/mochi-table"
            alt="Featured on ScrollLaunch"
            width="220"
            height="48"
            loading="lazy"
          />
        </a>
      </Footer>
      <StickyCTA />
    </div>
  );
}
