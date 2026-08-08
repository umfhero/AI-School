import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";

  return {
    metadataBase: new URL(`${protocol}://${host}`),
    title: "AI Free Course | Build serious projects with AI",
    description: "A free visual course that takes you from messy chats to agents, skills and working AI systems.",
    openGraph: { title: "Build serious projects with AI, properly.", description: "A free course covering project memory, models, agents, skills and parallel workflows.", images: ["/og-home.png"] },
    twitter: { card: "summary_large_image", title: "Build serious projects with AI, properly.", images: ["/og-home.png"] },
    icons: {
      icon: [{ url: "/favicon-32.png", sizes: "32x32", type: "image/png" }],
      shortcut: "/favicon-32.png",
      apple: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-GB"><body>{children}</body></html>;
}
