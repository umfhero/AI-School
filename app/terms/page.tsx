import type { Metadata } from "next";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "Terms of use",
  description: "Terms for using the free AI school course.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return <main className="legal-page" id="top">
    <SiteHeader />
    <article className="legal-content">
      <p className="legal-kicker">AI SCHOOL</p>
      <h1>Terms of use</h1>
      <p className="legal-intro">AI school is a free educational project operated by Majid. By using the course or creating an account, you agree to these terms.</p>
      <p className="legal-updated">Last updated 9 August 2026</p>

      <section>
        <h2>The course</h2>
        <p>The course is for general education. It is not legal, financial, medical, security or professional advice. AI tools can make mistakes, so check important outputs before relying on them and do not use course material as the only basis for a high-stakes decision.</p>
      </section>
      <section>
        <h2>Your account</h2>
        <p>Keep your Google account secure and use AI school lawfully. Do not try to access another person’s account, interfere with the service, scrape personal account data, or use the site to harm, harass or impersonate anyone. We may suspend access that puts people or the service at risk.</p>
      </section>
      <section>
        <h2>Content and links</h2>
        <p>Course material, code and design are shared for learning and are subject to the licence or notice that accompanies them. Links to third-party tools, models and research are provided for convenience. Their products, content and privacy practices are their own responsibility.</p>
      </section>
      <section>
        <h2>Availability and liability</h2>
        <p>We aim to keep the course accurate and available, but it is provided free of charge and may change, pause or contain mistakes. To the extent permitted by law, Majid is not responsible for indirect loss arising from use of the course. Nothing in these terms excludes liability that cannot legally be excluded, including liability for fraud or for death or personal injury caused by negligence.</p>
      </section>
      <section>
        <h2>Privacy</h2>
        <p>Our <a href="/privacy">Privacy page</a> explains how account and learning-progress information is handled.</p>
      </section>
      <section>
        <h2>Changes and law</h2>
        <p>We may update these terms as the course grows. The latest version will be posted here. These terms are governed by the laws of England and Wales, except where a different mandatory law applies to you.</p>
      </section>
    </article>
    <SiteFooter />
  </main>;
}
