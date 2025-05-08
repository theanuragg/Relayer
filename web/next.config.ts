import type { NextConfig } from "next";

/** @type {NextConfig} */
const nextConfig: NextConfig = {
  webpack: (config) => {
    // Ensure `externals` is initialized
    if (!config.externals) {
      config.externals = [];
    }

    // If it's an array, push to it
    if (Array.isArray(config.externals)) {
      config.externals.push('pino-pretty', 'encoding');
    }

    return config;
  },
};

export default nextConfig;
