import type { Metadata } from "next";
import { headers } from "next/headers";
import Image from "next/image";
import CourseProgress from "./components/CourseProgress";
import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";
import SignupCount from "./components/SignupCount";
import { PixelArrow, PixelSpark, PixelCheck, PixelMascot, PixelWord } from "./components/PixelIcons";

export const metadata: Metadata = {
  title: "Free course for building projects with AI",
  description:
    "Learn how to build reliable AI projects with project memory, model choice, agents, reusable skills and parallel workflows. Free, visual and made for beginners.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "AI school | Free course for building projects with AI",
    description: "Learn practical AI workflows, from project memory and model choice to agents, skills and parallel work.",
    url: "/",
  },
};

export default async function Home() {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "ai-workflow.umfhero-961.workers.dev";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";
  const siteUrl = `${protocol}://${host}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organisation`,
        name: "AI school",
        url: siteUrl,
        logo: `${siteUrl}/icon-512.png`,
        sameAs: ["https://github.com/umfhero/AI-workflow"],
      },
      {
        "@type": "Course",
        "@id": `${siteUrl}/#course`,
        name: "AI workflow course",
        description: "A free visual course for beginners who want to build reliable, substantial projects with AI.",
        url: siteUrl,
        isAccessibleForFree: true,
        inLanguage: "en-GB",
        educationalLevel: "Beginner",
        provider: { "@id": `${siteUrl}/#organisation` },
        hasCourseInstance: {
          "@type": "CourseInstance",
          courseMode: "online",
          isAccessibleForFree: true,
        },
        hasPart: [
          { "@type": "Course", name: "Course introduction", url: `${siteUrl}/course/intro` },
          { "@type": "Course", name: "AI?", url: `${siteUrl}/course/basics/ai` },
          { "@type": "Course", name: "Context rot", url: `${siteUrl}/course/basics/context-rot` },
        ],
      },
    ],
  };

  return (
    <main className="home-page" id="top">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <SiteHeader />

      <section className="home-hero">
        <div className="hero-ambient" aria-hidden="true" />
        <div className="home-hero-copy">
          <h1>
            Build serious projects with AI, <em className="properly" aria-label="properly."><PixelWord text="properly." className="properly-pixel" /><PixelSpark className="properly-spark" /></em>
          </h1>
          <p>
            Learn the workflow behind substantial AI work from project memory and model choice to agents,
            reusable skills and parallel execution. No technical background required.
          </p>
          <div className="hero-actions">
            <a className="button-primary" href="/course">
              Start course <PixelArrow />
            </a>
          </div>
          <div className="course-facts" aria-label="Course facts">
            <span><b>1</b><small>course</small></span>
            <span><b>26</b><small>lessons</small></span>
            <span><b>£0</b><small>price</small></span>
            <span><SignupCount /><small>signed up</small></span>
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
        <p>The course introduction is ready</p>
        <h2>Start with the workflow.<br /><em>Then learn how to use AI properly.</em></h2>
        <a className="button-primary light" href="/course">Start the free course <PixelArrow /></a>
      </section>

      <SiteFooter />
    </main>
  );
}
