"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LangSwitcher from "./LangSwitcher";

const productLinks = [
  { href: "#workflow", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#templates", label: "Templates" },
];

const communityLinks = [
  { href: "https://github.com/mochi-cli/mochi", label: "GitHub repo" },
  { href: "https://github.com/mochi-cli/mochi/discussions", label: "Discussions" },
];

const flatLinks = [
  { href: "#pricing", label: "Pricing" },
  { href: "https://github.com/mochi-cli/mochi", label: "Docs", external: true },
  { href: "https://github.com/mochi-cli/mochi/releases", label: "Changelog", external: true },
];

function Logo() {
  return (
    <Link href="#top" className="flex items-center gap-2.5">
      <Image src="/logo.svg" alt="Mochi" width={128} height={32} priority className="h-7 w-auto" />
    </Link>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />

        <div className="hidden items-center gap-1 md:flex">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-[15px] font-medium text-foreground transition-colors hover:bg-secondary" />
              }
            >
              Product
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {productLinks.map((link) => (
                <DropdownMenuItem key={link.href} render={<a href={link.href} />}>
                  {link.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {flatLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="rounded-lg px-3 py-1.5 text-[15px] font-medium text-foreground transition-colors hover:bg-secondary"
            >
              {link.label}
            </a>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-[15px] font-medium text-foreground transition-colors hover:bg-secondary" />
              }
            >
              Community
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {communityLinks.map((link) => (
                <DropdownMenuItem
                  key={link.href}
                  render={<a href={link.href} target="_blank" rel="noopener noreferrer" />}
                >
                  {link.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <LangSwitcher />
          </div>
          <Button
            render={<a href="https://github.com/mochi-cli/mochi" target="_blank" rel="noopener noreferrer" />}
            nativeButton={false}
            variant="outline"
            className="hidden h-9 gap-1.5 rounded-lg px-3.5 text-[15px] sm:inline-flex"
          >
            <Star className="h-4 w-4" />
            Star on GitHub
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full md:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </nav>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-1 px-4">
            {[...productLinks, ...flatLinks, ...communityLinks].map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                {...("external" in link && link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="mt-auto flex items-center justify-between gap-3 border-t border-border p-4">
            <LangSwitcher />
            <Button
              render={<a href="https://github.com/mochi-cli/mochi" target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} />}
              nativeButton={false}
              variant="outline"
              className="gap-1.5 rounded-full px-4"
            >
              <Star className="h-4 w-4" />
              Star on GitHub
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
