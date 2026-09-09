"use client";

import { useEffect, useState } from "react";
import { DOWNLOAD_URL } from "@/lib/links";
import { detectMacArch, type Arch } from "@/lib/arch";

/**
 * The download link, pointed at the build this machine can run.
 *
 * A hook rather than a component because there are five download buttons —
 * hero, navbar, pricing, the closing block and the sticky bar — and four of
 * them are too small to carry an explanation. What they cannot be is
 * inconsistent: somebody who scrolls past the hero and clicks the one in the
 * pricing table must get the same file.
 *
 * Defaults to Apple Silicon while detection is in flight, and stays on it if
 * detection cannot answer. Never blocks the click: a button that waits on a
 * GPU query is a button some people never get to use, and the wrong build
 * costs one click while a dead button costs the sale.
 */
export function useDownloadHref(): { href: string; arch: Arch | null } {
  const [arch, setArch] = useState<Arch | null>(null);

  useEffect(() => {
    let alive = true;
    void detectMacArch().then((found) => {
      if (alive) setArch(found);
    });
    return () => {
      alive = false;
    };
  }, []);

  return {
    arch,
    href: arch === "x64" ? `${DOWNLOAD_URL}?arch=x64` : DOWNLOAD_URL,
  };
}
