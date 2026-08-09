"use client";

import { useEffect, useState } from "react";
import TermsAgreementModal from "./TermsAgreementModal";

type User = { name: string; email: string; pictureUrl: string | null; termsAccepted: boolean };

export default function AuthButton({ returnTo = "/", compact = false, className = "", actionLabel = "Sign in" }: { returnTo?: string; compact?: boolean; className?: string; actionLabel?: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAgreement, setShowAgreement] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/auth/me", { signal: controller.signal, credentials: "same-origin" })
      .then((response) => response.json())
      .then((data: { user?: User | null }) => setUser(data.user ?? null))
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) setUser(null);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  async function signOut() {
    const response = await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" });
    if (response.ok) {
      setUser(null);
      setShowAgreement(false);
      window.dispatchEvent(new Event("auth-changed"));
    }
  }

  const classes = `${compact ? "compact" : ""} ${className}`.trim();
  if (loading) return <span className={`auth-loading ${classes}`} aria-label="Checking sign-in status" />;
  if (!user) {
    return <><button type="button" className={`auth-sign-in ${classes}`} onClick={() => setShowAgreement(true)}><span aria-hidden="true">G</span> {actionLabel}</button>{showAgreement && <TermsAgreementModal signedIn={false} returnTo={returnTo} onAccepted={() => undefined} onCancel={() => setShowAgreement(false)} />}</>;
  }

  const initial = user.name.trim().charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase();
  const avatarStyle = user.pictureUrl ? { backgroundImage: `url(${user.pictureUrl})` } : undefined;
  return <><div className={`auth-user ${classes}`} title={`${user.name} · ${user.email}`}><a className="auth-profile-link" href="/profile" aria-label="Open your profile"><span className="auth-avatar" style={avatarStyle}>{user.pictureUrl ? null : initial}</span><b>{user.name}</b></a><button type="button" onClick={signOut}>Sign out</button></div>{(!user.termsAccepted || showAgreement) && <TermsAgreementModal signedIn returnTo={returnTo} onAccepted={() => { setUser({ ...user, termsAccepted: true }); setShowAgreement(false); window.dispatchEvent(new Event("auth-changed")); }} onSignOut={signOut} />}</>;
}
