import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import emdash, { local } from "emdash/astro";
import { sqlite } from "emdash/db";
import { d1, r2 } from "@emdash-cms/cloudflare";

const isCloudflare =
  process.env.DEPLOY_TARGET === "cloudflare" ||
  process.env.CF_PAGES === "1" ||
  Boolean(process.env.CI);

export default defineConfig({
  site: "https://danang.ezinner.com",
  output: "server",
  adapter: isCloudflare
    ? cloudflare({ prerenderEnvironment: "node" })
    : node({ mode: "standalone" }),
  image: {
    layout: "constrained",
    responsiveStyles: true,
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },
  integrations: [
    react(),
    emdash({
      database: isCloudflare
        ? d1({ binding: "DB", session: "auto" })
        : sqlite({ url: "file:./data.db" }),
      storage: isCloudflare
        ? r2({ binding: "MEDIA" })
        : local({ directory: "./uploads", baseUrl: "/_emdash/api/media/file" }),
    }),
  ],
  markdown: {
    shikiConfig: {
      themes: {
        light: "vitesse-light",
        dark: "vitesse-dark",
      },
      defaultColor: false,
      wrap: false,
    },
  },
  devToolbar: { enabled: false },
});
