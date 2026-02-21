import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  serverExternalPackages: ["pdf-parse"], // dose not sit well with next bundler
};

export default nextConfig;
