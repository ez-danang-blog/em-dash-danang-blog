import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { getEmDashCollection } from "emdash";
import { AUTHOR, SITE } from "../config";

export const GET: APIRoute = async (context) => {
  let posts: any[] = [];
  try {
    const result = await getEmDashCollection("posts", {
      limit: 100,
      orderBy: { published_at: "desc" },
    });
    posts = (result.entries || []).filter((p: any) => p.data?.status !== "draft");
  } catch (e) {
    console.error("Error loading posts for RSS feed:", e);
  }

  return rss({
    title: `${SITE.title} — ${SITE.tagline}`,
    description: SITE.description,
    site: context.site || SITE.url,
    items: posts.map((post) => {
      const pubDate =
        post.data?.published_at || post.published_at || post.data?.created_at || new Date();
      return {
        title: post.data?.title || post.title || "Untitled",
        description: post.data?.excerpt || post.excerpt || "",
        pubDate: new Date(pubDate),
        link: `/articles/${post.slug || post.id}/`,
        author: AUTHOR.name,
      };
    }),
    customData: `<language>${SITE.lang}</language>`,
  });
};
