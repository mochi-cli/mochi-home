"use client";

import type { ReactNode } from "react";
import { useDownloadHref } from "@/lib/useDownloadHref";

/**
 * A download link anywhere, pointed at the right build.
 *
 * For the places that need the link but not the explanation — a server-
 * rendered docs page, the thank-you page after checkout. The detection has to
 * run in the browser, so this is the smallest client component that can carry
 * it: everything else about those pages stays static.
 */
export default function DownloadLink({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const { href } = useDownloadHref();
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}
