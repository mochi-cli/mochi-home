import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageProvider";
import { EngineProvider } from "@/components/EngineProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mochi-cli.com";
const TWITTER_HANDLE = process.env.NEXT_PUBLIC_TWITTER_HANDLE ?? "";

const TITLE = "Mochi — The local-first data workspace for your team and AI agents";
const DESCRIPTION =
  "Build CRM, HR, inventory, or any internal tool — no code, no prompts, no monthly server fees. Runs on your laptop, syncs peer-to-peer, and works natively with Claude, Codex, and OpenCode.";
const SHORT_DESCRIPTION =
  "The local-first data workspace for your team and AI agents. Zero server bills — agent-native via MCP, peer-to-peer sync.";

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
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#131313" },
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
  keywords: [
    "Mochi",
    "agent-native database",
    "MCP",
    "Claude",
    "Codex",
    "OpenCode",
    "no-code database",
    "CRM template",
    "ERP template",
    "team collaboration",
    "peer-to-peer sync",
    "Git-backed data",
    "local-first database",
    "no server database",
    "internal tools",
    "AI data workspace",
  ],
  category: "developer tools",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/",
    languages: Object.fromEntries(LOCALES.map((l) => [l, `/?lang=${l}`])),
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Mochi",
    title: TITLE,
    description: SHORT_DESCRIPTION,
    locale: "en_US",
    alternateLocale: Object.values(OG_LOCALE_MAP).filter((l) => l !== "en_US"),
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mochi — the local-first data workspace for your team and AI agents",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: SHORT_DESCRIPTION,
    images: [{ url: "/og-image.png", alt: "Mochi — the local-first data workspace for your team and AI agents" }],
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
      image: `${SITE_URL}/og-image.png`,
      offers: [
        {
          "@type": "Offer",
          name: "Free",
          price: "0",
          priceCurrency: "USD",
        },
        {
          "@type": "Offer",
          name: "Pro",
          price: "19",
          priceCurrency: "USD",
          description: "One-time payment. Pay once, use forever.",
        },
      ],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <EngineProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </EngineProvider>
      </body>
    </html>
  );
}
