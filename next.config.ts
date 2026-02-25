import type { NextConfig } from "next";

// Templates used in the pitch deck (full HLS streams are public for demo)
const PITCH_TEMPLATES = [
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
    return [
      // Public: thumbnails and preview clips for all templates (gallery browsing)
      { source: '/hls/templates/:id/thumbnail.jpg', destination: 'http://18.190.218.92:8001/hls/templates/:id/thumbnail.jpg' },
      { source: '/hls/templates/:id/preview.mp4', destination: 'http://18.190.218.92:8001/hls/templates/:id/preview.mp4' },
      // Public: full HLS streams for pitch deck templates only
      ...PITCH_TEMPLATES.map((id) => ({
        source: `/hls/templates/${id}/:path*`,
        destination: `http://18.190.218.92:8001/hls/templates/${id}/:path*`,
      })),
      // All other HLS streams require authenticated access via /api/stream
    ];
  },
};

export default nextConfig;
