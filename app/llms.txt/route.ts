import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const body = `# AI school

> A free, visual course that teaches beginners how to build reliable, substantial projects with AI.

AI school is free and open source. It teaches project memory, model choice, agents, reusable skills, parallel work and verification. The course uses British English and does not assume technical experience.

## Live lessons

- [Course introduction](${origin}/course/intro): who the course is for, what it teaches and the AI workflow habits that connect its chapters.
- [What is AI?](${origin}/course/basics/ai): an introduction to AI tools, project workspaces and why a useful first version still needs review.
- [Context rot](${origin}/course/basics/context-rot): why long conversations can become less reliable and how a small external project memory helps.
- [What models change](${origin}/course/models/what-changes): how model capabilities, benchmarks, cost and deployment choices affect the right tool for a task.

## Primary pages

- [Course home](${origin}/): course overview and first lesson.
- [Sitemap](${origin}/sitemap.xml): all public, indexable pages.
- [Open-source repository](https://github.com/umfhero/AI-workflow): source code and project history.

## Notes

- The course is free for learners.
- It is designed for people without a technical background.
- More lessons are planned across six chapters.
`;
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" } });
}
