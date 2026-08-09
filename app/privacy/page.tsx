import type { Metadata } from "next";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How AI school handles account, learning-progress and sign-in information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return <main className="legal-page" id="top">
    <SiteHeader />
    <article className="legal-content">
      <p className="legal-kicker">AI SCHOOL</p>
      <h1>Privacy</h1>
      <p className="legal-intro">AI school is a free course operated by Majid in the United Kingdom. This page explains the small amount of information needed to provide accounts and saved learning progress.</p>
      <p className="legal-updated">Last updated 9 August 2026</p>

      <section>
        <h2>What we collect</h2>
        <p>When you choose to sign in with Google, we receive your Google account ID, verified email address, display name and, if Google provides one, profile picture. We also store your course progress and an account session record. The browser keeps a sign-in token, while the database stores only a hashed version of that token.</p>
      </section>
      <section>
        <h2>Why we use it</h2>
        <p>We use this information to create your account, keep you signed in, save your learning progress, show your profile and protect the service. The legal basis is providing the account and course features you request, alongside legitimate interests in keeping the service secure and preventing misuse.</p>
      </section>
      <section>
        <h2>Who receives it</h2>
        <p>Cloudflare provides the hosting and database infrastructure. Google provides the sign-in service. We do not sell personal information, run advertising, or use personal information to train AI models. These providers may process information outside the United Kingdom, and we use them only where a lawful transfer mechanism is available.</p>
      </section>
      <section>
        <h2>How long we keep it</h2>
        <p>We keep account and progress information while your account remains open. The browser sign-in cookie ends when you close the browser, and its matching server session expires after 30 days. You can download or delete your account from your signed-in profile. Deleting an account removes its account record, saved progress and active sessions. We may keep the minimum information needed to deal with a legal obligation, security incident or dispute.</p>
      </section>
      <section>
        <h2>Your choices and rights</h2>
        <p>You can ask for access, correction, deletion, restriction, portability or an explanation of how your information is used. Your signed-in profile includes self-service download and deletion controls. For another request, use the Contact team link in the footer. We may need to confirm that a request is yours before acting on it.</p>
      </section>
      <section>
        <h2>Cookies</h2>
        <p>AI school uses essential cookies for Google sign-in, account security and keeping a signed-in session. We do not currently use analytics, advertising or social-media tracking cookies. If that changes, we will explain the new cookies and ask for consent where the law requires it.</p>
      </section>
      <section>
        <h2>Children and future social features</h2>
        <p>The current course has no public learner directory or messaging. If AI school introduces friend connections, profiles will be private by default and email addresses will never be shared between learners. We will update this notice before that feature is available.</p>
      </section>
      <section>
        <h2>Changes and complaints</h2>
        <p>We will date any material change to this page. If you are unhappy with how we handle your information, contact Majid first. You can also raise a concern with the Information Commissioner’s Office in the United Kingdom.</p>
      </section>
    </article>
    <SiteFooter />
  </main>;
}
