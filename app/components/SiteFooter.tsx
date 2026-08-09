"use client";

/* eslint-disable @next/next/no-html-link-for-pages -- Native navigation is required by the deployed Vinext Worker router. */

import { PixelArrow, PixelSpark } from "./PixelIcons";

function privacyAddress() {
  return [117, 109, 99, 102, 97, 105, 122, 64, 103, 109, 97, 105, 108, 46, 99, 111, 109]
    .map((character) => String.fromCharCode(character))
    .join("");
}

export default function SiteFooter() {
  function contactMajid() {
    window.location.href = `mailto:${privacyAddress()}?subject=AI%20school%20privacy%20request`;
  }

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
      <button type="button" onClick={contactMajid}>Contact Majid</button>
    </nav>
    <a className="back-to-top" href="#top">Back to top <PixelArrow className="pixel-arrow-up" /></a>
  </footer>;
}
