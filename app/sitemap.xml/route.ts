import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const pages = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/course/intro", priority: "0.9", changefreq: "monthly" },
  { path: "/course/basics/ai", priority: "0.9", changefreq: "monthly" },
  { path: "/course/basics/context-rot", priority: "0.9", changefreq: "monthly" },
  { path: "/course/basics/project-brain", priority: "0.9", changefreq: "monthly" },
  { path: "/course/basics/files-handovers", priority: "0.9", changefreq: "monthly" },
  { path: "/course/basics/clean-workflow", priority: "0.9", changefreq: "monthly" },
  { path: "/course/models/what-changes", priority: "0.9", changefreq: "monthly" },
  { path: "/course/models/speed-cost-reasoning", priority: "0.9", changefreq: "monthly" },
  { path: "/course/models/context-windows", priority: "0.9", changefreq: "monthly" },
  { path: "/course/models/simple-model-test", priority: "0.9", changefreq: "monthly" },
  { path: "/privacy", priority: "0.3", changefreq: "yearly" },
  { path: "/terms", priority: "0.3", changefreq: "yearly" },
];

function escapeXml(value: string) {
  return value.replace(/[<>&'"]/g, (character) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", "\"": "&quot;" })[character] ?? character);
}

export function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const lastmod = "2026-08-15";
  const urls = pages.map(({ path, priority, changefreq }) => `  <url>\n    <loc>${escapeXml(`${origin}${path}`)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`).join("\n");
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  return new Response(body, { headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=3600" } });
}
