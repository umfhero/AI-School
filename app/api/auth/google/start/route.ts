import { appendCookies, googleCredentials, oauthCookies, pkceChallenge, randomToken, safeReturnPath } from "@/lib/server/auth";
import { TERMS_VERSION } from "@/lib/terms";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const returnTo = safeReturnPath(requestUrl.searchParams.get("returnTo"));
  if (requestUrl.searchParams.get("terms") !== TERMS_VERSION) {
    return Response.redirect(new URL(`${returnTo}${returnTo.includes("?") ? "&" : "?"}terms=required`, requestUrl.origin), 302);
  }
  const credentials = googleCredentials();
  if (!credentials) {
    return Response.json({ error: "Google sign-in is being configured. Please try again shortly." }, { status: 503 });
  }
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
  appendCookies(headers, oauthCookies(request, state, verifier, returnTo, TERMS_VERSION));
  return new Response(null, { status: 302, headers });
}
