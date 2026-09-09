import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageProvider";
import { Analytics } from "@vercel/analytics/next";


const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mochi-cli.com";
const TWITTER_HANDLE = process.env.NEXT_PUBLIC_TWITTER_HANDLE ?? "";

const TITLE = "Mochi · One place for all your team's work";
const DESCRIPTION =
  "Build a customer list, a hiring tracker, or anything else your team needs. It all lives on your own computer, there is nothing to run and no monthly bill, and Claude, Codex and OpenCode can work in it with you.";
const SHORT_DESCRIPTION =
  "One place for your team's data. It stays on your machines, there is no monthly bill, and your AI can work in it too.";

const LOCALES = ["en", "es", "fr", "de", "ja", "zh", "vi"] as const;
const OG_LOCALE_MAP: Record<(typeof LOCALES)[number], string> = {
  en: "en_US",
  es: "es_ES",
  fr: "fr_FR",
  de: "de_DE",
  ja: "ja_JP",
  zh: "zh_CN",
  vi: "vi_VN",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f6f6" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s · Mochi",
  },
  description: DESCRIPTION,
  applicationName: "Mochi",
  authors: [{ name: "Mochi", url: "https://github.com/mochi-cli" }],
  creator: "Mochi",
  publisher: "Mochi",
  generator: "Next.js",
  // Search terms, not page copy: these are what somebody types, including the
  // compound words the visible writing deliberately avoids.
  keywords: [
    "Mochi",
    "Mochi Table",
    "local-first database",
    "offline database app",
    "spreadsheet alternative",
    "Airtable alternative",
    "AI database",
    "MCP server",
    "Claude MCP",
    "Codex MCP",
    "OpenCode",
    "no-code database",
    "CRM template",
    "inventory tracker",
    "hiring tracker",
    "internal tools",
    "team database no server",
    "Git version history data",
  ],
  category: "developer tools",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    // The SVG first, a 32px raster after it: the mark is cut rather than
    // stroked, and the handful of clients that still refuse SVG would
    // otherwise show nothing at all.
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
    ],
    shortcut: "/favicon.svg",
    // PNG, not the SVG: iOS ignores an SVG here and screenshots the page
    // instead, so a bookmarked Mochi would carry a picture of the hero.
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/",
    languages: Object.fromEntries(LOCALES.map((l) => [l, `/?lang=${l}`])),
  },
  openGraph: {
    type: "website",
    determiner: "",
    url: SITE_URL,
    siteName: "Mochi",
    title: TITLE,
    description: SHORT_DESCRIPTION,
    locale: "en_US",
    alternateLocale: Object.values(OG_LOCALE_MAP).filter((l) => l !== "en_US"),
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: SHORT_DESCRIPTION,
    ...(TWITTER_HANDLE ? { site: TWITTER_HANDLE, creator: TWITTER_HANDLE } : {}),
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    }),
    ...(process.env.NEXT_PUBLIC_YANDEX_VERIFICATION && {
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    }),
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Mochi",
      url: SITE_URL,
      logo: `${SITE_URL}/favicon.svg`,
      sameAs: ["https://github.com/mochi-cli/mochi"],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Mochi",
      description: DESCRIPTION,
      inLanguage: "en-US",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#software`,
      name: "Mochi",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "macOS, Linux, Windows",
      description: DESCRIPTION,
      url: SITE_URL,
      image: `${SITE_URL}/opengraph-image`,
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <LanguageProvider>{children}</LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
