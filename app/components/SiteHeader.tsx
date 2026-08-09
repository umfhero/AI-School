/* eslint-disable @next/next/no-html-link-for-pages -- Native navigation is required by the deployed Vinext Worker router. */

import AuthButton from "./AuthButton";
import ExperienceBadge from "./ExperienceBadge";
import NotificationButton from "./NotificationButton";
import { PixelSpark } from "./PixelIcons";

export default function SiteHeader() {
  return (
    <nav className="home-nav" aria-label="Main navigation">
      <a className="site-brand" href="/" aria-label="AI school home">
        <PixelSpark className="brand-star" />
        <b>AI school</b>
      </a>
      <div className="home-nav-actions">
        <NotificationButton />
        <ExperienceBadge />
        <AuthButton />
      </div>
    </nav>
  );
}
