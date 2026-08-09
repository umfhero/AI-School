export const TERMS_VERSION = "2026-08-09";

export function hasAcceptedCurrentTerms(termsVersion: string | null | undefined) {
  return termsVersion === TERMS_VERSION;
}
