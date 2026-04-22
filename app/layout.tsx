import type { Metadata, Viewport } from "next";
import { Space_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://api.astralune.cv"),
  title: "LuneApi - Powerful REST API Platform",
  description: "A seamless, high-performance REST API built for developers. Zero authentication required — just send a request and power up your applications instantly.",
  keywords: ["API", "download", "spotify", "youtube", "tiktok", "instagram", "lyrics", "REST API", "LuneApi", "LuneDev"],
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
      name: "LuneDev",
    },
  ],
  openGraph: {
    title: "LuneApi - Powerful REST API Platform",
    description: "A seamless, high-performance REST API built for developers. Zero authentication required — just send a request and power up your applications instantly.",
    url: "https://api.astralune.cv",
    siteName: "LuneApi",
    images: [
      {
        url: "https://api.astralune.cv/og.png",
        width: 1280,
        height: 640,
        alt: "LuneApi - Powerful REST API Platform",
        type: "image/png",
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LuneApi - Powerful REST API Platform",
    description: "A seamless, high-performance REST API built for developers. Zero authentication required — just send a request and power up your applications instantly.",
    images: ["https://api.astralune.cv/og.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  alternates: {
    canonical: "/",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "LuneApi",
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
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/github-dark.min.css" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('lune-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                  document.documentElement.setAttribute('data-theme', t);
                  if (t === 'dark') document.documentElement.classList.add('dark');
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={spaceMono.variable} style={{ fontFamily: "var(--font-mono)", background: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
        <ThemeProvider>
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
