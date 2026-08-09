import { database, ensureTermsTable, getSessionUser, isSameOrigin, noStoreJson } from "@/lib/server/auth";
import { TERMS_VERSION } from "@/lib/terms";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return noStoreJson({ error: "Invalid origin." }, { status: 403 });
  try {
    const user = await getSessionUser(request);
    if (!user) return noStoreJson({ error: "Sign in before accepting the terms." }, { status: 401 });
    const payload = await request.json() as { version?: unknown };
    if (payload.version !== TERMS_VERSION) return noStoreJson({ error: "Please review the current terms." }, { status: 400 });
    const now = Math.floor(Date.now() / 1000);
    await ensureTermsTable();
    await database().prepare("INSERT INTO terms_acceptance (user_id, version, accepted_at) VALUES (?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET version = excluded.version, accepted_at = excluded.accepted_at")
      .bind(user.id, TERMS_VERSION, now).run();
    return noStoreJson({ accepted: true, version: TERMS_VERSION });
  } catch (error) {
    console.error("Terms acceptance failed", error);
    return noStoreJson({ error: "Terms could not be recorded. Please try again." }, { status: 503 });
  }
}
