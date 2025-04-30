import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack(config) {
    config.optimization.minimize = false;
    return config;
  },
};

export default nextConfig;
