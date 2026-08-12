"use client";

import Image from "next/image";
import { useLang } from "./LanguageProvider";
import { Separator } from "@/components/ui/separator";

const columns = [
  {
    heading: "Product",
    links: [
      { label: "How it works", href: "#workflow" },
      { label: "Features", href: "#features" },
      { label: "Templates", href: "#templates" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
  {
    heading: "Developer",
    links: [
      { label: "GitHub — CLI", href: "https://github.com/mochi-cli/mochi", external: true },
      { label: "GitHub — Home", href: "https://github.com/mochi-cli/home", external: true },
      { label: "MCP integration", href: "#features" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Mochi", href: "#mochi" },
      { label: "Changelog", href: "https://github.com/mochi-cli/mochi/releases", external: true },
    ],
  },
];

export default function Footer() {
  const { m } = useLang();
  return (
    <footer className="relative border-t border-border bg-secondary/30">
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
            © {new Date().getFullYear()} Mochi. Data workspace for teams and agents.
          </span>
          <span className="mono inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-medium text-brand-soft-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            All systems operational
          </span>
        </div>
      </div>
    </footer>
  );
}
