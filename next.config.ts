import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: '/hls/:path*',
        destination: 'http://18.190.218.92:8001/hls/:path*',
      },
    ];
  },
};

export default nextConfig;
