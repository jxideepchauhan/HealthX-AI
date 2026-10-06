const path = require('node:path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../../'),
  },
  transpilePackages: ['@healthx/ui', '@healthx/types', '@healthx/shared'],
  async rewrites() {
    // Only rewrite if an explicit external API_BASE_URL is configured;
    // otherwise let Next.js internal App Router handle /api/v1/... with fixed demo data.
    if (process.env.API_BASE_URL) {
      return [
        {
          source: '/api/v1/:path*',
          destination: `${process.env.API_BASE_URL}/api/v1/:path*`,
        },
      ];
    }
    return [];
  },
};

module.exports = nextConfig;
