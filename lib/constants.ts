export const EC2_API_URL = 'http://18.190.218.92:8001';

export const CATEGORIES = [
  { id: 0, name: 'Ambient Flow', slug: 'ambient-flow', color: 'from-pink-500/20 to-rose-500/20', textColor: 'text-pink-300', icon: 'Waves' },
  { id: 1, name: 'Digital Void', slug: 'digital-void', color: 'from-blue-500/20 to-cyan-500/20', textColor: 'text-blue-300', icon: 'Hexagon' },
  { id: 2, name: 'Cosmic Dark', slug: 'cosmic-dark', color: 'from-purple-500/20 to-violet-500/20', textColor: 'text-purple-300', icon: 'Sparkles' },
] as const;

export const RESOLUTIONS = [
  { id: 0, name: '720p HD', label: '1280x720', apiName: '720p', mult: '1x', usd: '~$3' },
  { id: 1, name: '1080p FHD', label: '1920x1080', apiName: '1080p', mult: '1.5x', usd: '~$4.50' },
  { id: 2, name: '4K UHD', label: '3840x2160', apiName: '4k', mult: '3x', usd: '~$9' },
] as const;

export const STYLE_IDS = {
  'Ambient Flow': 0,
  'Digital Void': 1,
  'Cosmic Dark': 2,
} as const;

export const PURCHASE_DURATION = 30; // baseline duration in seconds

export interface Template {
  id: string;
  name: string;
  category: number;
  category_name: string;
  style_id: number;
  description: string;
  prompt: string;
  tags: string[];
  available_resolutions: string[];
  has_thumbnail: boolean;
  has_preview: boolean;
  thumbnail_url: string | null;
  preview_url: string | null;
}

export interface CatalogResponse {
  templates: Template[];
  categories: unknown[];
  resolutions: Record<string, { width: number; height: number }>;
  loop_duration: number;
}

export interface Purchase {
  template_id: string;
  resolution: string;
  tx_hash: string;
  wallet: string;
  purchased_at: string;
  hls_url: string;
}
