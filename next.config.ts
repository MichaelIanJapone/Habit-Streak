import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pg", "@prisma/adapter-pg"],
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
