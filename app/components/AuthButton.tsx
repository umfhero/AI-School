"use client";

import { useEffect, useState } from "react";

type User = { name: string; email: string; pictureUrl: string | null };

export default function AuthButton({ returnTo = "/", compact = false }: { returnTo?: string; compact?: boolean }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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
    if (response.ok) setUser(null);
  }

  if (loading) return <span className={`auth-loading ${compact ? "compact" : ""}`} aria-label="Checking sign-in status" />;
  if (!user) {
    return <a className={`auth-sign-in ${compact ? "compact" : ""}`} href={`/api/auth/google/start?returnTo=${encodeURIComponent(returnTo)}`}><span aria-hidden="true">G</span> Sign in</a>;
  }

  const initial = user.name.trim().charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase();
  const avatarStyle = user.pictureUrl ? { backgroundImage: `url(${user.pictureUrl})` } : undefined;
  return <div className={`auth-user ${compact ? "compact" : ""}`} title={`${user.name} · ${user.email}`}><span className="auth-avatar" style={avatarStyle} aria-hidden="true">{user.pictureUrl ? null : initial}</span><b>{user.name}</b><button type="button" onClick={signOut}>Sign out</button></div>;
}
