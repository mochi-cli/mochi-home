# Mochi Landing Page

Landing page for [Mochi](https://github.com/mochi-cli/mochi) — an agent-native
data assistant for Claude Code, Claude Desktop, OpenCode, and Hermes-Agent.
Built with Next.js (App Router), TypeScript, Tailwind CSS v4, and shadcn/ui.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## Structure

- `src/app` — layout, metadata, and the home page
- `src/components` — landing page sections (Hero, Workflow, AINative,
  Templates, MascotIntro, Subscription, CTASection, Navbar, Footer)
- `src/components/ProductPreview.tsx` — recreates the real Mochi table UI
  with shadcn `Table`, sharing the same design language as the product
- `src/components/ui` — shadcn/ui primitives (Button, Card, Badge, Table,
  Tabs, Sheet, Separator)

## Build

```bash
npm run build
npm run start
```
