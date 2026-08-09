"use client";

import { useEffect, useRef, useState } from "react";
import { TERMS_VERSION } from "@/lib/terms";

type Props = {
  signedIn: boolean;
  returnTo: string;
  onAccepted: () => void;
  onCancel?: () => void;
  onSignOut?: () => void;
};

export default function TermsAgreementModal({ signedIn, returnTo, onAccepted, onCancel, onSignOut }: Props) {
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const checkboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    checkboxRef.current?.focus();
  }, []);

  async function continueWithAgreement() {
    if (!confirmed || submitting) return;
    setSubmitting(true);
    setError("");
    if (!signedIn) {
      window.location.assign(`/api/auth/google/start?returnTo=${encodeURIComponent(returnTo)}&terms=${encodeURIComponent(TERMS_VERSION)}`);
      return;
    }
    try {
      const response = await fetch("/api/terms", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ version: TERMS_VERSION }),
      });
      if (!response.ok) throw new Error("Agreement was not recorded.");
      onAccepted();
    } catch {
      setError("We could not record your agreement. Please try again.");
      setSubmitting(false);
    }
  }

  return <div className="terms-modal-backdrop" role="presentation">
    <section className="terms-modal" role="dialog" aria-modal="true" aria-labelledby="terms-modal-title" aria-describedby="terms-modal-description">
      <p className="terms-modal-kicker">ACCOUNT CHECK</p>
      <h2 id="terms-modal-title">Before you continue</h2>
      <p id="terms-modal-description">Please read and agree to the current terms before using an AI school account.</p>
      <label className="terms-modal-check">
        <input ref={checkboxRef} type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} />
        <span>I have read and agree to the <a href="/terms" target="_blank" rel="noreferrer">Terms of use</a> and <a href="/privacy" target="_blank" rel="noreferrer">Privacy notice</a>.</span>
      </label>
      {error && <p className="terms-modal-error" role="alert">{error}</p>}
      <div className="terms-modal-actions">
        <button type="button" className="terms-modal-continue" onClick={continueWithAgreement} disabled={!confirmed || submitting}>{submitting ? "Saving agreement…" : signedIn ? "Agree and continue" : "Agree and sign in"}</button>
        {signedIn ? <button type="button" className="terms-modal-secondary" onClick={onSignOut}>Sign out instead</button> : <button type="button" className="terms-modal-secondary" onClick={onCancel}>Not now</button>}
      </div>
    </section>
  </div>;
}
