import type { APIRoute } from "astro";
import { getEmDashCollection } from "emdash";
import { AUTHOR, SITE } from "../config";

export const GET: APIRoute = async () => {
  const baseUrl = SITE.url.replace(/\/$/, "");

  let posts: any[] = [];
  try {
    const result = await getEmDashCollection("posts", {
      limit: 100,
      orderBy: { published_at: "desc" },
    });
    posts = (result.entries || []).filter((p: any) => p.data?.status !== "draft");
  } catch (e) {
    console.error("Error loading posts for llms.txt:", e);
  }

  const lines = [
    `# ${SITE.title} — ${SITE.tagline}`,
    ``,
    `> ${SITE.description}`,
    ``,
    `Author: ${AUTHOR.name} (${AUTHOR.url})`,
    `Location: Da Nang, Vietnam`,
    `Website: ${baseUrl}`,
    `Full text: ${baseUrl}/llms-full.txt`,
    ``,
    `## Articles & Guides`,
    ``,
  ];

  for (const post of posts) {
    const title = post.data?.title || post.title || "Untitled";
    const excerpt = post.data?.excerpt || post.excerpt || "";
    const slug = post.slug || post.id;
    const url = `${baseUrl}/articles/${slug}/`;

    lines.push(`- [${title}](${url}): ${excerpt}`);
  }

  lines.push(``);
  lines.push(`## Topics`);
  lines.push(`- Motoring & Scooter Regulations (50cc vs 125cc+, International Driving Permits)`);
  lines.push(`- Expat Cost of Living Realities & Housing`);
  lines.push(`- Coffee Culture (Robusta vs Specialty Arabica, 24/7 Co-working spaces)`);
  lines.push(`- Western & International Food Neighborhoods`);
  lines.push(`- Essential Apps (Grab, Xanh SM, Zalo, bTaskee, banking & payments)`);
  lines.push(`- Local Shopping & Avoiding Tourist Traps`);

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
};
