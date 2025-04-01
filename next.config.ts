/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  },
  images: {
    formats: ['image/webp'],
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/sign-in',
      },
    ];
  },
};

module.exports = nextConfig;
