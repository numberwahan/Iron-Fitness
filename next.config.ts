import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // for Docker / Cloud Run
};

export default nextConfig;
