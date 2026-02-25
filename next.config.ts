import type { NextConfig } from "next";

// Only these templates are publicly streamable (pitch deck / marketing previews)
const PUBLIC_TEMPLATES = [
  'ambient-midnight-silk',
  'ambient-liquid-chrome',
  'ambient-ink-bloom',
  'ambient-molten-gold',
  'ambient-smoke-layers',
  'ambient-crystal-refract',
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  async rewrites() {
    // Only allow public HLS access for pitch deck preview templates
    return PUBLIC_TEMPLATES.map((id) => ({
      source: `/hls/templates/${id}/:path*`,
      destination: `http://18.190.218.92:8001/hls/templates/${id}/:path*`,
    }));
  },
};

export default nextConfig;
