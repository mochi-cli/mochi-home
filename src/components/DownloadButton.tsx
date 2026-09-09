"use client";

import { useState } from "react";
import { useLang } from "./LanguageProvider";
import { DOWNLOAD_URL } from "@/lib/links";
import { useDownloadHref } from "@/lib/useDownloadHref";
import type { Arch } from "@/lib/arch";

/**
 * The download, pointed at the build this machine can actually run.
 *
 * Detection is real but not trusted blindly: it is named on screen and it can
 * be overridden in one click. The user agent is no help — an M3 Pro reports
 * "Intel Mac OS X" — so this asks the architecture API and the GPU instead,
 * and when neither answers it says so rather than picking silently.
 *
 * The point is not to be right every time. It is that being wrong costs one
 * click instead of a 48MB download of an app that will not open.
 */
export default function DownloadButton({ className }: { className?: string }) {
  const { m } = useLang();
  const { href, arch } = useDownloadHref();
  const [chosen, setChosen] = useState(false);

  // Until it is known, the button points at the default. It is never disabled:
  // a download that waits on a GPU query is a download that some people never
  // get, and the wrong build is recoverable while a dead button is not.
  const effective: Arch = arch ?? "arm64";
  const other: Arch = effective === "arm64" ? "x64" : "arm64";
  const otherHref = other === "arm64" ? DOWNLOAD_URL : `${DOWNLOAD_URL}?arch=x64`;

  const name = (value: Arch) => (value === "arm64" ? m.hero.archApple : m.hero.archIntel);

  return (
    <>
      <a href={href} className={className}>
        {m.hero.download}
      </a>
      <p className="mt-4 basis-full text-[13px] text-ink-3">
        {m.hero.requirements}{" "}
        {arch && !chosen ? (
          <>
            {m.hero.detected.replace("{arch}", name(effective))}{" "}
            <a
              href={otherHref}
              onClick={() => setChosen(true)}
              className="text-ink underline underline-offset-4 transition-colors hover:text-ink-2"
            >
              {m.hero.switchTo.replace("{arch}", name(other))}
            </a>
          </>
        ) : (
          <>
            {m.hero.chooseUnknown}{" "}
            <a href={DOWNLOAD_URL} className="text-ink underline underline-offset-4">
              {m.hero.archApple}
            </a>
            {" · "}
            <a href={`${DOWNLOAD_URL}?arch=x64`} className="text-ink underline underline-offset-4">
              {m.hero.archIntel}
            </a>
          </>
        )}
      </p>
    </>
  );
}
