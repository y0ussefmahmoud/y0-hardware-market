import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

import path from "path";

const nextConfig: NextConfig = {
  // 1. Produce minimal self-contained deployment bundle (~50MB instead of 500MB+)
  output: 'standalone',

  // Allow local dev origins for cross-device testing and local proxies
  allowedDevOrigins: ['10.20.0.1', 'localhost:3200', '127.0.0.1:3200'],

  // Ensure Webpack resolves @ alias reliably across all environments
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };
    return config;
  },

  // 2. Disable heavy background build workers to prevent server CPU saturation
  experimental: {
    workerThreads: false,
    cpus: 1,
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // 3. Optimize image memory overhead and allow dynamic hosts
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3200',
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

export default withNextIntl(nextConfig);
