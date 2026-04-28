import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   output: 'export', // Ye line zaroori hai static export ke liye
  images: {
    unoptimized: true, // GitHub pages images ko optimize nahi kar pata
  },
  trailingSlash: true,
};

export default nextConfig;
