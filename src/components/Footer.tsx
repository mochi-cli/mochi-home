"use client";

import Image from "next/image";
import { useLang } from "./LanguageProvider";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  const { m } = useLang();

  const columns = [
    {
      heading: m.footer.product,
      links: [
        { label: m.nav.howItWorks, href: "#workflow" },
        { label: m.nav.features, href: "#features" },
        { label: m.nav.templates, href: "#templates" },
        { label: m.nav.pricing, href: "#pricing" },
      ],
    },
    {
      heading: m.footer.developer,
      links: [
        { label: m.nav.repo, href: "https://github.com/mochi-cli/mochi", external: true },
        { label: m.nav.repoHome, href: "https://github.com/mochi-cli/home", external: true },
        { label: m.nav.mcp, href: "#features" },
      ],
    },
    {
      heading: m.footer.company,
      links: [
        { label: m.nav.about, href: "#mochi" },
        { label: m.nav.changelog, href: "https://github.com/mochi-cli/mochi/releases", external: true },
      ],
    },
  ];
  return (
    <footer className="section-alt relative border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="max-w-xs">
            <Image src="/logo.svg" alt="Mochi" width={128} height={32} className="h-7 w-auto" />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {m.footer.tagline}
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.heading}>
              <p className="eyebrow">{col.heading}</p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="mt-12" />

        <div className="mt-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <span className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Mochi. {m.footer.copyright}
          </span>
          <span className="mono inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-medium text-brand-soft-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            {m.footer.status}
          </span>
        </div>
      </div>
    </footer>
  );
}
