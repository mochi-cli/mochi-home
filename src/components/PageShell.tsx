import type { ReactNode } from "react";
import Navbar from "./Navbar";
import CTASection from "./CTASection";
import Footer from "./Footer";

/** Everything that is not the landing page: same chrome, same closing block,
 *  and the one header shape the rest of the site uses. */
export default function PageShell({
  kicker,
  title,
  sub,
  children,
}: {
  kicker: string;
  title: string;
  sub?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        <header className="mx-auto max-w-[1280px] px-5 pt-16 sm:px-8 sm:pt-20">
          <p className="kicker">{kicker}</p>
          <h1 className="display mt-4 max-w-[18ch]">{title}</h1>
          {sub && <p className="lead mt-6 max-w-[56ch]">{sub}</p>}
        </header>
        {children}
      </main>
      <CTASection />
      <Footer />
    </div>
  );
}
