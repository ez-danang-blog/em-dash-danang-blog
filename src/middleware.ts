import { defineMiddleware } from "astro:middleware";

// Cloudflare Email Protection inline script hash (per Mozilla Observatory A+ standard)
const CF_EMAIL_DECODE_HASH = "'sha256-zZG66hYaIE7jakN3/b+tJgshBrGJl9R8csrzNZUciow='";

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  const pathname = context.url.pathname;

  // 1. Clickjacking Protection
  response.headers.set("X-Frame-Options", "DENY");

  // 2. MIME-Sniffing Defense
  response.headers.set("X-Content-Type-Options", "nosniff");

  // 3. Referrer Leakage Defense
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // 4. Strict Transport Security (HSTS): 1 year + subdomains
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );

  // 5. Restrict Sensitive Device APIs
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), browsing-topics=()"
  );

  // 6. Cross-Origin Window Isolation
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");

  // 7. Cross-Origin Asset Protection
  response.headers.set("Cross-Origin-Resource-Policy", "same-origin");

  // Skip strict CSP for EmDash CMS admin endpoints so administrative dashboard tools are unconstrained
  if (pathname.startsWith("/_emdash")) {
    return response;
  }

  // 8. Content Security Policy (Strict, zero unsafe-inline in scripts, default-src 'none')
  const cspDirectives = [
    "default-src 'none'",
    `script-src 'self' ${CF_EMAIL_DECODE_HASH}`,
    "object-src 'none'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self'",
    "connect-src 'self'",
    "frame-src 'none'",
    "worker-src 'self' blob:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ];

  response.headers.set("Content-Security-Policy", cspDirectives.join("; "));

  return response;
});
