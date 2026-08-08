import { getSessionUser, noStoreJson } from "@/lib/server/auth";

export async function GET(request: Request) {
  try {
    const user = await getSessionUser(request);
    return noStoreJson({ user });
  } catch (error) {
    console.error("Session lookup failed", error);
    return noStoreJson({ user: null }, { status: 503 });
  }
}
