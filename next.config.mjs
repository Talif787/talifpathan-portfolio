/**
 * Content-Security-Policy note.
 *
 * This site loads nothing from anywhere else: fonts are self-hosted by
 * next/font, icons are inlined SVG, all content is static TypeScript, and there
 * is no fetch call in the codebase. So `default-src 'self'` with an empty
 * `connect-src` is not aspirational here, it is literally accurate.
 *
 * `script-src` keeps 'unsafe-inline' because Next inlines the RSC flight
 * payload and the JSON-LD block. The strict alternative is a nonce, which
 * requires middleware, and middleware forces every request to render
 * dynamically. That would trade a static CDN-cached page for a function
 * invocation per visit, on a plan metered by function invocations, to defend
 * against script injection on a page with no user input, no query-param
 * rendering and no third-party script. That is a bad trade, so it is not made.
 *
 * The directives doing the real work here are frame-ancestors, base-uri,
 * form-action, object-src and connect-src. Those are all strict.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "manifest-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'none'",
  "form-action 'none'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  images: {
    formats: ["image/avif", "image/webp"],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Permissions-Policy",
            value: [
              "accelerometer=()",
              "camera=()",
              "geolocation=()",
              "gyroscope=()",
              "microphone=()",
              "payment=()",
              "usb=()",
            ].join(", "),
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "X-DNS-Prefetch-Control", value: "off" },
        ],
      },
      {
        // Fingerprinted build output is immutable by construction.
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
