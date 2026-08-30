import { NextResponse } from "next/server";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

// Deliberately loose. Real validation is the mail provider's job — this only
// rejects obvious junk before we spend a network call on it.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: Request) {
  if (!RESEND_API_KEY || !AUDIENCE_ID) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const email =
    typeof payload === "object" && payload !== null && "email" in payload
      ? (payload as { email: unknown }).email
      : undefined;

  if (typeof email !== "string" || !EMAIL.test(email.trim())) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const res = await fetch(
    `https://api.resend.com/audiences/${AUDIENCE_ID}/contacts`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email.trim(), unsubscribed: false }),
    },
  );

  if (!res.ok) {
    // Keep the provider's response out of the client payload; log it for us.
    console.error("waitlist: resend responded", res.status, await res.text());
    return NextResponse.json({ error: "upstream" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
