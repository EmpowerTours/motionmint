'use client';

import VideoBackground from './VideoBackground';
import PitchLogo from './Logo';

const VIDEO_SRC = '/hls/templates/ambient-liquid-chrome/1080p/index.m3u8';

export default function ProblemSlide() {
  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      <VideoBackground src={VIDEO_SRC} />

      <div className="relative z-10 flex flex-col w-full h-full" style={{ color: 'white' }}>
        <div
          className="flex items-center justify-between"
          style={{ padding: 'clamp(16px, 2.5%, 40px) clamp(24px, 5.2%, 80px)' }}
        >
          <PitchLogo />
          <span />
        </div>

        <div
          className="flex-1 flex flex-col"
          style={{ padding: '0 clamp(24px, 5.2%, 80px)', paddingTop: 'clamp(8px, 1%, 20px)' }}
        >
          <h2
            style={{
              fontSize: 'clamp(28px, 4.2vw, 64px)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              lineHeight: 1.05,
            }}
          >
            The Problem with
            <br />
            <span style={{ opacity: 0.7 }}>Video Backgrounds</span>
          </h2>

          <div className="flex" style={{ marginTop: '3.5%', gap: '4%' }}>
            <div style={{ flex: '0 0 30%' }}>
              <p style={{ fontSize: 'clamp(13px, 1.05vw, 20px)', opacity: 0.9, lineHeight: 1.5 }}>
                Stock video sites charge $15-25 per clip with restrictive licensing.
                Creating custom motion backgrounds requires After Effects expertise
                and hours of render time. Streamers, presenters, and creators need
                affordable, high-quality alternatives.
              </p>
              <div className="flex items-end" style={{ marginTop: '8%', gap: 'clamp(8px, 0.8vw, 16px)' }}>
                <span style={{ fontSize: 'clamp(28px, 4.2vw, 64px)', fontWeight: 700, lineHeight: 1 }}>
                  $15B
                </span>
                <div style={{ paddingBottom: 'clamp(4px, 0.4vw, 10px)' }}>
                  <span style={{ fontSize: 'clamp(13px, 1.05vw, 20px)', opacity: 0.8, display: 'block' }}>Stock Video</span>
                  <span style={{ fontSize: 'clamp(13px, 1.05vw, 20px)', opacity: 0.8, display: 'block' }}>Market 2025</span>
                </div>
              </div>
            </div>

            <div style={{ flex: '0 0 38%' }}>
              <p style={{ fontSize: 'clamp(13px, 1.05vw, 20px)', opacity: 0.9, lineHeight: 1.5 }}>
                AI video generation has reached a tipping point. Models like Replicate&apos;s
                minimax/video-01-live can produce cinematic-quality backgrounds in minutes
                at a fraction of the cost. But there&apos;s no marketplace for these — buyers still
                use legacy stock video platforms with Web2 DRM and subscriptions.
              </p>
              <p style={{ fontSize: 'clamp(13px, 1.05vw, 20px)', opacity: 0.9, lineHeight: 1.5, marginTop: '3%' }}>
                MotionMint bridges this gap: AI-generated video backgrounds, sold
                individually with on-chain payment, streamed instantly via HLS.
                No subscription. No DRM headaches. Pay once, stream forever.
              </p>
            </div>

            <div style={{ flex: '0 0 20%' }}>
              <span style={{ fontSize: 'clamp(28px, 4.2vw, 64px)', fontWeight: 700, lineHeight: 1, display: 'block' }}>
                24
              </span>
              <p style={{ fontSize: 'clamp(13px, 1.05vw, 20px)', opacity: 0.8, lineHeight: 1.4, marginTop: '6%' }}>
                Premium templates at launch across 3 categories — Ambient Flow, Digital Void, and Cosmic Dark.
              </p>
            </div>
          </div>
        </div>

        <div
          className="flex items-center justify-end"
          style={{
            padding: 'clamp(16px, 2%, 32px) clamp(24px, 5.2%, 80px)',
            fontSize: 'clamp(12px, 1.05vw, 20px)',
            opacity: 0.6,
          }}
        >
          AI x Blockchain
        </div>
      </div>
    </div>
  );
}
