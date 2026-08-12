# Mochi Landing Page

Landing page cho [Mochi](https://github.com/mochi-cli/mochi) — trợ lý dữ liệu
agent-native cho Claude, Codex và OpenCode. Xây dựng bằng Next.js (App
Router), TypeScript, Tailwind CSS v4 và shadcn/ui.

## Bắt đầu

```bash
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem kết quả.

## Cấu trúc

- `src/app` — layout, metadata và trang chủ
- `src/components` — các section của landing page (Hero, Workflow, AINative,
  Templates, MascotIntro, Subscription, CTASection, Navbar, Footer)
- `src/components/ProductPreview.tsx` — dựng lại giao diện bảng Mochi thật
  bằng shadcn `Table`, dùng chung ngôn ngữ thiết kế với sản phẩm
- `src/components/ui` — các primitive shadcn/ui (Button, Card, Badge, Table,
  Tabs, Sheet, Separator)

## Build

```bash
npm run build
npm run start
```
