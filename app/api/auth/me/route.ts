import { getSessionUser, noStoreJson } from "@/lib/server/auth";
import { hasAcceptedCurrentTerms } from "@/lib/terms";

export async function GET(request: Request) {
  try {
    const user = await getSessionUser(request);
    return noStoreJson({ user: user && { name: user.name, email: user.email, pictureUrl: user.pictureUrl, termsAccepted: hasAcceptedCurrentTerms(user.termsVersion) } });
  } catch (error) {
    console.error("Session lookup failed", error);
    return noStoreJson({ user: null }, { status: 503 });
  }
}
