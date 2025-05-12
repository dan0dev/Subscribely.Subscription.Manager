import { withSentryConfig } from "@sentry/nextjs";

// Build Content Security Policy (CSP) header dynamically
const getCspHeader = () => {
  const policies = {
    // Only allow resources from our own domain
    "default-src": ["'self'"],

    // Script sources
    "script-src": [
      "'self'",
      // Allow eval in development for Next.js hot reloading
      process.env.NODE_ENV === "development" ? "'unsafe-eval'" : "",
      // Allow inline scripts (consider removing this for better security)
      "'unsafe-inline'",
      // Sentry error tracking CDN
      "https://browser.sentry-cdn.com",
    ].filter(Boolean),

    // CSS style sources
    "style-src": [
      "'self'",
      // Allow inline styles
      "'unsafe-inline'",
    ],

    // Image sources
    "img-src": [
      "'self'",
      "data:", // Base64 encoded images
      "https://via.placeholder.com", // Placeholder images
    ],

    // Font sources
    "font-src": [
      "'self'",
      "data:", // Base64 encoded fonts
    ],

    // API and WebSocket connections
    "connect-src": [
      "'self'",
      // Sentry error reporting (update with your actual Sentry DSN)
      "https://o4509210060587008.ingest.de.sentry.io",
      // Arcjet security service
      "https://api.arcjet.com",
      "wss://realtime.arcjet.com",
    ],

    // Web workers
    "worker-src": ["'self'", "blob:"],

    // Embedding in frames
    "frame-src": ["'self'"],

    // Block all objects/embeds
    "object-src": ["'none'"],

    // Form submission
    "form-action": ["'self'"],

    // Block iframe embedding of our site
    "frame-ancestors": ["'none'"],

    // Force HTTPS (only in production)
    ...(process.env.NODE_ENV === "production" ? { "upgrade-insecure-requests": [] } : {}),

    // CSP violation reporting
    "report-to": ["default"],
    "report-uri": ["/api/csp-report"],
  };

  // Convert policies object to CSP string
  return Object.entries(policies)
    .map(([directive, sources]) => {
      if (sources.length === 0) {
        return directive;
      }
      return `${directive} ${sources.join(" ")}`;
    })
    .join("; ");
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Environment variables for client-side
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    ARCJET_KEY: process.env.ARCJET_KEY,
    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
  },

  // Image optimization settings
  images: {
    formats: ["image/webp"],
    contentDispositionType: "attachment",
    // CSP for Next.js image optimization (separate from main CSP)
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // URL redirects
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/sign-in",
      },
    ];
  },

  // HTTP headers for all responses
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: getCspHeader()
              .replace(/\s{2,}/g, " ")
              .trim(),
          },
          {
            // Block MIME type sniffing
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            // Block iframe embedding
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            // Enable XSS protection (legacy)
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            // Control referrer information
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            // Disable certain browser features
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          {
            // CSP violation reporting endpoint
            key: "Report-To",
            value: '{"group":"default","max_age":31536000,"endpoints":[{"url":"/api/csp-report"}]}',
          },
          // HTTPS enforcement in production
          ...(process.env.NODE_ENV === "production"
            ? [
                {
                  key: "Strict-Transport-Security",
                  value: "max-age=63072000; includeSubDomains",
                },
              ]
            : []),
        ],
      },
    ];
  },
};

// Wrap config with Sentry
export default withSentryConfig(nextConfig, {
  org: "dano-ky",
  project: "subtracker",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  disableLogger: true,
  automaticVercelMonitors: true,
});
