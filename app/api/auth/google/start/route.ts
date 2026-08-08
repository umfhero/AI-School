import { appendCookies, googleCredentials, oauthCookies, pkceChallenge, randomToken, safeReturnPath } from "@/lib/server/auth";

export async function GET(request: Request) {
  const credentials = googleCredentials();
  if (!credentials) {
    return Response.json({ error: "Google sign-in is being configured. Please try again shortly." }, { status: 503 });
  }

  const requestUrl = new URL(request.url);
  const state = randomToken();
  const verifier = randomToken(48);
  const redirectUri = `${requestUrl.origin}/api/auth/google/callback`;
  const authorizationUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authorizationUrl.searchParams.set("client_id", credentials.clientId);
  authorizationUrl.searchParams.set("redirect_uri", redirectUri);
  authorizationUrl.searchParams.set("response_type", "code");
  authorizationUrl.searchParams.set("scope", "openid email profile");
  authorizationUrl.searchParams.set("state", state);
  authorizationUrl.searchParams.set("code_challenge", await pkceChallenge(verifier));
  authorizationUrl.searchParams.set("code_challenge_method", "S256");
  authorizationUrl.searchParams.set("prompt", "select_account");

  const headers = new Headers({ Location: authorizationUrl.toString(), "Cache-Control": "no-store" });
  appendCookies(headers, oauthCookies(request, state, verifier, safeReturnPath(requestUrl.searchParams.get("returnTo"))));
  return new Response(null, { status: 302, headers });
}
