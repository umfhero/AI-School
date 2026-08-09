import type { Metadata } from "next";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import NotificationsClient from "./NotificationsClient";

export const metadata: Metadata = {
  title: "Notifications",
  description: "Your AI school updates and requests.",
  alternates: { canonical: "/notifications" },
  robots: { index: false, follow: false },
};

export default function NotificationsPage() {
  return <main className="notifications-page" id="top">
    <SiteHeader />
    <NotificationsClient />
    <SiteFooter />
  </main>;
}
