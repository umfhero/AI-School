import type { Metadata } from "next";
import { headers } from "next/headers";
import SitePointerEffects from "./components/SitePointerEffects";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";

  return {
    metadataBase: new URL(`${protocol}://${host}`),
    title: {
      default: "AI school | Free course for building projects with AI",
      template: "%s | AI school",
    },
    description: "A free visual course for learning how to build reliable AI projects with project memory, model choice, agents, reusable skills and parallel workflows.",
    applicationName: "AI school",
    category: "Education",
    alternates: { canonical: "/" },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
    openGraph: {
      type: "website",
      locale: "en_GB",
      siteName: "AI school",
      title: "Build serious projects with AI, properly.",
      description: "A free course covering project memory, models, agents, skills and parallel workflows.",
      images: [{ url: "/og-home.png", width: 1200, height: 630, alt: "AI school, a free course for building projects with AI" }],
    },
    twitter: { card: "summary_large_image", title: "Build serious projects with AI, properly.", description: "A free course covering project memory, models, agents, skills and parallel workflows.", images: ["/og-home.png"] },
    manifest: "/site.webmanifest",
    icons: {
      icon: [
        { url: "/favicon-32.png?v=5", sizes: "32x32", type: "image/png" },
        { url: "/favicon-16.png?v=5", sizes: "16x16", type: "image/png" },
        { url: "/favicon.ico?v=5", type: "image/x-icon" },
        { url: "/favicon.svg?v=5", type: "image/svg+xml", sizes: "any" },
        { url: "/icon-96.png?v=5", sizes: "96x96", type: "image/png" },
        { url: "/icon-192.png?v=5", sizes: "192x192", type: "image/png" },
        { url: "/icon-512.png?v=5", sizes: "512x512", type: "image/png" },
      ],
      shortcut: "/favicon.ico?v=5",
      apple: [{ url: "/apple-touch-icon.png?v=5", sizes: "180x180", type: "image/png" }],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-GB"><body>{children}<SitePointerEffects /></body></html>;
}
