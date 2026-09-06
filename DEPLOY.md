# Moving to a new domain

The marketing site and the account service used to be two deployments. They are
one now, which makes this simpler than it was: there is a single origin, and
five places have to agree on what it is.

Get those five wrong in different ways and the failure is quiet — sign-in
redirects to a page that no longer exists, or a subscription is paid for and
never recorded. So the order below matters, and there is a check at the end of
each step that tells you whether it worked.

Throughout, `NEW` means the domain you are moving to, with no trailing slash.
Example: `https://mochi.dev`.

---

## 1. Point the domain at the deployment

In Vercel, add `NEW` to this project and let it issue the certificate. Nothing
else works until DNS resolves, so do this first and give it a minute.

**Check:** `curl -I https://NEW` returns a certificate for `NEW` and a `200`.

---

## 2. Set the environment variables

Two of them have to name the same origin. This is the single most common way
this migration breaks, because a mismatch does not error — it redirects
somewhere that looks almost right.

```
NEXT_PUBLIC_SITE_URL=https://NEW
SERVICE_ORIGIN=https://NEW
```

`NEXT_PUBLIC_SITE_URL` is what the pages link to. `SERVICE_ORIGIN` is what
Google redirects back to and what Polar posts webhooks to.

Everything else carries over unchanged from `.env.local`. Copy the whole file
into Vercel under Settings → Environment Variables, ticking Production.

> One thing to decide, and it is in `.env.local` as a comment: the site and the
> service were using **two different Polar tokens**. Only one can win now. The
> service's is set, because it is the one that reads products, opens checkouts
> and the portal, and verifies webhooks. Confirm that
> `NEXT_PUBLIC_POLAR_PRO_PRODUCT_ID` belongs to the same Polar organisation as
> that token, or the one-off checkout at `/api/checkout` will fail on its own
> while everything else looks fine.

**Check:** `npm run check:env` locally. It touches every variable and lists all
the complaints at once rather than stopping at the first, and it fails
placeholders like `replace_me` instead of calling them present.

---

## 3. Apply the database schema

The merge added a table. The profile page signs a browser in with a session
that is deliberately **not** the app's refresh token, and that session needs
somewhere to live.

```bash
npm run db:schema
```

Safe to run against the existing database: every statement is
`CREATE TABLE IF NOT EXISTS`.

**Check:** `curl https://NEW/health` reports no missing tables.

---

## 4. Update the Google redirect URI

Google console → Credentials → your OAuth client → Authorised redirect URIs.

Add exactly:

```
https://NEW/auth/google/callback
```

Keep the old one until step 7 is done and shipped, or anyone still running the
previous CLI build will be redirected to a URI Google now rejects.

**Check:** open `https://NEW/profile` and press Sign in with Google. You should
land back on `/profile` signed in, not on a Google error page.

---

## 5. Update the Polar webhook

Polar dashboard → Webhooks → the endpoint for this product.

```
https://NEW/webhooks/polar
```

The signing secret does not change, so `POLAR_WEBHOOK_SECRET` stays as it is.

**Check:** send a test delivery from Polar. It should return `200`. If it
returns `404` with a message about `wrong_path`, the endpoint was registered as
the bare origin without the path — that middleware exists precisely because
that mistake once cost four silent delivery failures.

---

## 6. Verify the service end to end

```bash
curl https://NEW/health        # ready: true, no missing tables, no missing env
curl https://NEW/v1/plans      # the real monthly and yearly price
```

Then open `https://NEW` and check the pricing section shows those same numbers.
It reads them through the same function `/v1/plans` does, so if the page and the
API disagree something is cached, not misconfigured.

---

## 7. Update the CLI, which has the old URL compiled in

This is the step that is easy to forget, because nothing on the website reveals
it. In the app repo, `src/server/account/service.ts`:

```ts
const SERVICE =
  process.env.MOCHI_ACCOUNT_SERVICE?.trim().replace(/\/$/, '') || 'https://mochi-service.vercel.app';
```

That default is compiled into every published copy. Change it to `https://NEW`,
release, and until people update, existing installs keep talking to the old
origin — so **leave the old deployment running** until the release has spread.

`MOCHI_ACCOUNT_SERVICE` overrides it, which is how you can test a new origin
before shipping one.

**Check:** with the new build, `mochi-table` sign-in completes and
`init codex --status` reports the account.

---

## 8. Retire the old deployment

Only once step 7's release is out and installs have moved. Watch the old
project's logs for `/v1/entitlement` traffic: while that is non-zero, somebody
is still pointed at it.

---

## If something goes wrong

Nothing here touches table data. Rows never leave anybody's machine, so the
worst case is that sign-in and billing stop working while the site keeps
serving — and both are fixed by putting the old `SERVICE_ORIGIN` back and
redeploying.
