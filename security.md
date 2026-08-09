# Security, privacy and legal release checklist

Last updated: 9 August 2026

This is the operating checklist for AI school. It does not replace legal advice, but every account, data, platform or social-feature change must be checked against it before release.

## Current service boundary

AI school is a free educational website operated by Majid in the United Kingdom. It uses Google OAuth for sign-in and Cloudflare Workers and D1 to store user accounts, hashed sessions and saved learning progress. The service does not run advertising, analytics or a public learner directory.

The public Privacy and Terms pages are part of the product. Keep them accurate whenever the data model, suppliers, cookies, retention, social features or course purpose changes.

## Data handling rules

- Keep only data required to provide the course. The current account fields are Google subject ID, verified email, display name, optional profile picture, hashed session record and learning progress.
- Do not add sensitive-category data, payment data, location history, private messages, behavioural advertising or user-generated uploads without a separate design and legal review.
- Never expose email addresses through public pages, search results, profiles, friend lists, notifications, client bundles or logs.
- Do not log OAuth codes, session tokens, Google secrets, database IDs, raw request bodies or personal data. Rotate any secret that is exposed.
- Return personal data only to the authenticated account that owns it. Use server-derived user IDs, not browser-provided IDs, for every account or progress query.
- Keep API responses containing personal data as `Cache-Control: no-store`.
- Keep a simple list of data processors, what they process, their data terms and any international-transfer safeguard. At present, this includes Cloudflare and Google.

## Account security

- Keep Google OAuth PKCE, state validation, verified-email checks, HttpOnly cookies, SameSite protection and secure cookies in production.
- Require same-origin checks for every state-changing route and check that the signed-in user owns the record being changed.
- Keep session tokens hashed in D1. Expire sessions and clear them on logout or account deletion.
- Review persistent sign-in cookies before adding any tracking. A persistent login should be limited to authentication and clearly explained to users.
- Provide a signed-in account-data export and account deletion route. Deletion must remove sessions, progress and every future child record such as friendships and notifications.
- Rate-limit sign-in, account recovery, search and social actions when those routes exist. Reject malformed input, duplicate actions and self-targeted actions.

## Website and deployment security

- Keep dependencies updated and run the build, tests and lint before publishing. Treat high-severity dependency advisories as release blockers unless a documented mitigation exists.
- Preserve the response headers that prevent MIME sniffing, framing, overly broad referrer sharing and unnecessary camera, microphone and location access.
- Do not add a permissive Content Security Policy without testing Google profile images and OAuth. Add a restrictive policy only after its allowed sources are understood.
- Keep Cloudflare account access personal, use least privilege and never deploy through the Hero Enterprise account described in `overview.md`.
- Store OAuth secrets only in Cloudflare secret settings. Do not commit them, paste them into issues or reuse them across projects.
- Keep database migrations reviewed, reversible where practical and tested against a copy of non-production data.
- Maintain a recovery plan: source in GitHub, migration history, a documented owner account, and a way to revoke OAuth credentials and sign out active sessions after an incident.

## Privacy and legal operations

- Complete the ICO data-protection-fee self-assessment and pay the fee if required. Recheck when the project’s status or processing changes.
- Keep a short record of processing: data categories, purpose, lawful basis, suppliers, retention and who can access it.
- Handle access, correction, deletion, portability, restriction and objection requests through the account controls or the privacy contact. Record receipt and respond within the applicable deadline.
- Review new cookies, analytics, social widgets or tracking pixels before adding them. Non-essential storage or access technologies need a compliant consent path before they run.
- If a personal-data breach is suspected, contain access, preserve evidence, assess who is affected and obtain legal advice promptly. A reportable UK GDPR breach may need ICO notification within 72 hours.
- Keep the course clearly educational. Do not promise outcomes, present AI output as professional advice, or make claims about third-party products that cannot be supported.
- Review copyright and licence terms for every imported figure, image, code sample, logo or quotation. Keep source links and permission notes with the material.

## Children and social features

- Assume the course may be accessed by under-18s unless there is a reliable and proportionate age approach. Use high-privacy settings by default and review the ICO Children’s Code before social features launch.
- Follow every privacy and safety requirement in `friends.md` before adding friend search, requests, profiles, notifications or comparison graphs.
- Do not reveal a learner’s email after friendship. Prefer invite codes or direct invitation links to an open name directory.
- Make profiles undiscoverable by default. Limit accepted-friend data to a chosen display name, chosen avatar, level and broad progress totals unless the learner makes a separate choice.
- Provide decline, cancel, remove and block controls, and make a block prevent future requests.
- Complete a short DPIA or privacy risk assessment before launch if a feature creates a meaningful new risk, especially social discovery, child access, profiling or new large-scale data collection.

## Release check

Before each release, answer these questions in the pull request or handover:

1. What personal data, cookies or third parties changed?
2. Is each data use necessary, documented and reflected in the Privacy page?
3. Can an unauthenticated user or another account access the data?
4. Are secrets, logs, error messages and analytics free of personal data?
5. Does account deletion remove the new records?
6. Have tests covered the access-control boundary and unhappy paths?
7. Does this change affect children, public discoverability or contact between users?
