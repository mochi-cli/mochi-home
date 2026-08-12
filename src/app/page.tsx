import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Workflow from "@/components/Workflow";
import AINative from "@/components/AINative";
import Templates from "@/components/Templates";
import MascotIntro from "@/components/MascotIntro";
import Subscription from "@/components/Subscription";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-background font-sans">
      <Navbar />
      <main className="flex-1">
        {/* 1. Hook — giới thiệu sản phẩm + demo multi-user */}
        <Hero />

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
    </div>
  );
}
