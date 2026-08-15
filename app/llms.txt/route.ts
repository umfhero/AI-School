import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const body = `# AI school

> A free, visual course that teaches beginners how to build reliable, substantial projects with AI.

AI school is free and open source. Its pathway moves from web AI to deterministic control, repeatable projects, measured model choice, safe agent work and maintained systems. The course uses British English and does not assume technical experience.

## Live lessons

- [Your AI course pathway](${origin}/course/chapter-1/lesson-1): an animated overview of all eight chapters and the control loop used throughout the course.

## Primary pages

- [Course home](${origin}/): course overview and first lesson.
- [Sitemap](${origin}/sitemap.xml): all public, indexable pages.
- [Open-source repository](https://github.com/umfhero/AI-workflow): source code and project history.

## Notes

- The course is free for learners.
- It is designed for people without a technical background.
- Lesson 1.1 is an orientation with no learner task.
`;
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" } });
}
