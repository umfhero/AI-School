import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const body = `# AI school\n\n> A free, visual course that teaches beginners how to build reliable, substantial projects with AI.\n\nAI school is free and open source. It teaches project memory, model choice, agents, reusable skills, parallel work and verification. The course uses British English and does not assume technical experience.\n\n## Live lessons\n\n- [What is AI?](${origin}/course/basics/ai): an introduction to AI tools, project workspaces and why a useful first version still needs review.\n- [Context rot](${origin}/course/basics/context-rot): why long conversations can become less reliable and how a small external project memory helps.\n\n## Primary pages\n\n- [Course home](${origin}/): course overview and first lesson.\n- [Sitemap](${origin}/sitemap.xml): all public, indexable pages.\n- [Open-source repository](https://github.com/umfhero/AI-workflow): source code and project history.\n\n## Notes\n\n- The course is free for learners.\n- It is designed for people without a technical background.\n- More lessons are planned across six chapters.\n`;
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" } });
}
