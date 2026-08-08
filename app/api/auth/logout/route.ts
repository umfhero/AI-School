import { clearSessionCookie, deleteSession, isSameOrigin, noStoreJson } from "@/lib/server/auth";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return noStoreJson({ error: "Invalid origin." }, { status: 403 });
  try {
    await deleteSession(request);
  } catch (error) {
    console.error("Session deletion failed", error);
  }
  const headers = new Headers({ "Set-Cookie": clearSessionCookie(request) });
  return noStoreJson({ ok: true }, { headers });
}
