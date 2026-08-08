import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AuthButton from "./components/AuthButton";
import CourseProgress from "./components/CourseProgress";

export const metadata: Metadata = {
  title: "AI school | Build properly with AI",
  description:
    "A free, visual course that takes you from your first AI project to agents, skills and parallel workflows.",
};

function Brand() {
  return (
    <Link className="site-brand" href="/" aria-label="AI school home">
      <Image src="/ai-workflows-icon.png" alt="" width={34} height={34} priority />
      <b>AI school</b>
    </Link>
  );
}

/** Small hand authored pixel sprites, drawn as grids of rects on a tiny viewBox so they stay
 * crisp and blocky at any scale. Reused everywhere the same shape is needed, rather than one
 * off icons per spot. */

function PixelArrow({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`pixel-icon pixel-arrow ${className}`.trim()}
      viewBox="0 0 8 8"
      width="11"
      height="11"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      shapeRendering="crispEdges"
    >
      <rect x="4" y="1" width="1" height="1" />
      <rect x="4" y="2" width="2" height="1" />
      <rect x="0" y="3" width="7" height="1" />
      <rect x="0" y="4" width="7" height="1" />
      <rect x="4" y="5" width="2" height="1" />
      <rect x="4" y="6" width="1" height="1" />
    </svg>
  );
}

function PixelSpark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`pixel-icon pixel-spark ${className}`.trim()}
      viewBox="0 0 7 7"
      width="16"
      height="16"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      shapeRendering="crispEdges"
    >
      <rect x="3" y="0" width="1" height="2" />
      <rect x="3" y="5" width="1" height="2" />
      <rect x="0" y="3" width="2" height="1" />
      <rect x="5" y="3" width="2" height="1" />
      <rect x="2" y="2" width="3" height="3" />
    </svg>
  );
}

function PixelCheck({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`pixel-icon pixel-check ${className}`.trim()}
      viewBox="0 0 8 8"
      width="12"
      height="12"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      shapeRendering="crispEdges"
    >
      <rect x="1" y="4" width="1" height="1" />
      <rect x="2" y="5" width="1" height="1" />
      <rect x="3" y="6" width="1" height="1" />
      <rect x="4" y="5" width="1" height="1" />
      <rect x="5" y="4" width="1" height="1" />
      <rect x="6" y="3" width="1" height="1" />
      <rect x="7" y="2" width="1" height="1" />
    </svg>
  );
}

function PixelMascot({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`pixel-icon pixel-mascot ${className}`.trim()}
      viewBox="0 0 8 9"
      width="64"
      height="72"
      aria-hidden="true"
      focusable="false"
      shapeRendering="crispEdges"
    >
      <rect x="3" y="0" width="1" height="1" fill="#0b1130" />
      <rect x="3" y="1" width="1" height="1" fill="#0b1130" />
      <rect x="1" y="2" width="6" height="6" fill="#0b1130" />
      <rect x="2" y="3" width="4" height="4" fill="#6258e9" />
      <rect x="3" y="4" width="1" height="1" fill="#0b1130" />
      <rect x="5" y="4" width="1" height="1" fill="#0b1130" />
      <rect x="3" y="6" width="2" height="1" fill="#0b1130" />
      <rect x="0" y="4" width="1" height="2" fill="#0b1130" />
      <rect x="7" y="4" width="1" height="2" fill="#0b1130" />
    </svg>
  );
}

