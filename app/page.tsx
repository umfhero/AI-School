import type { Metadata } from "next";
import Link from "next/link";
import AuthButton from "./components/AuthButton";

export const metadata: Metadata = {
  title: "AI Workflows | A free course for building properly with AI",
  description: "A free, visual course that takes you from your first AI project to agents, skills and parallel workflows.",
};

const chapters = [
  {
    number: "01",
    title: "The basics",
    summary: "Stop treating a chat as the whole project, and give your work a structure that survives between sessions.",
    lessons: ["Context rot", "Your project brain", "Files and handovers", "A clean first workflow"],
    tone: "acid",
    href: "/course/basics/context-rot",
  },
  {
    number: "02",
    title: "Pick the right model",
    summary: "Choose between GPT, Claude and Gemini based on the job, then test that choice with your own work.",
    lessons: ["What models actually change", "Speed, cost and reasoning", "Context windows", "A simple model test"],
    tone: "blue",
  },
  {
    number: "03",
    title: "Build with an agent",
    summary: "Turn an idea into a clear brief, let an agent work through it, and stay in control of the result.",
    lessons: ["Write the task brief", "Let the agent inspect", "Make the change", "Review what happened"],
    tone: "orange",
  },
  {
    number: "04",
    title: "Skills and repeatable work",
    summary: "Package good instructions once, so the same quality of work can be repeated without rebuilding the process.",
    lessons: ["What a skill is", "Write your first skill", "Use templates well", "Improve it from results"],
    tone: "violet",
  },
  {
    number: "05",
    title: "Fleets and parallel work",
    summary: "Split a larger project into independent jobs, give each agent a clear boundary, and bring the work back together.",
    lessons: ["When parallel work helps", "Divide the jobs", "Write clean handovers", "Merge without chaos"],
    tone: "pink",
  },
  {
    number: "06",
    title: "Ship it properly",
    summary: "Check the work, keep a record of the decisions, and move a substantial AI-built project into the real world.",
    lessons: ["Verification", "Source control", "Deployment", "Maintaining the system"],
    tone: "mint",
  },
];

function Brand() {
  return <Link className="site-brand" href="/" aria-label="AI Workflows home"><span aria-hidden="true">AW</span><b>AI Workflows</b></Link>;
}

export default function Home() {
  return (
    <main className="home-page">
      <nav className="home-nav" aria-label="Main navigation">
        <Brand />
        <div className="home-nav-links"><a href="#proof">Why me</a><a href="#course">Course map</a></div>
        <div className="home-nav-actions"><AuthButton /><a className="nav-cta" href="/course/basics/context-rot">Start learning <span aria-hidden="true">↗</span></a></div>
      </nav>

      <section className="home-hero">
        <div className="hero-grid-bg" aria-hidden="true" />
        <div className="home-hero-copy">
          <div className="free-pill"><span aria-hidden="true">●</span> Free from start to finish</div>
          <h1>Build serious projects with AI, <em>properly.</em></h1>
          <p>This course starts with the basics, then takes you through project memory, model choice, agents, skills and parallel work. You do not need a technical background, and you will not be left with a pile of prompts that only worked once.</p>
          <div className="hero-actions">
            <a className="button-primary" href="/course/basics/context-rot">Start chapter one <span aria-hidden="true">→</span></a>
            <a className="button-quiet" href="#course">See all chapters <span aria-hidden="true">↓</span></a>
          </div>
          <div className="course-facts" aria-label="Course facts"><span><b>6</b> chapters</span><span><b>24</b> lessons</span><span><b>£0</b> forever</span></div>
        </div>

        <div className="workflow-console" aria-label="An organised AI project moving through four stages">
          <div className="console-top"><span><i /><i /><i /></span><b>project / website-redesign</b><small>WORKING</small></div>
          <div className="console-body">
            <div className="console-sidebar"><b>PROJECT</b><p className="folder">▾ website-redesign</p><p>overview.md</p><p>brief.md</p><p className="folder">▸ app</p><p className="folder">▸ research</p></div>
            <div className="console-main">
              <p className="console-label">CURRENT WORKFLOW</p>
              <div className="workflow-nodes">
                <div className="workflow-node complete"><span>01</span><b>Read context</b><small>overview.md</small></div>
                <i aria-hidden="true" />
                <div className="workflow-node active"><span>02</span><b>Build one task</b><small>homepage hero</small></div>
                <i aria-hidden="true" />
                <div className="workflow-node"><span>03</span><b>Verify</b><small>tests + review</small></div>
                <i aria-hidden="true" />
                <div className="workflow-node"><span>04</span><b>Handover</b><small>save decisions</small></div>
              </div>
              <div className="console-status"><span>Agent update</span><p><b>✓</b> Homepage structure complete. Checking the mobile layout now.</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="proof-section" id="proof">
        <div className="proof-intro"><p className="section-kicker">Why I made this</p><h2>I learnt the theory, then used it to get the job.</h2><p>I wrote a first-class dissertation on deterministic AI, received a university award for the work, and that path led to an AI role at Cloudflare. This course is the practical version of what I wish had existed when I started.</p></div>
        <div className="proof-stats">
          <article><span>01</span><strong>First</strong><p>Dissertation grade for research into deterministic AI systems.</p></article>
          <article><span>02</span><strong>Award</strong><p>University recognition for the research and its result.</p></article>
          <article><span>03</span><strong>Cloudflare</strong><p>The work helped me turn academic research into a real AI role.</p></article>
          <article className="free-stat"><span>04</span><strong>Free</strong><p>The whole course is open, with no paid chapter waiting at the end.</p></article>
        </div>
      </section>

      <section className="course-section" id="course">
        <div className="course-heading"><div><p className="section-kicker">The full course</p><h2>From a messy first chat to a working AI system.</h2></div><p>Every chapter adds one piece to the workflow. You can see the whole route now, and chapter one is ready to start.</p></div>
        <div className="course-track" aria-hidden="true"><span className="track-fill" /><i /><i /><i /><i /><i /><i /></div>
        <div className="chapter-grid">
          {chapters.map((chapter, chapterIndex) => {
            const content = <>
              <div className="chapter-top"><span className="chapter-number">CHAPTER {chapter.number}</span><span className="chapter-state">{chapterIndex === 0 ? "READY" : "PLANNED"}</span></div>
              <h3>{chapter.title}</h3><p className="chapter-summary">{chapter.summary}</p>
              <ol>{chapter.lessons.map((lesson, index) => <li key={lesson}><span>{chapter.number}.{index + 1}</span>{lesson}{chapterIndex === 0 && index === 0 ? <b>START</b> : null}</li>)}</ol>
              <div className="chapter-foot"><span>4 lessons</span><span>{chapterIndex === 0 ? "Open chapter →" : "Course route"}</span></div>
            </>;
            return chapter.href ? <a href={chapter.href} className={`chapter-card ${chapter.tone}`} key={chapter.number}>{content}</a> : <article className={`chapter-card ${chapter.tone}`} key={chapter.number}>{content}</article>;
          })}
        </div>
      </section>

      <section className="home-final"><p>Start with the bit that makes every other AI workflow easier.</p><h2>Your AI did not get worse.<br />Your chat got messy.</h2><a className="button-primary light" href="/course/basics/context-rot">Open lesson 01.1 <span aria-hidden="true">→</span></a></section>
      <footer className="home-footer"><Brand /><p>Free lessons for building substantial projects with AI.</p><a href="#top">Back to top ↑</a></footer>
    </main>
  );
}
