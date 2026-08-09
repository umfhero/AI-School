import { env } from "cloudflare:workers";

const SESSION_COOKIE = "aw_session";
const OAUTH_STATE_COOKIE = "aw_oauth_state";
const OAUTH_VERIFIER_COOKIE = "aw_oauth_verifier";
const OAUTH_RETURN_COOKIE = "aw_oauth_return";
const SESSION_SECONDS = 60 * 60 * 24 * 30;
const OAUTH_SECONDS = 60 * 10;

type WorkerEnv = {
  DB?: D1Database;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
};

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  pictureUrl: string | null;
};

export type GoogleProfile = {
  sub: string;
  email: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
};

function workerEnv(): WorkerEnv {
  return env as unknown as WorkerEnv;
}

export function database(): D1Database {
  const db = workerEnv().DB;
  if (!db) throw new Error("The Cloudflare D1 binding `DB` is unavailable.");
  return db;
}

export function googleCredentials() {
  const { GOOGLE_CLIENT_ID: clientId, GOOGLE_CLIENT_SECRET: clientSecret } = workerEnv();
  if (!clientId || !clientSecret) return null;
  return { clientId, clientSecret };
}

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function randomToken(size = 32) {
  const bytes = new Uint8Array(size);
  crypto.getRandomValues(bytes);
  return bytesToBase64Url(bytes);
}

export async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function pkceChallenge(verifier: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  return bytesToBase64Url(new Uint8Array(digest));
}

export function readCookie(request: Request, name: string) {
  const cookies = request.headers.get("cookie") ?? "";
  for (const part of cookies.split(";")) {
    const [key, ...value] = part.trim().split("=");
    if (key === name) return decodeURIComponent(value.join("="));
  }
  return null;
}

function cookie(name: string, value: string, request: Request, maxAge?: number) {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  const lifetime = typeof maxAge === "number" ? `; Max-Age=${maxAge}` : "";
  return `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax${lifetime}${secure}`;
}

export function oauthCookies(request: Request, state: string, verifier: string, returnTo: string) {
  return [
    cookie(OAUTH_STATE_COOKIE, state, request, OAUTH_SECONDS),
    cookie(OAUTH_VERIFIER_COOKIE, verifier, request, OAUTH_SECONDS),
    cookie(OAUTH_RETURN_COOKIE, returnTo, request, OAUTH_SECONDS),
  ];
}

export function clearOauthCookies(request: Request) {
  return [OAUTH_STATE_COOKIE, OAUTH_VERIFIER_COOKIE, OAUTH_RETURN_COOKIE].map((name) => cookie(name, "", request, 0));
}

export function sessionCookie(request: Request, token: string) {
  return cookie(SESSION_COOKIE, token, request);
}

export function clearSessionCookie(request: Request) {
  return cookie(SESSION_COOKIE, "", request, 0);
}

export function oauthState(request: Request) {
  return {
    state: readCookie(request, OAUTH_STATE_COOKIE),
    verifier: readCookie(request, OAUTH_VERIFIER_COOKIE),
    returnTo: safeReturnPath(readCookie(request, OAUTH_RETURN_COOKIE)),
  };
}

export function safeReturnPath(value: string | null) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/";
}

export function appendCookies(headers: Headers, cookies: string[]) {
  for (const value of cookies) headers.append("Set-Cookie", value);
}

export function noStoreJson(body: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("Cache-Control", "no-store");
  headers.set("Content-Type", "application/json; charset=utf-8");
  return new Response(JSON.stringify(body), { ...init, headers });
}

export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return origin === new URL(request.url).origin;
}

export async function createSession(userId: string) {
  const token = randomToken();
  const id = await sha256(token);
  const now = Math.floor(Date.now() / 1000);
  await database().prepare("INSERT INTO sessions (id, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)")
    .bind(id, userId, now, now + SESSION_SECONDS).run();
  return token;
}

export async function deleteSession(request: Request) {
  const token = readCookie(request, SESSION_COOKIE);
  if (!token) return;
  await database().prepare("DELETE FROM sessions WHERE id = ?").bind(await sha256(token)).run();
}

export async function getSessionUser(request: Request): Promise<SessionUser | null> {
  const token = readCookie(request, SESSION_COOKIE);
  if (!token) return null;
  const now = Math.floor(Date.now() / 1000);
  const id = await sha256(token);
  const row = await database().prepare(
    "SELECT users.id, users.email, users.name, users.picture_url AS pictureUrl FROM sessions JOIN users ON users.id = sessions.user_id WHERE sessions.id = ? AND sessions.expires_at > ?",
  ).bind(id, now).first<SessionUser>();
  if (!row) await database().prepare("DELETE FROM sessions WHERE id = ?").bind(id).run();
  return row ?? null;
}

export async function upsertGoogleUser(profile: GoogleProfile) {
  if (!profile.sub || !profile.email || profile.email_verified === false) {
    throw new Error("Google did not return a verified email address.");
  }
  const db = database();
  const now = Math.floor(Date.now() / 1000);
  const existing = await db.prepare("SELECT id FROM users WHERE google_sub = ?").bind(profile.sub).first<{ id: string }>();
  const id = existing?.id ?? crypto.randomUUID();
  const name = profile.name?.trim() || profile.email.split("@")[0];
  await db.prepare(
    "INSERT INTO users (id, google_sub, email, name, picture_url, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT(google_sub) DO UPDATE SET email = excluded.email, name = excluded.name, picture_url = excluded.picture_url, updated_at = excluded.updated_at",
  ).bind(id, profile.sub, profile.email, name, profile.picture ?? null, now, now).run();
  return id;
}
