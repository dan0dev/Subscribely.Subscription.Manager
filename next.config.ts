import { withSentryConfig } from "@sentry/nextjs";

// Helper function to build the CSP header string. Keeps things tidy.
const getCspHeader = () => {
  const nonce = process.env.NODE_ENV === "production" ? "${process.env.CSP_NONCE}" : "";

  const policies = {
    // Default policy for anything not explicitly defined. 'self' means our own domain.
    "default-src": ["'self'"],
    "script-src": [
      "'self'", // Allow scripts from our own domain.
      // For Next.js development (HMR, etc.), 'unsafe-eval' is often needed.
      process.env.NODE_ENV === "development" ? "'unsafe-eval'" : "",
      // Use CSP nonce in production instead of unsafe-inline
      process.env.NODE_ENV === "development" ? "'unsafe-inline'" : nonce ? `'nonce-${nonce}'` : "",
      // Sentry's CDN for browser error tracking.
      "https://browser.sentry-cdn.com",
      // Add any other trusted script CDNs or domains here.
    ].filter(Boolean), // This nifty trick removes empty strings
    "style-src": [
      "'self'", // Allow stylesheets from our own domain.
      // Style nonce is challenging with many CSS-in-JS solutions, so keeping unsafe-inline
      // but you could consider using hashes for critical CSS if possible
      "'unsafe-inline'",
    ],
    "img-src": [
      "'self'", // Allow images from our own domain.
      "data:", // Allows base64 encoded images (often used for small icons or placeholders).
      // Replace broad https: with specific domains you need
      "https://via.placeholder.com",
      // Add other specific image domains you use
    ],
    "font-src": [
      "'self'", // Allow fonts from our own domain.
      "data:", // Allows base64 encoded fonts.
    ],
    "connect-src": [
      "'self'", // Allow connections (API calls, WebSockets) to our own domain.
      // Sentry's endpoint for sending error data - more specific than wildcard
      "https://o4505758147321856.ingest.sentry.io",
      // Arcjet's domains for its services - specific endpoints
      "https://api.arcjet.com",
      "wss://realtime.arcjet.com",
      // Add your specific API endpoints if on different domains
    ],
    // For web workers. Next.js might use blob workers.
    "worker-src": ["'self'", "blob:"],
    // Domains that are allowed to embed this page in an iframe.
    "frame-src": ["'self'"],
    // Disables <object>, <embed>, and <applet> elements. Generally a good idea.
    "object-src": ["'none'"],
    // URLs where forms on your site can submit data.
    "form-action": ["'self'"],
    // Prevents clickjacking by controlling which sites can embed yours.
    "frame-ancestors": ["'none'"],
    // Tells browsers to upgrade HTTP requests to HTTPS.
    "upgrade-insecure-requests": [],
    // Enable reporting to help debug CSP issues - uncomment and set up endpoint
    "report-to": ["default"],
    "report-uri": ["/api/csp-report"],
  };

  // This part just turns the 'policies' object into a valid CSP string.
  return Object.entries(policies)
    .map(([key, valueArray]) => {
      if (valueArray.length === 0) {
        return key; // For directives like 'upgrade-insecure-requests' that don't have values.
      }
      return `${key} ${valueArray.join(" ")}`;
    })
    .join("; ");
};

// Generate the CSP header value once.
const cspHeaderValue = getCspHeader();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: false, // User's setting. Note: `true` is generally recommended for catching issues early.
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    ARCJET_KEY: process.env.ARCJET_KEY,
    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
    CSP_NONCE: process.env.NODE_ENV === "production" ? `${Date.now().toString(36)}` : "",
  },
  images: {
    formats: ["image/webp"],
    contentDispositionType: "attachment",
    // This CSP is specific to images served by Next.js Image Optimization.
    // It's separate from the global CSP header we're setting below.
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/sign-in",
      },
    ];
  },
  // This function lets us add custom HTTP headers to responses.
  async headers() {
    return [
      {
        // Apply these headers to all routes in the application.
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            // Use the CSP string we generated. The replace just cleans up extra spaces.
            value: cspHeaderValue.replace(/\s{2,}/g, " ").trim(),
          },
          // Some extra security headers. Good to have!
          {
            // Prevents browsers from MIME-sniffing the content type.
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            // Controls if your site can be displayed in a <frame>, <iframe>, <embed> or <object>.
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            // Enables XSS filtering in older browsers. CSP is the preferred way now.
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            // Controls how much referrer information is sent with requests.
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            // Allows you to control which browser features can be used.
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          {
            key: "Report-To",
            value: '{"group":"default","max_age":31536000,"endpoints":[{"url":"/api/csp-report"}]}',
          },
          // Enable HSTS for production environments
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

export default withSentryConfig(nextConfig, {
  org: "dano-ky",
  project: "subtracker",
  silent: !process.env.CI, // Be quiet in CI environments.
  widenClientFileUpload: true,
  disableLogger: true,
  automaticVercelMonitors: true,
  // tunnelRoute: "/monitoring", // Uncomment if you're tunneling Sentry requests.
});
