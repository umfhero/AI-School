import { database, noStoreJson } from "@/lib/server/auth";

const SIGNUP_COUNT_CACHE_SECONDS = 60 * 60;

function signupCountResponse(count: number) {
  return new Response(JSON.stringify({ count }), {
    headers: {
      "Cache-Control": `public, max-age=0, s-maxage=${SIGNUP_COUNT_CACHE_SECONDS}`,
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

export async function GET(request: Request) {
  const cache = caches.default;
  const cacheKey = new Request(new URL("/api/community", request.url).toString());

  try {
    const cached = await cache.match(cacheKey);
    if (cached) return cached;

    const result = await database()
      .prepare("SELECT COUNT(*) AS count FROM users")
      .first<{ count: number | string }>();
    const count = Math.max(0, Math.floor(Number(result?.count ?? 0)));

    const response = signupCountResponse(count);
    await cache.put(cacheKey, response.clone());
    return response;
  } catch (error) {
    console.error("Signup count lookup failed", error);
    return noStoreJson({ error: "Signup count is temporarily unavailable." }, { status: 503 });
  }
}
