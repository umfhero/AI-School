/* eslint-disable @next/next/no-html-link-for-pages -- Native navigation is required by the deployed Vinext Worker router. */

import { PixelArrow, PixelSpark } from "./PixelIcons";

export default function SiteFooter() {
  return <footer className="site-footer">
    <PixelSpark className="corner-spark" />
    <a className="site-brand" href="/" aria-label="AI school home">
      <PixelSpark className="brand-star" />
      <b>AI school</b>
    </a>
    <p>Free lessons for building substantial projects with AI.</p>
    <nav className="site-footer-links" aria-label="Site information">
      <a href="/privacy">Privacy</a>
      <a href="/terms">Terms</a>
      <a href="/contact" target="_blank" rel="noreferrer">Contact team</a>
    </nav>
    <a className="back-to-top" href="#top">Back to top <PixelArrow className="pixel-arrow-up" /></a>
  </footer>;
}
