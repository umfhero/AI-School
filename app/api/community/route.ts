import { database, noStoreJson } from "@/lib/server/auth";

export async function GET() {
  try {
    const result = await database()
      .prepare("SELECT COUNT(*) AS count FROM users")
      .first<{ count: number | string }>();
    const count = Math.max(0, Math.floor(Number(result?.count ?? 0)));

    return noStoreJson({ count });
  } catch (error) {
    console.error("Signup count lookup failed", error);
    return noStoreJson({ error: "Signup count is temporarily unavailable." }, { status: 503 });
  }
}
