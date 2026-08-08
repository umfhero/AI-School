import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";

  return {
    metadataBase: new URL(`${protocol}://${host}`),
    title: "AI workflow course | Build serious projects with AI",
    description: "A free visual course that takes you from messy chats to agents, skills and working AI systems.",
    openGraph: { title: "Build serious projects with AI, properly.", description: "A free course covering project memory, models, agents, skills and parallel workflows.", images: ["/og-home.png"] },
    twitter: { card: "summary_large_image", title: "Build serious projects with AI, properly.", images: ["/og-home.png"] },
    manifest: "/site.webmanifest",
    icons: {
      icon: [
        { url: "/favicon.ico?v=4", sizes: "any" },
        { url: "/favicon.svg?v=4", type: "image/svg+xml" },
        { url: "/favicon-16.png?v=4", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32.png?v=4", sizes: "32x32", type: "image/png" },
        { url: "/icon-96.png?v=4", sizes: "96x96", type: "image/png" },
        { url: "/icon-192.png?v=4", sizes: "192x192", type: "image/png" },
        { url: "/icon-512.png?v=4", sizes: "512x512", type: "image/png" },
      ],
      shortcut: "/favicon.ico?v=4",
      apple: [{ url: "/apple-touch-icon.png?v=4", sizes: "180x180", type: "image/png" }],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-GB"><body>{children}</body></html>;
}
