# Polar product copy

What to paste into the two production products. Both descriptions describe the
*same* Pro plan — only the cadence and the price differ — because they are the
same entitlement, and a checkout that describes them differently is a refund
waiting to happen.

Images: `brand/polar/pro-monthly.png` and `brand/polar/pro-yearly.png`,
regenerated with `node scripts/product-image.ts` whenever a price changes.

Every claim below is one the shipped app actually enforces
(`src/server/account/entitlement.ts`): Pro lifts the weekly agent-call limit
and raises the attachment ceiling. Nothing else is gated, so nothing else is
promised here.

---

## Product 1 — name

```
Mochi Pro — monthly
```

## Product 1 — description

```
Mochi is a table that lives on your machine and that your AI agents can use directly.

Free covers one person: 500 agent calls a week, unlimited workspaces and tables, full history and undo. **Pro removes the weekly limit.**

### What Pro adds

- **Agent calls with no weekly limit.** Free stops at 500 a week; Pro does not stop.
- **Attachments up to 100 MB**, against 25 MB on Free.
- **Sign in on up to three of your own machines** — laptop, desktop, spare.

### What Mochi is, on either plan

- **Your rows never leave your machine.** This service stores your email and what you pay. It has never seen a cell of your data and has no way to ask for one.
- **Works with the agent you already use** — Claude Code, Claude Desktop, Codex, OpenCode — over MCP, as typed tools rather than guessed formulas.
- **Every write is recorded and reversible.** Who changed what, which agent did it, and one click back.
- **No code and no prompting required.** Design a schema, filter, and group by pointing at things.
- **Nothing to install first.** The Mac app is self-contained — Apple Silicon and Intel — and there is no Node, no server and no account to set up before it runs.

$5 a month. Cancel whenever you like: Pro runs to the end of the period you have paid for, and your data keeps working on the free plan afterwards, on your machine, exactly where it already was.

Sold by Polar, our merchant of record. Questions: kurodenjiro@gmail.com
```

---

## Product 2 — name

```
Mochi Pro — yearly
```

## Product 2 — description

Identical to the monthly description, with the price paragraph replaced by:

```
$48 a year — two months free against paying monthly. Cancel whenever you like: Pro runs to the end of the year you have paid for, and your data keeps working on the free plan afterwards, on your machine, exactly where it already was.
```

---

## Deliberately not claimed

The pricing page on the site still lists **seats for your team** and **shared
workspaces** under Pro. Neither is built (`mochi-cli/mochi#39`), and neither is
gated: `planFor` returns one seat for every subscription there is. Selling
those at a Polar checkout is a chargeback with a merchant of record attached,
so they are absent here — and the site's own list should lose them before the
production products go live.
