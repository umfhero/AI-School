import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const body = `# AI school

> A free, visual course that teaches beginners how to build reliable, substantial projects with AI.

AI school is free and open source. The curriculum is being rebuilt around one consistent lesson template before new chapters and lessons are added. The course uses British English and does not assume technical experience.

## Live lessons

- [Lesson one](${origin}/course/chapter-1/lesson-1): the starter lesson used to review and settle the shared layout before the new curriculum is written.

## Primary pages

- [Course home](${origin}/): course overview and first lesson.
- [Sitemap](${origin}/sitemap.xml): all public, indexable pages.
- [Open-source repository](https://github.com/umfhero/AI-workflow): source code and project history.

## Notes

- The course is free for learners.
- It is designed for people without a technical background.
- The previous curriculum is archived while the new course path is developed.
`;
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" } });
}
