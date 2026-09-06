import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import AINative from "@/components/AINative";
import Views from "@/components/Views";
import Templates from "@/components/Templates";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import Pricing from "@/components/Pricing";
import StickyCTA from "@/components/StickyCTA";
import { plansOrNull } from "@/lib/service/plans";


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

        <Pricing plans={plans} />

      </main>

      {/* closing ask and footer share one ink slab */}
      <CTASection />
      <Footer />
      <StickyCTA />
    </div>
  );
}
