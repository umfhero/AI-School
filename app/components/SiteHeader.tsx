/* eslint-disable @next/next/no-html-link-for-pages -- Native navigation is required by the deployed Vinext Worker router. */

import Image from "next/image";
import AuthButton from "./AuthButton";
import ExperienceBadge from "./ExperienceBadge";
import { PixelArrow } from "./PixelIcons";

export default function SiteHeader() {
  return (
    <nav className="home-nav" aria-label="Main navigation">
      <a className="site-brand" href="/" aria-label="AI school home">
        <Image src="/ai-workflows-icon.png" alt="" width={34} height={34} priority />
        <b>AI school</b>
      </a>
      <div className="home-nav-actions">
        <AuthButton />
        <ExperienceBadge />
        <a className="nav-cta" href="/course/basics/ai">
          Start learning <PixelArrow />
        </a>
      </div>
    </nav>
  );
}
