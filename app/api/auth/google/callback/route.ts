import {
  appendCookies,
  clearOauthCookies,
  createSession,
  googleCredentials,
  oauthState,
  sessionCookie,
  upsertGoogleUser,
  type GoogleProfile,
} from "@/lib/server/auth";
import { TERMS_VERSION } from "@/lib/terms";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const credentials = googleCredentials();
  const stored = oauthState(request);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const failure = url.searchParams.get("error");

  if (failure || !credentials || !code || !state || !stored.state || !stored.verifier || state !== stored.state) {
    return redirectWithClearedOauth(request, `${stored.returnTo}?login=failed`);
  }

  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: credentials.clientId,
        client_secret: credentials.clientSecret,
        code,
        code_verifier: stored.verifier,
        grant_type: "authorization_code",
        redirect_uri: `${url.origin}/api/auth/google/callback`,
      }),
    });
    if (!tokenResponse.ok) throw new Error("Google token exchange failed.");
    const tokens = await tokenResponse.json() as { access_token?: string };
    if (!tokens.access_token) throw new Error("Google did not return an access token.");

    const profileResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    if (!profileResponse.ok) throw new Error("Google profile lookup failed.");
    const profile = await profileResponse.json() as GoogleProfile;
    const userId = await upsertGoogleUser(profile, stored.termsVersion === TERMS_VERSION ? TERMS_VERSION : undefined);
    const token = await createSession(userId);

    const headers = new Headers({ Location: new URL(stored.returnTo, url.origin).toString(), "Cache-Control": "no-store" });
    appendCookies(headers, [...clearOauthCookies(request), sessionCookie(request, token)]);
    return new Response(null, { status: 302, headers });
  } catch (error) {
    console.error("Google OAuth callback failed", error);
    return redirectWithClearedOauth(request, `${stored.returnTo}?login=failed`);
  }
}

function redirectWithClearedOauth(request: Request, path: string) {
  const headers = new Headers({ Location: new URL(path, request.url).toString(), "Cache-Control": "no-store" });
  appendCookies(headers, clearOauthCookies(request));
  return new Response(null, { status: 302, headers });
}
