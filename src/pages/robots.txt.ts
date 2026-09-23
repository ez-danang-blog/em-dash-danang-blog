import type { APIRoute } from "astro";
import { SITE } from "../config";

export const GET: APIRoute = async () => {
  const baseUrl = SITE.url.replace(/\/$/, "");

  const content = `# Robots.txt for ${SITE.title}
User-agent: *
Allow: /
Disallow: /_emdash/

# AI Crawlers & Agents
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

# Sitemap & LLM indexes
Sitemap: ${baseUrl}/sitemap.xml
`;

  return new Response(content.trim(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
};