export default function Home() {
  return (
    <main className="home-page" id="top">
      <nav className="home-nav" aria-label="Main navigation">
        <Brand />
        <div className="home-nav-actions">
          <AuthButton />
          <a className="nav-cta" href="/course/basics/context-rot">
            Start learning <PixelArrow />
          </a>
        </div>
      </nav>

      <section className="home-hero">
        <div className="hero-ambient" aria-hidden="true" />
        <div className="home-hero-copy">
          <h1>
            Build serious projects with AI, <em className="properly">properly.<PixelSpark className="properly-spark" /></em>
          </h1>
          <p>
            Learn the workflow behind substantial AI work from project memory and model choice to agents,
            reusable skills and parallel execution. No technical background required.
          </p>
          <div className="hero-actions">
            <a className="button-primary" href="/course/basics/context-rot">
              Start chapter one <PixelArrow />
            </a>
          </div>
          <div className="course-facts" aria-label="Course facts">
            <span><b>1</b><small>course</small></span>
            <span><b>24</b><small>lessons</small></span>
            <span><b>£0</b><small>price</small></span>
          </div>
        </div>

        <div className="hero-showcase" aria-label="A structured AI workflow preview">
          <div className="icon-aura" aria-hidden="true"><PixelMascot /></div>
          <div className="workflow-console">
            <div className="console-top">
              <span className="console-lights" aria-hidden="true"><i /><i /><i /></span>
              <b>project / courseplatform</b>
              <small><i /> AGENT ACTIVE</small>
            </div>
            <div className="console-body">
              <div className="console-sidebar">
                <b>PROJECT</b>
                <p className="folder">⌄ courseplatform</p>
                <p className="file-active">overview.md</p>
                <p className="folder">› app</p>
                <p className="folder">› research</p>
              </div>
              <div className="console-main">
                <div className="console-heading"><span>WORKFLOW</span><small>2 of 4</small></div>
                <div className="workflow-nodes">
                  <div className="workflow-node complete"><span>01</span><b>Read context</b><small>overview.md</small><PixelCheck className="pixel-check" /></div>
                  <div className="workflow-node active"><span>02</span><b>Build one task</b><small>homepage hero</small></div>
                  <div className="workflow-node"><span>03</span><b>Verify</b><small>tests + review</small></div>
                  <div className="workflow-node"><span>04</span><b>Handover</b><small>save decisions</small></div>
                </div>
                <div className="console-status">
                  <span><i /> LIVE UPDATE</span>
                  <p>Homepage structure complete. Checking the mobile layout now.</p>
                </div>
              </div>
            </div>
          </div>
          <p className="showcase-caption"><span>01</span> You will build workflows like this, one decision at a time.</p>
        </div>
      </section>

      <CourseProgress />

      <section className="proof-section" id="proof">
        <PixelSpark className="corner-spark" />
        <div className="proof-statement">
          <div>
            <p className="section-kicker"><span /> Why I made this</p>
            <h2>I learnt the theory, then used it to get the job.</h2>
            <p>
              I wrote a first class dissertation on deterministic AI, received a university award for the work,
              and that path led to an AI role at Cloudflare. This course is the practical version of what I wish had existed when I started.
            </p>
            <p>
              Since 2023 I&rsquo;ve spent hundreds of pounds testing and running AI, building and using dozens of skills until I landed on a
              workflow that just works. I&rsquo;m sharing all of it for free and open source, and I want nothing back for it, except that
              if it helps you, you pass it on to someone else who might enjoy or learn from it too.
            </p>
          </div>
          <div className="cloudflare-mark" title="Cloudflare">
            <Image src="/cloudflare-logo.png" alt="Cloudflare" width={512} height={173} />
          </div>
        </div>
      </section>

      <section className="home-final">
        <PixelSpark className="corner-spark" />
        <div className="final-icon" aria-hidden="true"><PixelSpark /></div>
        <p>Lesson 01.1 is ready</p>
        <h2>Your AI did not get worse.<br /><em>Your chat got messy.</em></h2>
        <a className="button-primary light" href="/course/basics/context-rot">Start the free course <PixelArrow /></a>
      </section>

      <footer className="home-footer">
        <PixelSpark className="corner-spark" />
        <Brand />
        <p>Free lessons for building substantial projects with AI.</p>
        <a href="#top">Back to top ↑</a>
      </footer>
    </main>
  );
}
