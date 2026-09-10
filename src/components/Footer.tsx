"use client";

import type { ReactNode } from "react";
import Brand from "./Brand";
import { useLang } from "./LanguageProvider";

export default function Footer({ children }: { children?: ReactNode }) {
  const { m } = useLang();

  const columns: Array<{
    heading: string;
    links: Array<{ label: string; href: string; external?: boolean }>;
  }> = [
    {
      heading: m.footer.product,
      links: [
        { label: m.nav.features, href: "/#features" },
        { label: m.nav.templates, href: "/#templates" },
        { label: m.nav.pricing, href: "/#pricing" },
      ],
    },
    {
      heading: m.footer.developer,
      links: [
        { label: m.nav.docs, href: "/docs" },
        { label: m.nav.mcp, href: "/#features" },
      ],
    },
    {
      heading: m.footer.company,
      links: [
        { label: m.nav.changelog, href: "/changelog" },
        // Reachable from every page. A terms page nobody links to is a terms
        // page nobody has been shown, which is most of the point of having one.
        { label: m.nav.terms, href: "/terms" },
        { label: m.nav.privacy, href: "/privacy" },
        { label: m.nav.refund, href: "/refund" },
      ],
    },
  ];

  return (
    <footer className="on-ink pt-28 md:pt-36">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="grid gap-12 border-t border-line pt-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-xs">
            <Brand onInk />
            <p className="mt-5 text-[15px] leading-relaxed text-ink-2">{m.footer.tagline}</p>
            <a
              href="https://letslaunch.today/product/mochi"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex transition-opacity hover:opacity-80"
              aria-label="Mochi on LetsLaunch"
            >
              <img
                src="https://letslaunch.today/badge/mochi.svg"
                alt="Mochi on LetsLaunch"
                width={250}
                height={54}
                loading="lazy"
              />
            </a>
            {children && (
              <div aria-label="As featured in" className="mt-7">
                {children}
              </div>
            )}
          </div>

          {columns.map((col) => (
            <div key={col.heading}>
              <p className="text-[15px] text-ink">{col.heading}</p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="text-[15px] text-ink-2 transition-colors hover:text-ink"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-line py-8 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-[14px] text-ink-3">
            © {new Date().getFullYear()} Mochi. {m.footer.copyright}
          </span>
          <span className="text-[14px] text-ink-3">{m.footer.status}</span>
        </div>
      </div>
    </footer>
  );
}
