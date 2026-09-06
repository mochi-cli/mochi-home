"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Brand from "./Brand";

import { Menu, X } from "lucide-react";
import LangSwitcher from "./LangSwitcher";
import { useLang } from "./LanguageProvider";
import { DOWNLOAD_URL } from "@/lib/links";
import { useSession } from "./useSession";


export default function Navbar() {
  const [open, setOpen] = useState(false);
  const session = useSession();

  // Scroll lock while the sheet is up, so the page does not slide underneath
  // it on iOS, and Escape to close, because a full screen panel with no key to
  // dismiss it is a trap for anyone not using a thumb.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const { m } = useLang();

  // Absolute rather than bare hashes: this nav also renders on /docs and
  // /changelog, where "#features" would scroll to nothing.
  const links: { href: string; label: string; external?: boolean }[] = [
    { href: "/#features", label: m.nav.features },
    { href: "/#templates", label: m.nav.templates },
    { href: "/#pricing", label: m.nav.pricing },
    { href: "/docs", label: m.nav.docs },
    { href: "/changelog", label: m.nav.changelog },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/85 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-[1280px] items-center gap-8 px-5 sm:px-8">
        <Link href="/" className="flex flex-none items-center" aria-label="Mochi">
          <Brand priority />
        </Link>

        <div className="hidden flex-1 items-center gap-7 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="text-[15px] text-ink-2 transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-5 lg:ml-0">
          <div className="hidden sm:block">
            <LangSwitcher />
          </div>
          {/* Nothing until the answer arrives: showing "Log in" to somebody
              who is already signed in and then correcting it is worse than a
              beat of empty space. */}
          {session && (
            <div className="hidden items-center gap-4 sm:flex">
              {session.signedIn && session.plan === "free" && (
                <a
                  href="/profile"
                  className="inline-flex h-8 items-center rounded-[var(--r)] bg-ink px-3 text-[15px] text-ink-inv transition-opacity hover:opacity-88"
                >
                  {m.price.cta}
                </a>
              )}
              <a
                href="/profile"
                className="inline-flex h-8 items-center rounded-[var(--r)] border border-line-strong px-3 text-[15px] text-ink transition-colors hover:bg-paper-sunk"
              >
                {session.signedIn ? m.nav.account : m.nav.login}
              </a>
            </div>
          )}
          <button
            onClick={() => setOpen(true)}
            aria-label={m.nav.openMenu}
            aria-expanded={open}
            className="-mr-1 flex h-8 w-8 items-center justify-center rounded-[var(--r)] text-ink transition-colors hover:bg-paper-sunk lg:hidden"
          >
            <Menu className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </button>
        </div>
      </nav>

      {/* The mobile sheet. It scrolls, because six links plus a language row
          plus a button does not fit on a small phone, and a panel that cannot
          scroll simply hides whatever is past the fold. */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={m.nav.menu}
          className="fixed inset-0 z-[60] flex flex-col overflow-y-auto overscroll-contain bg-paper lg:hidden"
        >
          <div className="sticky top-0 flex h-16 flex-none items-center justify-between bg-paper px-5 sm:px-8">
            <Brand />
            <button
              onClick={() => setOpen(false)}
              aria-label={m.nav.menu}
              autoFocus
              className="-mr-1 flex h-8 w-8 items-center justify-center rounded-[var(--r)] text-ink transition-colors hover:bg-paper-sunk"
            >
              <X className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </button>
          </div>

          <div className="flex flex-col px-5 pb-10 pt-4 sm:px-8">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="border-b border-line py-4 text-xl font-[380] tracking-[-0.02em] text-ink"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/profile"
              onClick={() => setOpen(false)}
              className="border-b border-line py-4 text-xl font-[380] tracking-[-0.02em] text-ink"
            >
              {session?.signedIn ? m.nav.account : m.nav.login}
            </a>

            {session?.signedIn && session.plan === "free" && (
              <a
                href="/profile"
                onClick={() => setOpen(false)}
                className="border-b border-line py-4 text-xl font-[380] tracking-[-0.02em] text-ink"
              >
                {m.price.cta}
              </a>
            )}

            <a
              href={DOWNLOAD_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="mt-8 inline-flex h-12 items-center justify-center rounded-[var(--r)] bg-ink px-6 text-[15px] text-ink-inv transition-opacity active:translate-y-px"
            >
              {m.hero.download}
            </a>

            <div className="mt-8">
              <LangSwitcher inline />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
