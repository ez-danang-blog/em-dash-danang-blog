import { defineMiddleware } from "astro:middleware";

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
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");

  // 5. Restrict Sensitive Device APIs
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  );

  // 6. Cross-Origin Window Isolation
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");

  // 7. Cross-Origin Asset Protection
  response.headers.set("Cross-Origin-Resource-Policy", "same-origin");

  // Skip strict CSP for EmDash CMS admin endpoints so administrative dashboard tools are unconstrained
  if (pathname.startsWith("/_emdash")) {
    return response;
  }

  // 8. Content Security Policy (Allows Cloudflare edge challenge/bot protection & scripts)
  const cspDirectives = [
    "default-src 'none'",
    "script-src 'self' 'unsafe-inline' https:",
    "object-src 'none'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self'",
    "connect-src 'self' https:",
    "frame-src 'self' https:",
    "child-src 'self' blob:",
    "worker-src 'self' blob:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ];

  response.headers.set("Content-Security-Policy", cspDirectives.join("; "));

  return response;
});
