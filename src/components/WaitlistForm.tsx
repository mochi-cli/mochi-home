"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import { Check } from "lucide-react";
import { useLang } from "./LanguageProvider";
import { Button } from "@/components/ui/button";

/** Server-side keys can't be read from the client, so the form is gated on a
 *  separate public flag — same idea as NEXT_PUBLIC_POLAR_PRO_PRODUCT_ID hiding
 *  the checkout button when Polar isn't wired up yet. */
export const waitlistEnabled =
  process.env.NEXT_PUBLIC_WAITLIST_ENABLED === "true";

type State = "idle" | "sending" | "done" | "invalid" | "error";

export default function WaitlistForm() {
  const { m } = useLang();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === "sending") return;
    setState("sending");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setState("done");
        track("waitlist_signup");
        return;
      }
      setState(res.status === 400 ? "invalid" : "error");
    } catch {
      setState("error");
    }
  };

  if (state === "done") {
    return (
      <p className="mt-6 flex items-center gap-2 text-sm font-medium text-brand-soft-foreground">
        <Check className="h-4 w-4 flex-none text-brand" />
        {m.waitlist.success}
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="mt-6">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state !== "idle") setState("idle");
          }}
          placeholder={m.waitlist.placeholder}
          aria-label={m.waitlist.title}
          className="h-11 min-w-0 flex-1 rounded-full border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground/30"
        />
        <Button
          type="submit"
          size="lg"
          variant="outline"
          disabled={state === "sending"}
          className="h-11 flex-none rounded-full px-5 text-sm"
        >
          {state === "sending" ? m.waitlist.sending : m.waitlist.button}
        </Button>
      </div>
      {(state === "invalid" || state === "error") && (
        <p role="alert" className="mt-2 text-xs text-destructive">
          {state === "invalid" ? m.waitlist.invalid : m.waitlist.error}
        </p>
      )}
    </form>
  );
}
