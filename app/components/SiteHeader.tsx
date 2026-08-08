import Image from "next/image";
import Link from "next/link";
import AuthButton from "./AuthButton";
import { PixelArrow } from "./PixelIcons";

export default function SiteHeader() {
  return (
    <nav className="home-nav" aria-label="Main navigation">
      <Link className="site-brand" href="/" aria-label="AI school home">
        <Image src="/ai-workflows-icon.png" alt="" width={34} height={34} priority />
        <b>AI school</b>
      </Link>
      <div className="home-nav-actions">
        <AuthButton />
        <a className="nav-cta" href="/course/basics/context-rot">
          Start learning <PixelArrow />
        </a>
      </div>
    </nav>
  );
}
