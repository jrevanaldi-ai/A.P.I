import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  metadataBase: new URL("https://kiracloud.me"),
  title: "Kiracloud API - Powerful REST API Platform",
  description: "A seamless, high-performance REST API built for developers. Zero authentication required — just send a request and power up your applications instantly.",
  keywords: ["API", "download", "spotify", "youtube", "tiktok", "instagram", "lyrics", "REST API"],
  verification: {
    google: "your-google-verification-code",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  authors: [
    {
      name: "Kiracloud",
    },
  ],
  openGraph: {
    title: "Kiracloud API - Powerful REST API Platform",
    description: "A seamless, high-performance REST API built for developers. Zero authentication required — just send a request and power up your applications instantly.",
    url: "https://kiracloud.me",
    siteName: "Kiracloud API",
    images: [
      {
        url: "https://kiracloud.me/api/og",
        width: 1280,
        height: 640,
        alt: "Kiracloud API - Powerful REST API Platform",
        type: "image/png",
      },
      {
        url: "https://kiracloud.me/api/og",
        width: 800,
        height: 600,
        alt: "Kiracloud API",
        type: "image/png",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kiracloud API - Powerful REST API Platform",
    description: "A seamless, high-performance REST API built for developers. Zero authentication required — just send a request and power up your applications instantly.",
    images: ["https://kiracloud.me/api/og"],
  },
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext x='50' y='72' font-size='80' font-weight='700' fill='%23ffffff' text-anchor='middle' font-family='Courier%20New%2C%20Monaco%2C%20monospace' letter-spacing='-3'%3EK%3C/text%3E%3C/svg%3E",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Ctext x='16' y='26' font-size='28' font-weight='700' fill='%23ffffff' text-anchor='middle' font-family='Courier%20New%2C%20Monaco%2C%20monospace' letter-spacing='-1'%3EK%3C/text%3E%3C/svg%3E",
        sizes: "32x32",
        type: "image/svg+xml",
      },
      {
        url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Ctext x='8' y='13' font-size='14' font-weight='700' fill='%23ffffff' text-anchor='middle' font-family='Courier%20New%2C%20Monaco%2C%20monospace' letter-spacing='-0.5'%3EK%3C/text%3E%3C/svg%3E",
        sizes: "16x16",
        type: "image/svg+xml",
      },
    ],
    apple: [
      {
        url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 180 180'%3E%3Crect width='180' height='180' fill='%2300bc96' rx='40'/%3E%3Ctext x='90' y='140' font-size='120' font-weight='700' fill='%23ffffff' text-anchor='middle' font-family='Courier%20New%2C%20Monaco%2C%20monospace' letter-spacing='-2'%3EK%3C/text%3E%3C/svg%3E",
        sizes: "180x180",
      },
    ],
  },
  alternates: {
    canonical: "/",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Kiracloud API",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#00bc96",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/github-dark.min.css" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('kiracloud-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                  document.documentElement.setAttribute('data-theme', t);
                  if (t === 'dark') document.documentElement.classList.add('dark');
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body style={{ fontFamily: "var(--font-mono)", background: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
        <ThemeProvider>
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
