"use client";

import { useEffect, useState } from "react";

export interface Session {
  signedIn: boolean;
  email?: string;
  plan?: "free" | "pro";
}

/**
 * Asked once after mount, because the session lives in an httpOnly cookie and
 * the pages that carry the nav are static. `null` means "not known yet", which
 * is different from "signed out": rendering a Log in button before the answer
 * arrives makes it flicker for everybody who is already signed in.
 */
export function useSession(): Session | null {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/session", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { signedIn: false }))
      .then((s: Session) => { if (!cancelled) setSession(s); })
      .catch(() => { if (!cancelled) setSession({ signedIn: false }); });
    return () => { cancelled = true; };
  }, []);

  return session;
}
