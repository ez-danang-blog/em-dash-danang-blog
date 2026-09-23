import type { APIRoute } from "astro";
import { getEmDashCollection } from "emdash";
import { AUTHOR, SITE } from "../config";

function blocksToMarkdown(blocks: any[]): string {
  if (!Array.isArray(blocks)) return "";
  const parts: string[] = [];

  for (const block of blocks) {
    const text = (block.children || []).map((c: any) => c.text || "").join("");
    if (!text.trim()) continue;

    if (block.style === "h1") parts.push(`# ${text}`);
    else if (block.style === "h2") parts.push(`## ${text}`);
    else if (block.style === "h3") parts.push(`### ${text}`);
    else if (block.style === "h4") parts.push(`#### ${text}`);
    else if (block.style === "blockquote") parts.push(`> ${text}`);
    else if (block.listItem === "bullet") parts.push(`* ${text}`);
    else if (block.listItem === "number") parts.push(`1. ${text}`);
    else parts.push(text);
  }

  return parts.join("\n\n");
}

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
    console.error("Error loading posts for llms-full.txt:", e);
  }

  const lines = [
    `# ${SITE.title} — Full Knowledge Base`,
    ``,
    `> ${SITE.description}`,
    `Author: ${AUTHOR.name} (${AUTHOR.url})`,
    `Location: Da Nang, Vietnam`,
    `Website: ${baseUrl}`,
    ``,
    `---`,
    ``,
  ];

  for (const post of posts) {
    const title = post.data?.title || post.title || "Untitled";
    const excerpt = post.data?.excerpt || post.excerpt || "";
    const slug = post.slug || post.id;
    const url = `${baseUrl}/articles/${slug}/`;
    const content = post.data?.content || post.content;
    const bodyMd = typeof content === "string" ? content : blocksToMarkdown(content);

    lines.push(`## ${title}`);
    lines.push(`URL: ${url}`);
    if (excerpt) lines.push(`Summary: ${excerpt}`);
    lines.push(``);
    lines.push(bodyMd);
    lines.push(``);
    lines.push(`---`);
    lines.push(``);
  }

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
};
