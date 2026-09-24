import type { APIRoute } from "astro";
import { getEmDashCollection, getTaxonomyTerms } from "emdash";
import { SITE } from "../config";

export const GET: APIRoute = async () => {
  const baseUrl = SITE.url.replace(/\/$/, "");

  let posts: any[] = [];
  try {
    const result = await getEmDashCollection("posts", {
      limit: 1000,
      orderBy: { published_at: "desc" },
    });
    posts = (result.entries || []).filter((p: any) => p.data?.status !== "draft");
  } catch (e) {
    console.error("Error loading posts for sitemap:", e);
  }

  let tags: any[] = [];
  try {
    tags = await getTaxonomyTerms("tag");
  } catch {
    // tags empty or not initialized
  }

  const staticUrls = [
    { loc: `${baseUrl}/`, changefreq: "daily", priority: "1.0" },
    { loc: `${baseUrl}/articles/`, changefreq: "daily", priority: "0.9" },
  ];

  const postUrls = posts.map((post) => {
    const lastmod = post.data?.updated_at || post.data?.published_at;
    const dateStr = lastmod ? new Date(lastmod).toISOString() : new Date().toISOString();
    return {
      loc: `${baseUrl}/articles/${post.id || post.slug}/`,
      lastmod: dateStr,
      changefreq: "weekly",
      priority: "0.8",
    };
  });

  const tagUrls = tags.map((t) => ({
    loc: `${baseUrl}/tags/${t.slug}/`,
    changefreq: "weekly",
    priority: "0.6",
  }));

  const allUrls = [...staticUrls, ...postUrls, ...tagUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(xml.trim(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
};
