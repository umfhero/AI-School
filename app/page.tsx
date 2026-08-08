import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AuthButton from "./components/AuthButton";

export const metadata: Metadata = {
  title: "AI Free Course | Build properly with AI",
  description:
    "A free, visual course that takes you from your first AI project to agents, skills and parallel workflows.",
};

function Brand() {
  return (
    <Link className="site-brand" href="/" aria-label="AI Free Course home">
      <Image src="/ai-workflows-icon.png" alt="" width={34} height={34} priority />
      <b>AI Free Course</b>
    </Link>
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
            Start learning <span aria-hidden="true">↗</span>
          </a>
        </div>
      </nav>

      <section className="home-hero">
        <div className="hero-ambient" aria-hidden="true" />
        <div className="home-hero-copy">
          <h1>Build serious projects with AI, <em>properly.</em></h1>
          <p>
            Learn the workflow behind substantial AI work—from project memory and model choice to agents,
            reusable skills and parallel execution. No technical background required.
          </p>
          <div className="hero-actions">
            <a className="button-primary" href="/course/basics/context-rot">
              Start chapter one <span aria-hidden="true">→</span>
            </a>
          </div>
          <div className="course-facts" aria-label="Course facts">
            <span><b>6</b><small>chapters</small></span>
            <span><b>24</b><small>lessons</small></span>
            <span><b>£0</b><small>to complete</small></span>
          </div>
        </div>

        <div className="hero-showcase" aria-label="A structured AI workflow preview">
          <div className="icon-aura" aria-hidden="true">
            <Image src="/ai-workflows-icon.png" alt="" width={172} height={172} priority />
          </div>
          <div className="workflow-console">
            <div className="console-top">
              <span className="console-lights" aria-hidden="true"><i /><i /><i /></span>
              <b>project / course-platform</b>
              <small><i /> AGENT ACTIVE</small>
            </div>
            <div className="console-body">
              <div className="console-sidebar">
                <b>PROJECT</b>
                <p className="folder">⌄ course-platform</p>
                <p className="file-active">overview.md</p>
                <p>brief.md</p>
                <p className="folder">› app</p>
                <p className="folder">› research</p>
              </div>
              <div className="console-main">
                <div className="console-heading"><span>WORKFLOW</span><small>2 of 4</small></div>
                <div className="workflow-nodes">
                  <div className="workflow-node complete"><span>01</span><b>Read context</b><small>overview.md</small></div>
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

      <section className="proof-section" id="proof">
        <div className="proof-intro">
          <p className="section-kicker"><span /> Why learn from me</p>
          <h2>Theory that became<br /><em>real-world work.</em></h2>
          <p>
            I wrote a first-class dissertation on deterministic AI, received a university award for the work,
            and that path led to an AI role at Cloudflare. This is the practical course I wish had existed when I started.
          </p>
        </div>
        <div className="proof-stats">
          <article><span>01 / RESEARCH</span><strong>First</strong><p>Dissertation grade for research into deterministic AI systems.</p></article>
          <article><span>02 / RECOGNITION</span><strong>Award</strong><p>University recognition for the research and its result.</p></article>
          <article><span>03 / OUTCOME</span><strong>Cloudflare</strong><p>The work helped turn academic research into a real AI role.</p></article>
          <article className="free-stat"><span>04 / PROMISE</span><strong>Free</strong><p>No paid chapter waiting at the end. Learn the entire workflow.</p></article>
        </div>
      </section>

      <section className="home-final">
        <p>Lesson 01.1 is ready</p>
        <h2>Your AI did not get worse.<br /><em>Your chat got messy.</em></h2>
        <a className="button-primary light" href="/course/basics/context-rot">Start the free course <span aria-hidden="true">→</span></a>
      </section>

      <footer className="home-footer">
        <Brand />
        <p>Free lessons for building substantial projects with AI.</p>
        <a href="#top">Back to top ↑</a>
      </footer>
    </main>
  );
}
