"use client";

import Brand from "./Brand";
import { useLang } from "./LanguageProvider";

export default function Footer() {
  const { m } = useLang();

  const columns = [
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
        { label: m.nav.repo, href: "https://github.com/mochi-cli/mochi", external: true },
        { label: m.nav.repoHome, href: "https://github.com/mochi-cli/home", external: true },
        { label: m.nav.mcp, href: "/#features" },
      ],
    },
    {
      heading: m.footer.company,
      links: [
        { label: m.nav.changelog, href: "/changelog" },
        { label: m.nav.discussions, href: "https://github.com/mochi-cli/mochi/discussions", external: true },
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
