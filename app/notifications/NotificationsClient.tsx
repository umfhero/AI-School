"use client";

import { useCallback, useEffect, useState } from "react";
import AuthButton from "../components/AuthButton";
import { PixelBell } from "../components/PixelIcons";

type Notification = { id: string; kind: string; title: string; body: string; href: string | null; createdAt: number; readAt: number | null };
type NotificationResponse = { authenticated: boolean; notifications: Notification[]; unreadCount: number };

function dateLabel(timestamp: number) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(timestamp * 1000));
}

export default function NotificationsClient() {
  const [data, setData] = useState<NotificationResponse | null>(null);
  const [failed, setFailed] = useState(false);

  const loadNotifications = useCallback(async () => {
    try {
      const response = await fetch("/api/notifications", { credentials: "same-origin" });
      if (!response.ok) throw new Error("Unavailable");
      setData(await response.json() as NotificationResponse);
      setFailed(false);
    } catch {
      setFailed(true);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadNotifications(), 0);
    return () => window.clearTimeout(timer);
  }, [loadNotifications]);

  async function markRead(notificationId: string) {
    setData((current) => current ? {
      ...current,
      unreadCount: Math.max(0, current.unreadCount - (current.notifications.find((notification) => notification.id === notificationId)?.readAt === null ? 1 : 0)),
      notifications: current.notifications.map((notification) => notification.id === notificationId ? { ...notification, readAt: notification.readAt ?? Math.floor(Date.now() / 1000) } : notification),
    } : current);
    window.dispatchEvent(new Event("notifications-changed"));
    try {
      const response = await fetch("/api/notifications", { method: "PATCH", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ notificationId }) });
      if (!response.ok) throw new Error("Could not save notification state");
    } catch {
      void loadNotifications();
    }
  }

  if (failed) return <section className="notifications-shell"><p className="notifications-kicker">YOUR INBOX</p><h1>Notifications are unavailable right now.</h1><p className="notifications-copy">Please try again in a moment.</p><button type="button" className="notifications-retry" onClick={() => void loadNotifications()}>Try again</button></section>;
  if (!data) return <section className="notifications-shell" aria-live="polite"><p className="notifications-kicker">YOUR INBOX</p><h1>Loading notifications…</h1></section>;
  if (!data.authenticated) return <section className="notifications-shell notifications-signed-out"><p className="notifications-kicker">YOUR INBOX</p><h1>Keep up with AI school.</h1><p className="notifications-copy">Sign in to see course updates and future friend requests.</p><AuthButton returnTo="/notifications" actionLabel="Sign in with Google" /></section>;

  return <section className="notifications-shell">
    <div className="notifications-heading"><div><p className="notifications-kicker">YOUR INBOX</p><h1>Notifications</h1><p className="notifications-copy">Course releases, important changes and future friend requests will appear here.</p></div><div className="notifications-count"><PixelBell /><b>{data.unreadCount}</b><span>{data.unreadCount === 1 ? "unread" : "unread"}</span></div></div>
    {data.notifications.length ? <ol className="notification-list">{data.notifications.map((notification) => {
      const content = <><div className="notification-marker"><PixelBell /></div><div className="notification-content"><div><p>{notification.kind.replaceAll("_", " ")}</p><time dateTime={new Date(notification.createdAt * 1000).toISOString()}>{dateLabel(notification.createdAt)}</time></div><h2>{notification.title}</h2><p>{notification.body}</p>{notification.href ? <span className="notification-link">Open update →</span> : null}</div>{notification.readAt === null ? <i className="notification-unread" aria-label="Unread" /> : null}</>;
      return <li className={notification.readAt === null ? "unread" : ""} key={notification.id}>{notification.href ? <a href={notification.href} onClick={(event) => { event.preventDefault(); void markRead(notification.id).finally(() => window.location.assign(notification.href!)); }}>{content}</a> : <button type="button" onClick={() => void markRead(notification.id)}>{content}</button>}</li>;
    })}</ol> : <div className="notifications-empty"><PixelBell /><h2>You are all caught up.</h2><p>When there is a new course, an important change or a request from a future friend feature, you will find it here.</p></div>}
  </section>;
}
