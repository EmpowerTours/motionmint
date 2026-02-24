'use client';

import VideoBackground from './VideoBackground';
import LiquidGlassCard from './LiquidGlassCard';
import PitchLogo from './Logo';
import { Zap, DollarSign, Globe, Shield, Play } from 'lucide-react';

const VIDEO_SRC = '/hls/templates/ambient-crystal-refract/1080p/index.m3u8';

const cards = [
  {
    Icon: Zap,
    title: 'AI-Generated',
    description: 'Replicate models create cinematic backgrounds in minutes. No After Effects needed.',
  },
  {
    Icon: DollarSign,
    title: 'Pay-Per-Template',
    description: '$3-9 per background. No subscription. Purchase on-chain with MON or WMON.',
  },
  {
    Icon: Globe,
    title: 'HLS Streaming',
    description: 'Instant playback via HTTP Live Streaming. Embed in OBS, presentations, or websites.',
  },
  {
    Icon: Shield,
    title: 'On-Chain Receipts',
    description: 'Every purchase is a verifiable on-chain transaction. Transparent and permanent.',
  },
  {
    Icon: Play,
    title: 'Growing Library',
    description: '24 templates at launch with new additions monthly. Community-requested themes.',
  },
];

export default function SolutionSlide() {
  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      <VideoBackground src={VIDEO_SRC} />

      <div className="relative z-10 flex flex-col w-full h-full" style={{ color: 'white' }}>
        <div
          className="flex items-center justify-between"
          style={{ padding: 'clamp(16px, 2.5%, 40px) clamp(24px, 5.2%, 80px)' }}
        >
          <PitchLogo />
          <span style={{ fontSize: 'clamp(12px, 1.05vw, 20px)', opacity: 0.8 }}>Investor Deck</span>
          <span style={{ fontSize: 'clamp(12px, 1.05vw, 20px)', opacity: 0.8 }}>Page 002</span>
        </div>

        <div className="text-center" style={{ padding: '0 clamp(24px, 5.2%, 80px)' }}>
          <p style={{ fontSize: 'clamp(14px, 1.3vw, 24px)', opacity: 0.9 }}>Five Pillars of</p>
          <h2
            style={{
              fontSize: 'clamp(28px, 4.2vw, 64px)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              lineHeight: 1.05,
              marginTop: 'clamp(4px, 0.5%, 10px)',
            }}
          >
            The MotionMint Model
          </h2>
        </div>

        <div
          className="flex-1 flex flex-col"
          style={{
            padding: 'clamp(16px, 2%, 32px) clamp(24px, 5.2%, 80px)',
            gap: 'clamp(10px, 1.2vw, 25px)',
            minHeight: 0,
          }}
        >
          <div className="flex flex-1" style={{ gap: 'clamp(10px, 1.4vw, 27px)', minHeight: 0 }}>
            {cards.slice(0, 3).map((card) => (
              <GlassCard key={card.title} {...card} />
            ))}
          </div>
          <div className="flex flex-1" style={{ gap: 'clamp(10px, 1.3vw, 25px)', minHeight: 0 }}>
            {cards.slice(3, 5).map((card) => (
              <GlassCard key={card.title} {...card} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function GlassCard({
  Icon,
  title,
  description,
}: {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
}) {
  return (
    <LiquidGlassCard className="flex-1 flex">
      <div
        className="flex flex-col justify-end flex-1"
        style={{ padding: 'clamp(20px, 2.5vw, 48px)' }}
      >
        <Icon
          style={{
            width: 'clamp(32px, 3vw, 48px)',
            height: 'clamp(32px, 3vw, 48px)',
            marginBottom: 'clamp(10px, 1.2vw, 20px)',
          }}
          stroke="white"
          strokeWidth={1.5}
          fill="none"
        />
        <h3
          style={{
            fontSize: 'clamp(18px, 2vw, 36px)',
            fontWeight: 700,
            lineHeight: 1.15,
            marginBottom: 'clamp(6px, 0.6vw, 12px)',
          }}
        >
          {title}
        </h3>
        <p style={{ fontSize: 'clamp(12px, 1.05vw, 20px)', opacity: 0.8, lineHeight: 1.4 }}>
          {description}
        </p>
      </div>
    </LiquidGlassCard>
  );
}
