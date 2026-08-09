"use client";

import { useCallback, useEffect, useState } from "react";
import { PixelBell } from "./PixelIcons";

type NotificationSummary = { authenticated: boolean; unreadCount: number };

export default function NotificationButton() {
  const [summary, setSummary] = useState<NotificationSummary | null>(null);

  const loadSummary = useCallback(async () => {
    try {
      const response = await fetch("/api/notifications", { credentials: "same-origin" });
      if (!response.ok) return setSummary({ authenticated: false, unreadCount: 0 });
      const data = await response.json() as NotificationSummary;
      setSummary({ authenticated: data.authenticated === true, unreadCount: Math.max(0, Number(data.unreadCount) || 0) });
    } catch {
      setSummary({ authenticated: false, unreadCount: 0 });
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadSummary(), 0);
    window.addEventListener("auth-changed", loadSummary);
    window.addEventListener("notifications-changed", loadSummary);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("auth-changed", loadSummary);
      window.removeEventListener("notifications-changed", loadSummary);
    };
  }, [loadSummary]);

  if (!summary?.authenticated) return null;
  const label = summary.unreadCount ? `Notifications, ${summary.unreadCount} unread` : "Notifications";
  return <a className="notification-button" href="/notifications" aria-label={label} title={label}>
    <PixelBell />
    <span className="notification-button-label">Notifications</span>
    {summary.unreadCount ? <i aria-hidden="true">{summary.unreadCount > 9 ? "9+" : summary.unreadCount}</i> : null}
  </a>;
}
